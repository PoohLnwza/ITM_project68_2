import json
import os
import glob
from typing import List
from langchain_core.documents import Document
from langchain_community.chat_models import ChatOllama
from langchain_huggingface import HuggingFaceEmbeddings
from ragas.testset import TestsetGenerator
from ragas.run_config import RunConfig

DATA_DIR = "../../frontend/data"
OUTPUT_FILE = "../data/dataset.json"

OLLAMA_MODEL = "llama3.1"
OLLAMA_URL = "http://127.0.0.1:11434"

# multilingual embedding (รองรับภาษาไทย)
EMBEDDING_MODEL = "BAAI/bge-m3"

TESTSET_SIZE = 10
MAX_DOCS = 30


# -----------------------------
# Load JSON documents
# -----------------------------

def load_documents() -> List[Document]:
    documents = []

    json_files = glob.glob(os.path.join(DATA_DIR, "*.json"))

    for file_path in json_files:
        print(f"Loading {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            modules = json.load(f)

        for module in modules:

            module_title = module.get("title", "Unknown Module")
            lab_id = module.get("id", "unknown")

            for section in module.get("sections", []):

                if section.get("type") == "content":

                    heading = section.get("heading", "")
                    text = section.get("text", "")

                    content = f"""
โมดูล: {module_title}
หัวข้อ: {heading}
เนื้อหา: {text}
"""

                    doc = Document(
                        page_content=content,
                        metadata={
                            "source": file_path,
                            "lab_id": lab_id,
                            "module": module_title
                        }
                    )

                    documents.append(doc)

    print("Total documents:", len(documents))

    return documents


# -----------------------------
# Generate Testset
# -----------------------------

def generate_testset(docs: List[Document]):

    print("Initializing models...")

    generator_llm = ChatOllama(
        model=OLLAMA_MODEL,
        base_url=OLLAMA_URL,
        temperature=0
    )

    critic_llm = ChatOllama(
        model=OLLAMA_MODEL,
        base_url=OLLAMA_URL,
        temperature=0
    )

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )

    generator = TestsetGenerator.from_langchain(
        generator_llm,
        critic_llm,
        embeddings
    )

    run_config = RunConfig(
        max_retries=3,
        timeout=120,
        max_workers=4
    )

    print("Generating testset...")

    testset = generator.generate_with_langchain_docs(
        docs,
        testset_size=TESTSET_SIZE,
        run_config=run_config
    )

    df = testset.to_pandas()

    df.to_json(
        OUTPUT_FILE,
        orient="records",
        force_ascii=False,
        indent=2
    )

    print("Dataset saved:", OUTPUT_FILE)


# -----------------------------
# Main
# -----------------------------

if __name__ == "__main__":

    docs = load_documents()

    if docs:

        # จำกัดจำนวน document เพื่อให้เร็วขึ้น
        docs = docs[:MAX_DOCS]

        generate_testset(docs)

    else:
        print("No documents found")