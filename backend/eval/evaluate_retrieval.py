import os
import json
import glob
import psycopg2
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Dict
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

# Load .env file from root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

# ── Config ──────────────────────────────────────────────────────────────────
_DATABASE_URL = os.getenv("DATABASE_URL")
if _DATABASE_URL:
    _DATABASE_URL = _DATABASE_URL.replace("&channel_binding=require", "").replace("?channel_binding=require&", "?").replace("?channel_binding=require", "")

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "postgres"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
}

EMBEDDING_MODEL = "BAAI/bge-m3"
DATA_DIR = "../../frontend/data"

print(f"Loading embedding model: {EMBEDDING_MODEL}...")
embedder = SentenceTransformer(EMBEDDING_MODEL)

def get_connection():
    if _DATABASE_URL:
        return psycopg2.connect(_DATABASE_URL)
    return psycopg2.connect(**DB_CONFIG)

def vector_search(cur, query: str, top_k: int = 10) -> List[Dict]:
    """Search knowledge chunks using pgvector."""
    query_emb = embedder.encode(query, normalize_embeddings=True)
    
    sql = """
        SELECT lab_id, content, type,
               1 - (embedding <=> %s::vector) AS similarity
        FROM knowledge_chunks
        WHERE type != 'quiz'
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """
    cur.execute(sql, (query_emb.tolist(), query_emb.tolist(), top_k))
    rows = cur.fetchall()
    
    return [
        {"lab_id": r[0], "content": r[1], "type": r[2], "similarity": r[3]}
        for r in rows
    ]


def collect_quiz_data() -> List[Dict]:
    """Extract quiz questions from JSON files."""
    test_cases = []
    json_files = glob.glob(os.path.join(DATA_DIR, "*.json"))
    
    for file_path in json_files:
        with open(file_path, "r", encoding="utf-8") as f:
            modules = json.load(f)
            for module in modules:
                lab_id = module.get("id", "unknown")
                for section in module.get("sections", []):
                    if section.get("type") == "quiz":
                        test_cases.append({
                            "question": section.get("question"),
                            "expected_lab_id": lab_id,
                            "expected_answer": section.get("answer")
                        })
    return test_cases

def calculate_metrics(test_cases: List[Dict], ks=[1, 3, 5, 10]):
    """Evaluate Vector Only retrieval."""
    metrics = {
        "Vector Only": {k: {"hits": 0, "answer_recall": 0, "mrr": []} for k in ks}
    }
    total = len(test_cases)
    
    print(f"\nStarting evaluation on {total} quiz questions...")
    conn = get_connection()
    cur = conn.cursor()

    for i, case in enumerate(test_cases):
        query = case["question"]
        expected_id = case["expected_lab_id"]
        expected_ans = str(case["expected_answer"])
        
        # 1. Base Vector Search
        MAX_RETRIEVAL = 10
        results_list = vector_search(cur, query, top_k=MAX_RETRIEVAL)
        label = "Vector Only"
        
        found_rank = None
        ans_found_at_rank = None

        for rank, res in enumerate(results_list, 1):
            if found_rank is None and res["lab_id"] == expected_id:
                found_rank = rank
            if ans_found_at_rank is None and expected_ans.lower() in res["content"].lower():
                ans_found_at_rank = rank
            
        for k in ks:
            if found_rank and found_rank <= k:
                metrics[label][k]["hits"] += 1
                metrics[label][k]["mrr"].append(1.0 / found_rank)
            else:
                metrics[label][k]["mrr"].append(0.0)
            
            if ans_found_at_rank and ans_found_at_rank <= k:
                metrics[label][k]["answer_recall"] += 1

        if (i+1) % 10 == 0:
            print(f"Processed {i+1}/{total}...")

    cur.close()
    conn.close()

    # Reporting Comparison
    print("\n" + "="*75)
    print(f" RETRIEVAL PERFORMANCE: Vector Search")
    print("="*75)
    print(f"{'Metric':<25} | {'@1':<10} | {'@3':<10} | {'@5':<10} | {'@10':<10}")
    print("-" * 75)
    
    for label in ["Vector Only"]:
        hit_rates = [metrics[label][k]["hits"]/total for k in ks]
        ans_recalls = [metrics[label][k]["answer_recall"]/total for k in ks]
        mrr_vals = [np.mean(metrics[label][k]["mrr"]) for k in ks]
        
        print(f"{label + ' HR':<25} | {' | '.join([f'{h:<10.4f}' for h in hit_rates])}")
        print(f"{label + ' Ans':<25} | {' | '.join([f'{a:<10.4f}' for a in ans_recalls])}")
        print(f"{label + ' MRR':<25} | {' | '.join([f'{m:<10.4f}' for m in mrr_vals])}")
        print("-" * 75)

    # Plotting Comparison
    try:
        plt.style.use('seaborn-v0_8-muted')
        fig, ax = plt.subplots(figsize=(14, 8))
        
        x = np.arange(len(ks))
        width = 0.4

        # Using @1 values for the primary visual proof
        hr_vec = [metrics["Vector Only"][k]["hits"]/total for k in ks]
        
        rects1 = ax.bar(x, hr_vec, width, label='Vector Only', color='#3498db', alpha=0.8, edgecolor='white')

        ax.set_ylabel('Hit Rate (Accuracy)', fontsize=12, fontweight='bold')
        ax.set_title('Retrieval Performance: Vector Search', fontsize=16, fontweight='bold', pad=25)
        ax.set_xticks(x)
        ax.set_xticklabels([f'Top-{k} Depth' for k in ks], fontsize=11)
        ax.set_ylim(0, 1.15)
        
        # Add values on top
        def autolabel(rects):
            for rect in rects:
                height = rect.get_height()
                ax.annotate(f'{height:.2f}',
                            xy=(rect.get_x() + rect.get_width() / 2, height),
                            xytext=(0, 5), textcoords="offset points",
                            ha='center', va='bottom', fontsize=10, 
                            fontweight='bold', color='black')

        autolabel(rects1)

        ax.legend(loc='upper left', fontsize=11, frameon=True, shadow=True)
        ax.grid(axis='y', linestyle='--', alpha=0.5)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

        plt.tight_layout()
        plt.savefig('vector_retrieval_performance.png', dpi=300)
        print("\n[SUCCESS] Retrieval performance chart saved to vector_retrieval_performance.png")
    except Exception as e:
        print(f"\n[ERROR] Plotting failed: {e}")

if __name__ == "__main__":
    test_data = collect_quiz_data()
    if test_data:
        calculate_metrics(test_data)