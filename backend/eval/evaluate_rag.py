import json
import os
import psycopg2
import ollama
from sentence_transformers import SentenceTransformer
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset
from langchain_community.chat_models import ChatOllama
from dotenv import load_dotenv
import pandas as pd

# Load .env file from root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

# ── Config (Match api_server.py) ──────────────────────────────────────────────
_DATABASE_URL = os.getenv("DATABASE_URL")
if _DATABASE_URL:
    # Clean Neon URL (psycopg2 incompatibility fixes)
    _DATABASE_URL = _DATABASE_URL.replace("&channel_binding=require", "").replace("?channel_binding=require&", "?").replace("?channel_binding=require", "")

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
}
EMBEDDING_MODEL = "BAAI/bge-m3"
LLM_MODEL = "llama3.1"
TOP_K = 5
SIMILARITY_THRESHOLD = 0.4

# Initialize models
embedder = SentenceTransformer(EMBEDDING_MODEL)
eval_llm = ChatOllama(model="llama3.1", base_url="http://localhost:11434")

def search_knowledge(query, top_k=5):
    if _DATABASE_URL:
        conn = psycopg2.connect(_DATABASE_URL)
    else:
        conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    query_emb = embedder.encode(query).tolist()
    cur.execute(
        "SELECT lab_id, content, 1 - (embedding <=> %s) AS similarity, type FROM knowledge_chunks ORDER BY similarity DESC LIMIT %s",
        (str(query_emb), top_k),
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    results = []
    for r in rows:
        results.append({
            "lab_id": r[0],
            "content": r[1],
            "similarity": float(r[2]),
            "type": r[3]
        })
    
    return results

def get_rag_response(query):
    docs = search_knowledge(query, top_k=TOP_K)
    context_text = "\n\n".join([d["content"] for d in docs])
    
    system_prompt = "You are Bogie, a cute cybersecurity cat mentor. Use the context to answer. Be concise."
    user_prompt = f"Context:\n{context_text}\n\nQuestion: {query}"
    
    response = ollama.chat(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    
    return response["message"]["content"], [d["content"] for d in docs[:5]]

def run_evaluation():
    dataset_path = "../data/dataset.json"
    if not os.path.exists(dataset_path):
        print(f"Error: {dataset_path} not found. Run generate_testset.py first.")
        return

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = []
    answers = []
    contexts = []
    ground_truths = []

    print(f"Evaluating {len(data)} samples...")
    for i, item in enumerate(data):
        query = item["question"]
        gt = item["ground_truth"]
        
        print(f"[{i+1}/{len(data)}] Query: {query[:50]}...")
        ans, ctx = get_rag_response(query)
        
        questions.append(query)
        answers.append(ans)
        contexts.append(ctx)
        ground_truths.append(gt)

    # Create Dataset for Ragas
    ds_dict = {
        "question": questions,
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths
    }
    dataset = Dataset.from_dict(ds_dict)

    # Ragas Evaluation
    print("Running Ragas metrics...")
    # Map metrics to use our local Ollama model
    result = evaluate(
        dataset,
        metrics=[
            faithfulness,
            answer_relevancy,
            context_precision,
            context_recall,
        ],
        llm=eval_llm,
        embeddings=eval_llm # Ragas can use the same LLM for embeddings if needed, or we can use OllamaEmbeddings
    )

    print("\nEvaluation Results:")
    print(result)
    
    # Save results
    result_df = result.to_pandas()
    result_df.to_csv("eval_results.csv", index=False)
    print("Results saved to eval_results.csv")

if __name__ == "__main__":
    run_evaluation()
