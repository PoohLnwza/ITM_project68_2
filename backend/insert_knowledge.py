"""
insert_knowledge.py
====================
Insert module content into PostgreSQL knowledge_chunks table.
Supports any module JSON file that follows the standard format.

Usage:
    # Insert linux modules (default)
    python insert_knowledge.py

    # Insert a specific file
    python insert_knowledge.py --file /path/to/network-modules.json

    # Clear ALL data first, then insert
    python insert_knowledge.py --file linux-modules.json --clear

    # Clear only a specific module's data
    python insert_knowledge.py --clear-module networking

    # List what's currently in the database
    python insert_knowledge.py --list
"""

import argparse
import json
import os
import sys

import psycopg2
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

_DATABASE_URL = os.getenv("DATABASE_URL")

if _DATABASE_URL:
    # Clean Neon URL (psycopg2 incompatibility fixes)
    _DATABASE_URL = _DATABASE_URL.replace("&channel_binding=require", "").replace("?channel_binding=require&", "?").replace("?channel_binding=require", "")
    DB_URI = _DATABASE_URL
else:
    DB_CONFIG = {
        "dbname": os.getenv("DB_NAME", "postgres"),
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432"),
    }
    DB_URI = None

DEFAULT_DATA_DIR = os.getenv("DATA_DIR", "/Users/attachatchannakorn/secure-sensei/data")
DEFAULT_FILE = "linux-modules.json"
EMBEDDING_MODEL = "BAAI/bge-m3"  # 1024-dim, supports Thai


def parse_args():
    parser = argparse.ArgumentParser(
        description="Insert module knowledge into PostgreSQL pgvector database"
    )
    parser.add_argument(
        "--file", "-f",
        help="Path to module JSON file (default: linux-modules.json in data/)",
        default=None,
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear ALL existing data before inserting",
    )
    parser.add_argument(
        "--clear-module",
        metavar="MODULE_ID",
        help="Clear data for a specific module ID only (e.g., 'intro', 'networking')",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List current data in the database and exit",
    )
    return parser.parse_args()


def resolve_file(file_arg):
    if file_arg is None:
        return os.path.join(DEFAULT_DATA_DIR, DEFAULT_FILE)

    # If it's just a filename, look in data/ dir
    if not os.path.isabs(file_arg) and not os.path.exists(file_arg):
        in_data = os.path.join(DEFAULT_DATA_DIR, file_arg)
        if os.path.exists(in_data):
            return in_data

    return file_arg

def prepare_documents(modules):
    documents = []

    for module in modules:
        lab_id = module["id"]
        module_title = module["title"]

        for section in module["sections"]:
            sec_type = section["type"]

            if sec_type == "content":
                heading = section.get("heading", "")
                text = section.get("text", "")
                content = f"Tags: {lab_id}, {module_title}\nHeading: [{module_title}] {heading}\nContent: {text}"
                documents.append({
                    "lab_id": lab_id,
                    "content": content,
                    "hint_level": 0,
                    "type": "theory",
                })

            elif sec_type == "code":
                language = section.get("language", "bash")
                code = section.get("code", "")
                content = f"Tags: {lab_id}, {module_title}\nHeading: [{module_title}] Code Example ({language})\nCode:\n{code}"
                documents.append({
                    "lab_id": lab_id,
                    "content": content,
                    "hint_level": 0,
                    "type": "code",
                })

            elif sec_type in ["quiz", "siem_simulator", "sql_simulator", "idor_simulator", "cmd_simulator", "source_simulator", "xss_simulator", "ghost_simulator"]:
                question = section.get("question", "")
                answer = section.get("answer", "")
                hint_raw = section.get("hint", "")

                hints = {"1": hint_raw, "2": hint_raw, "3": hint_raw}
                
                import re
                l1 = re.search(r"Level 1:\s*(.*?)(?=Level 2:|$)", hint_raw, re.S | re.I)
                l2 = re.search(r"Level 2:\s*(.*?)(?=Level 3:|$)", hint_raw, re.S | re.I)
                l3 = re.search(r"Level 3:\s*(.*)", hint_raw, re.S | re.I)

                if l1: hints["1"] = l1.group(1).strip()
                if l2: hints["2"] = l2.group(1).strip()
                if l3: hints["3"] = l3.group(1).strip()

                # Level 0: Question Only
                documents.append({
                    "lab_id": lab_id,
                    "content": f"Tags: {lab_id}, {module_title}, quiz, question\nHeading: [{module_title}] ข้อมูล Quiz\nคำถาม: {question}",
                    "hint_level": 0,
                    "type": "quiz",
                })

                # Level 1: Question + Hint 1 (General)
                documents.append({
                    "lab_id": lab_id,
                    "content": f"Tags: {lab_id}, {module_title}, quiz, hint, general\nHeading: [{module_title}] คำใบ้ระดับ 1 (ทั่วไป)\nคำถาม: {question}\nคำใบ้: {hints['1']}",
                    "hint_level": 1,
                    "type": "quiz",
                })

                # Level 2: Question + Hint 1 + Hint 2 (Detailed)
                documents.append({
                    "lab_id": lab_id,
                    "content": f"Tags: {lab_id}, {module_title}, quiz, hint, detailed\nHeading: [{module_title}] คำใบ้ระดับ 2 (ปานกลาง)\nคำถาม: {question}\nคำใบ้ 1: {hints['1']}\nคำใบ้ 2: {hints['2']}",
                    "hint_level": 2,
                    "type": "quiz",
                })

                # Level 3: Question + Hint 1 + Hint 2 + Hint 3 (Specific)
                documents.append({
                    "lab_id": lab_id,
                    "content": f"Tags: {lab_id}, {module_title}, quiz, hint, specific\nHeading: [{module_title}] คำใบ้ระดับ 3 (เจาะจงที่ตอบได้จริง)\nคำถาม: {question}\nคำใบ้ 1: {hints['1']}\nคำใบ้ 2: {hints['2']}\nคำใบ้ 3: {hints['3']}",
                    "hint_level": 3,
                    "type": "quiz",
                })

                # Level 4: Answer (Secret)
                documents.append({
                    "lab_id": lab_id,
                    "content": (
                        f"Tags: {lab_id}, {module_title}, quiz, answer, secret\n"
                        f"Heading: [{module_title}] ข้อมูลลับ (ห้ามบอกเฉลยตรงๆ)\n"
                        f"คำถาม: {question}\n"
                        f"เฉลยที่ถูกต้อง: {answer}"
                    ),
                    "hint_level": 4,
                    "type": "quiz",
                })

    return documents

    return documents


# ── Main ────────────────────────────────────────────────
def main():
    args = parse_args()

    if DB_URI:
        print(f"Connecting to Neon DB...")
        conn = psycopg2.connect(DB_URI)
    else:
        print(f"Connecting to Local DB...")
        conn = psycopg2.connect(**DB_CONFIG)

    cur = conn.cursor()

    # Ensure table exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS knowledge_chunks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            lab_id TEXT NOT NULL,
            content TEXT NOT NULL,
            embedding VECTOR(1024) NOT NULL,
            hint_level INT NOT NULL DEFAULT 0,
            type TEXT DEFAULT 'theory',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()

    # ── List mode ──
    if args.list:
        cur.execute("""
            SELECT lab_id, type, hint_level, COUNT(*) 
            FROM knowledge_chunks 
            GROUP BY lab_id, type, hint_level 
            ORDER BY lab_id, type, hint_level
        """)
        rows = cur.fetchall()
        if not rows:
            print("Database is empty.")
        else:
            print(f"{'LAB_ID':<20} {'TYPE':<10} {'HINT':<6} {'COUNT':<6}")
            print("-" * 44)
            total = 0
            for r in rows:
                print(f"{r[0]:<20} {r[1]:<10} {r[2]:<6} {r[3]:<6}")
                total += r[3]
            print("-" * 44)
            print(f"Total: {total} documents")
        cur.close()
        conn.close()
        return

    # ── Clear all ──
    if args.clear:
        cur.execute("DELETE FROM knowledge_chunks")
        deleted = cur.rowcount
        conn.commit()
        print(f"Cleared {deleted} existing documents.")

    # ── Clear specific module ──
    if args.clear_module:
        cur.execute("DELETE FROM knowledge_chunks WHERE lab_id = %s", (args.clear_module,))
        deleted = cur.rowcount
        conn.commit()
        print(f"Cleared {deleted} documents for module '{args.clear_module}'.")
        if args.file is None:
            # Just clearing, no insert needed
            cur.close()
            conn.close()
            return

    # ── Load JSON ──
    json_path = resolve_file(args.file)
    if not os.path.exists(json_path):
        print(f"Error: File not found: {json_path}")
        sys.exit(1)

    print(f"[1/4] Loading {os.path.basename(json_path)} ...")
    with open(json_path, "r", encoding="utf-8") as f:
        modules = json.load(f)

    # ── Auto-Clear old data for these modules ──
    lab_ids = list(set([m.get("id") for m in modules if "id" in m]))
    if lab_ids:
        cur.execute("DELETE FROM knowledge_chunks WHERE lab_id = ANY(%s)", (lab_ids,))
        deleted_count = cur.rowcount
        conn.commit()
        if deleted_count > 0:
            print(f"      Auto-cleared {deleted_count} old records for modules: {lab_ids}")

    # ── Prepare documents ──
    print("[2/4] Preparing documents ...")
    documents = prepare_documents(modules)
    print(f"      {len(documents)} documents ready")

    # ── Load embedding model ──
    print(f"[3/4] Loading embedding model: {EMBEDDING_MODEL} ...")
    embedder = SentenceTransformer(EMBEDDING_MODEL)

    # ── Insert ──
    print("[4/4] Generating embeddings & inserting ...")
    for i, doc in enumerate(documents, 1):
        embedding = embedder.encode(doc["content"]).tolist()
        cur.execute(
            """
            INSERT INTO knowledge_chunks (lab_id, content, embedding, hint_level, type)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (doc["lab_id"], doc["content"], str(embedding), doc["hint_level"], doc["type"]),
        )
        print(f"   [{i}/{len(documents)}] {doc['type']:<8} | lab={doc['lab_id']:<15} | hint={doc['hint_level']}")

    conn.commit()
    cur.close()
    conn.close()

    print(f"\nDone! Inserted {len(documents)} documents from {os.path.basename(json_path)}.")


if __name__ == "__main__":
    main()
