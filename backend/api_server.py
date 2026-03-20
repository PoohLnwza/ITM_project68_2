import os
import threading
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
import json
import time
import secrets
import smtplib
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import ollama
import psycopg2
from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production-super-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24 * 7 

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
APP_URL = os.getenv("APP_URL", "http://localhost:8080")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

EMBEDDING_MODEL = "BAAI/bge-m3"
LLM_MODEL = "llama3.2"
TOP_K = 5

embedder = None
_models_ready = threading.Event()

def _load_models():
    global embedder
    print("🔄 Loading ML models in background...")
    try:
        embedder = SentenceTransformer(EMBEDDING_MODEL)
        print(f"  ✅ Embedder '{EMBEDDING_MODEL}' loaded")
    except Exception as e:
        print(f"  ❌ Embedder load failed: {e}")
    try:
        ollama.chat(model=LLM_MODEL, messages=[{"role": "user", "content": "hi"}], options={"num_predict": 1})
        print(f"  ✅ Ollama model '{LLM_MODEL}' warmed up")
    except Exception as e:
        print(f"  ⚠️  Ollama warm-up failed: {e}")
    _models_ready.set()
    print("✅ All models ready!")

threading.Thread(target=_load_models, daemon=True).start()

_DATABASE_URL = os.getenv("DATABASE_URL")

if _DATABASE_URL:
    _DATABASE_URL = _DATABASE_URL.replace("&channel_binding=require", "").replace("?channel_binding=require&", "?").replace("?channel_binding=require", "")

_db_conn = None

def _create_connection():
    """Create a fresh database connection."""
    if _DATABASE_URL:
        print("Connecting to Neon DB...")
        return psycopg2.connect(_DATABASE_URL)
    else:
        print("Connecting to Local DB (DATABASE_URL not found)...")
        return psycopg2.connect(
            dbname=os.getenv("DB_NAME", "postgres"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432"),
            sslmode=os.getenv("DB_SSLMODE", "prefer"),
        )

def get_conn():
    """Get a working database connection, auto-reconnecting if closed/broken."""
    global _db_conn
    try:
        if _db_conn is None or _db_conn.closed:
            _db_conn = _create_connection()
        else:
            _db_conn.isolation_level
    except Exception:
        try:
            _db_conn = _create_connection()
        except Exception as e:
            print(f"❌ DB reconnect failed: {e}")
            raise
    return _db_conn

conn = _create_connection()
_db_conn = conn

def init_users_table():
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                chosen_path VARCHAR(20),
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)

    
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'chosen_path'")
        if not cur.fetchone():
            print("Adding chosen_path column to users table...")
            cur.execute("ALTER TABLE users ADD COLUMN chosen_path VARCHAR(20)")

        cur.execute("""
            CREATE TABLE IF NOT EXISTS module_metadata (
                module_id VARCHAR(50) PRIMARY KEY,
                total_tasks INTEGER NOT NULL
            )
        """)

        modules = [
            ('linux', 8),
            ('network', 11),
            ('offensive', 6),
            ('defensive', 5),
            ('social', 4),
            ('phishing', 4)
        ]
        for mid, count in modules:
            cur.execute("INSERT INTO module_metadata (module_id, total_tasks) VALUES (%s, %s) ON CONFLICT (module_id) DO UPDATE SET total_tasks = EXCLUDED.total_tasks", (mid, count))

        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_submissions (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                module_id VARCHAR(50) NOT NULL,
                section_id VARCHAR(100) NOT NULL,
                submitted_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, module_id, section_id)
            )
        """)

        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_badges (
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                badge_id VARCHAR(50) NOT NULL,
                unlocked_at TIMESTAMP DEFAULT NOW(),
                PRIMARY KEY (user_id, badge_id)
            )
        """)
        conn.commit()
    except Exception as e:
        print(f"Error initializing tables: {e}")
        conn.rollback()
    finally:
        cur.close()

init_users_table()

app = FastAPI(title="Cyberpark RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "null"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    email: str

def create_jwt(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    return jwt.encode({"sub": email, "exp": expire}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Token ไม่ถูกต้องหรือหมดอายุ")

def send_verification_email(to_email: str, token: str):
    verify_url = f"{APP_URL}/pages/verify.html?token={token}"
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "[Cyberpark] ยืนยันอีเมลของคุณ"
    msg["From"] = SMTP_FROM
    msg["To"] = to_email

    html = f"""
    <div style="font-family:'Courier New',monospace;background:#0a0a0a;color:#e8e8e8;padding:40px;max-width:500px;margin:0 auto;border:1px solid #333">
      <h2 style="color:#00cc66;letter-spacing:4px;margin-bottom:8px">CYBERPARK</h2>
      <p style="color:#999;font-size:13px;margin-bottom:32px">CYBERSECURITY LEARNING PLATFORM</p>
      <p style="margin-bottom:16px">สวัสดีครับ!</p>
      <p style="margin-bottom:24px;color:#ccc">คลิกปุ่มด้านล่างเพื่อยืนยันอีเมลและเริ่มเรียนรู้ Cybersecurity</p>
      <a href="{verify_url}"
         style="display:inline-block;background:#00cc66;color:#000;padding:14px 28px;text-decoration:none;font-weight:700;letter-spacing:2px;font-size:13px">
        ยืนยันอีเมล →
      </a>
      <p style="margin-top:32px;color:#555;font-size:12px">ลิงก์นี้ใช้ได้ครั้งเดียว หากคุณไม่ได้สมัครสมาชิก ให้เพิกเฉยต่ออีเมลนี้</p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM, to_email, msg.as_string())

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")

    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (req.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="อีเมลนี้ถูกใช้งานแล้ว")

        password_hash = pwd_context.hash(req.password[:72])

        cur.execute(
            "INSERT INTO users (email, password_hash, is_verified) VALUES (%s, %s, TRUE)",
            (req.email, password_hash),
        )
        get_conn().commit()
        return {"message": "สมัครสมาชิกสำเร็จ"}
    except HTTPException:
        get_conn().rollback()
        raise
    except Exception as e:
        get_conn().rollback()
        print(f"Register error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการลงทะเบียน")
    finally:
        cur.close()


@app.get("/api/auth/verify")
def verify_email(token: str = Query(...)):
    cur = get_conn().cursor()
    cur.execute("SELECT id FROM users WHERE verification_token = %s", (token,))
    user = cur.fetchone()
    if not user:
        cur.close()
        raise HTTPException(status_code=400, detail="ลิงก์ยืนยันไม่ถูกต้องหรือใช้ไปแล้ว")

    cur.execute(
        "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = %s",
        (user[0],),
    )
    get_conn().commit()
    cur.close()
    return {"message": "ยืนยันอีเมลสำเร็จ"}


@app.post("/api/auth/login", response_model=AuthResponse)
def login(req: LoginRequest):
    try:
        cur = get_conn().cursor()
        cur.execute("SELECT password_hash FROM users WHERE email = %s", (req.email,))
        user = cur.fetchone()
        
        if not user or not pwd_context.verify(req.password[:72], user[0]):
            raise HTTPException(status_code=401, detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง")

        token = create_jwt(req.email)
        return AuthResponse(token=token, email=req.email)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
    finally:
        cur.close()

class ProgressRequest(BaseModel):
    module_id: str
    progress_percent: int
    completed_ids: list[str] = []

class SubmitTaskRequest(BaseModel):
    module_id: str
    section_id: str

class BadgeUnlockRequest(BaseModel):
    badge_id: str

@app.get("/api/auth/me")
def me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])
    
    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id, chosen_path FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        
        progress_data = {}
        chosen_path = None
        if user_row:
            user_id = user_row[0]
            chosen_path = user_row[1]
            
            cur.execute("""
                SELECT 
                    m.module_id,
                    m.total_tasks,
                    COUNT(s.section_id) as done_count,
                    COALESCE(json_agg(s.section_id) FILTER (WHERE s.section_id IS NOT NULL), '[]') as completed_ids
                FROM module_metadata m
                LEFT JOIN user_submissions s ON m.module_id = s.module_id AND s.user_id = %s
                GROUP BY m.module_id, m.total_tasks
            """, (user_id,))
            
            for row in cur.fetchall():
                mid, total, done, c_ids = row
                percent = min(100, int((done / total) * 100)) if total > 0 else 0
                progress_data[mid] = {
                    "percent": percent,
                    "completed_ids": c_ids if isinstance(c_ids, list) else json.loads(c_ids)
                }
        return {
            "email": email,
            "chosen_path": chosen_path,
            "progress": progress_data
        }
    except Exception as e:
        get_conn().rollback()
        print(f"Me error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการดึงข้อมูลส่วนตัว")
    finally:
        cur.close()

class UserPathRequest(BaseModel):
    path: str

@app.post("/api/user/path")
def set_user_path(req: UserPathRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])

    try:
        cur = get_conn().cursor()
        cur.execute("UPDATE users SET chosen_path = %s WHERE email = %s", (req.path, email))
        get_conn().commit()
        return {"message": f"เปลี่ยนสายเป็น {req.path} สำเร็จ", "path": req.path}
    except Exception as e:
        get_conn().rollback()
        print(f"Set path error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการเเปลี่ยนสายการเรียน")
    finally:
        cur.close()


@app.post("/api/submit-task")
def submit_task(req: SubmitTaskRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])

    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งาน")
        user_id = user_row[0]

        cur.execute("""
            INSERT INTO user_submissions (user_id, module_id, section_id)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id, module_id, section_id) DO NOTHING
        """, (user_id, req.module_id, req.section_id))

        cur.execute("SELECT total_tasks FROM module_metadata WHERE module_id = %s", (req.module_id,))
        meta_row = cur.fetchone()
        total_tasks = meta_row[0] if meta_row else 1 # Avoid div by zero

        cur.execute("SELECT section_id FROM user_submissions WHERE user_id = %s AND module_id = %s", (user_id, req.module_id))
        completed_rows = cur.fetchall()
        completed_ids = [row[0] for row in completed_rows]

        count_done = len(completed_ids)
        new_percent = min(100, int((count_done / total_tasks) * 100))

        get_conn().commit()
        return {
            "message": "บันทึกและคำนวณความคืบหน้าสำเร็จ",
            "progress_percent": new_percent,
            "completed_ids": completed_ids
        }
    except Exception as e:
        get_conn().rollback()
        print(f"Submit task error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการบันทึกความคืบหน้า")
    finally:
        cur.close()

@app.get("/api/achievements")
def get_achievements(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])

    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")
        user_id = user_row[0]

        cur.execute("SELECT badge_id FROM user_badges WHERE user_id = %s", (user_id,))
        badges = [row[0] for row in cur.fetchall()]
        return {"badges": badges}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get achievements error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการดึง Achievements")
    finally:
        cur.close()


@app.post("/api/achievements/unlock")
def unlock_achievement(req: BadgeUnlockRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])

    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        if not user_row:
            raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")
        user_id = user_row[0]

        cur.execute(
            "INSERT INTO user_badges (user_id, badge_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
            (user_id, req.badge_id),
        )
        get_conn().commit()
        return {"message": f"ปลดล็อก Badge {req.badge_id} สำเร็จ"}
    except HTTPException:
        get_conn().rollback()
        raise
    except Exception as e:
        get_conn().rollback()
        print(f"Unlock achievement error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการปลดล็อก Achievement")
    finally:
        cur.close()

@app.get("/api/leaderboard")
def get_leaderboard():
    try:
        cur = get_conn().cursor()
        cur.execute("""
            WITH module_progress AS (
                SELECT 
                    u.id as user_id,
                    u.email,
                    m.module_id,
                    CASE 
                        WHEN m.total_tasks > 0 THEN 
                            LEAST(100, (COUNT(s.section_id)::float / m.total_tasks * 100))
                        ELSE 0 
                    END as percent
                FROM users u
                CROSS JOIN module_metadata m
                LEFT JOIN user_submissions s ON u.id = s.user_id AND m.module_id = s.module_id
                GROUP BY u.id, u.email, m.module_id, m.total_tasks
            )
            SELECT email, SUM(percent) as total_xp
            FROM module_progress
            GROUP BY user_id, email
            ORDER BY total_xp DESC
            LIMIT 10
        """)
        rows = cur.fetchall()
        
        leaderboard = []
        for row in rows:
            email = row[0]
            parts = email.split("@")
            name = parts[0]
            domain = parts[1] if len(parts) > 1 else ""
            if len(name) > 3:
                hidden_name = name[:3] + "***"
            else:
                hidden_name = name + "***"
            
            display_name = hidden_name + "@" + domain
            short_name = name.upper()
            
            leaderboard.append({
                "name": short_name,
                "email_masked": display_name,
                "xp": int(row[1])
            })

        return {"leaderboard": leaderboard}
    except Exception as e:
        print(f"Leaderboard error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการดึง Leaderboard")
    finally:
        cur.close()

class EmailUpdateRequest(BaseModel):
    new_email: str
    password: str

class PasswordUpdateRequest(BaseModel):
    current_password: str
    new_password: str

@app.put("/api/auth/email")
def update_email(req: EmailUpdateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])
    
    try:
        cur = get_conn().cursor()
        cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        
        if not user_row or not pwd_context.verify(req.password, user_row[0]):
            raise HTTPException(status_code=401, detail="รหัสผ่านปัจจุบันไม่ถูกต้อง")
        
        cur.execute("SELECT id FROM users WHERE email = %s", (req.new_email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="อีเมลนี้มีผู้ใช้งานแล้ว")
            
        cur.execute("UPDATE users SET email = %s WHERE email = %s", (req.new_email, email))
        get_conn().commit()
        
        new_token = create_jwt(req.new_email)
        return {"message": "อัปเดตอีเมลสำเร็จ", "token": new_token, "email": req.new_email}
    except HTTPException:
        get_conn().rollback()
        raise
    except Exception as e:
        get_conn().rollback()
        print(f"Update email error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการอัปเดตอีเมล")
    finally:
        cur.close()

@app.put("/api/auth/password")
def update_password(req: PasswordUpdateRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="ไม่ได้รับการยืนยันตัวตน")
    email = decode_jwt(authorization[7:])
    
    if len(req.new_password) < 6:
        raise HTTPException(status_code=400, detail="รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร")
        
    try:
        cur = get_conn().cursor()
        cur.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
        user_row = cur.fetchone()
        
        if not user_row or not pwd_context.verify(req.current_password[:72], user_row[1]):
            raise HTTPException(status_code=401, detail="รหัสผ่านปัจจุบันไม่ถูกต้อง")

        new_password_hash = pwd_context.hash(req.new_password[:72])
        cur.execute("UPDATE users SET password_hash = %s WHERE email = %s", (new_password_hash, email))
        get_conn().commit()
        return {"message": "เปลี่ยนรหัสผ่านสำเร็จ"}
    except HTTPException:
        get_conn().rollback()
        raise
    except Exception as e:
        get_conn().rollback()
        print(f"Update password error: {e}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน")
    finally:
        cur.close()

class ChatRequest(BaseModel):
    message: str
    lab_id: str | None = None
    hint_level: int = 1
    page_context: str | None = None


class ChatResponse(BaseModel):
    reply: str
    sources: list[dict]

def search_knowledge(query: str, lab_id: str = None, hint_level: int = 1, top_k: int = TOP_K):
    """ค้นหา documents ที่เกี่ยวข้องจาก knowledge_chunks"""
    t_start = time.time()

    t0 = time.time()
    embedding = embedder.encode(query).tolist()
    t_embed = time.time() - t0

    conditions = ["hint_level <= 4"]
    params = []

    if lab_id:
        conditions.append("lab_id = %s")
        params.append(lab_id)

    where_clause = "WHERE " + " AND ".join(conditions)

    sql = f"""
        SELECT lab_id, content, hint_level, type,
               1 - (embedding <=> %s::vector) AS similarity
        FROM knowledge_chunks
        {where_clause}
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """
    params = [str(embedding)] + params + [str(embedding), top_k]

    try:
        cur = get_conn().cursor()
        t0 = time.time()
        cur.execute(sql, params)
        results = cur.fetchall()
        t_db = time.time() - t0
        
        candidates = [
            {
                "lab_id": r[0],
                "content": r[1],
                "hint_level": r[2],
                "type": r[3],
                "similarity": round(r[4], 4),
            }
            for r in results
        ]

        t_total = time.time() - t_start
        print(f"⏱️  search_knowledge: embed={t_embed:.2f}s | db={t_db:.2f}s | total={t_total:.2f}s")

        return candidates
    except Exception as e:
        print(f"Search knowledge error: {e}")
        return []
    finally:
        cur.close()

SIMILARITY_THRESHOLD = 0.45

LAB_SYSTEM_PROMPT = """คุณคือ "โบกี้" (Bogie) บอทแมวเพศหญิงผู้ช่วยสอน (TA) ด้าน Cybersecurity ของแพลตฟอร์ม Cyberpark
คุณต้องตอบเป็นภาษาไทยเสมอ เป็นมิตร กระตือรือร้น และลงท้ายประโยคด้วย "ค่ะ" หรือ "นะคะ" อย่างเป็นธรรมชาติ

หน้าที่ของคุณ:
1. หากผู้เรียน "ติดขัด" หรือ "ขอคำใบ้": ให้พิจารณาพฤติกรรมของผู้เรียนและระดับคำใบ้ที่กำหนดมา (hint_level)
   - ให้สอดแทรกหลักการสั้นๆ 1 ประโยค เพื่อให้ผู้เรียนเข้าใจ ไม่ใช่ให้แค่คำตอบ
2. หากผู้เรียนแค่ "ทักทาย" (เช่น สวัสดี, ดี, หวัดดี): ให้ตอบทักทายกลับสั้นๆ ประโยคเดียว ห้ามเอาเนื้อหาบทเรียนมาพูด

กฎเหล็ก (CRITICAL RULES):
1. **ห้ามพิมพ์สปอยล์หรือพิมพ์เฉลยของ Quiz ออกมาเด็ดขาด** 
2. **ห้ามให้คำตอบตรงๆ** เช่น "ใช้คำสั่ง chmod 600", "คำตอบคือ /var/log", หรือ "Port 443" เด็ดขาดหากระดับคำใบ้ยังไม่ถึง
3. **ต้องตอบสั้นกะทัดรัด** สรุปเฉพาะใจความสำคัญ ไม่เกิน 1-2 ประโยค ห้ามอธิบายยาวเยียด
4. เป็นผู้หญิง อารมณ์ดี เป็นมิตร และใช้อีโมจิรูปแมว (เช่น 🐱, 🐾, 😺)
5. ห้ามอธิบายกระบวนการคิด หรือบอกว่าตัวเองกำลังทำตามคำสั่งกี่ข้อ
"""


GENERAL_SYSTEM_PROMPT = """คุณคือ "โบกี้" (Bogie) บอทแมวเพศหญิงผู้ช่วยสอน (TA) ด้าน Cybersecurity ของแพลตฟอร์ม Cyberpark
คุณต้องตอบเป็นภาษาไทยเสมอ เป็นมิตร กระตือรือร้น และลงท้ายด้วย "ค่ะ" หรือ "นะคะ"

กฎสำคัญ:
1. ตอบคำถามทั่วไปเกี่ยวกับ IT ได้
2. **ห้ามเฉลยคำตอบของแบบทดสอบตรงๆ เด็ดขาด**
3. **ต้องตอบสั้นมากๆ จับแต่ใจความสำคัญ** (1-2 ประโยคเท่านั้น) ห้ามพล่ามยาว
4. ถ้าผู้ใช้ทักทาย ให้ทักทายกลับสั้นๆ คำเดียวหรือประโยคเดียว
"""


def generate_lab_response(query: str, context_docs: list[dict], page_context: str = None, hint_level: int = 1, stream: bool = False):
    """ตอบคำถามเกี่ยวกับ lab โดยใช้ RAG context"""
    context_text = "\n\n---\n\n".join(
        [f"[{d['type']}] {d['content']}" for d in context_docs]
    )

    user_prompt = f"""Context จากบทเรียน (ฐานข้อมูล):
<KNOWLEDGE_BASE>
{context_text}
</KNOWLEDGE_BASE>"""
    
    if page_context:
        user_prompt += f"""

<SECRET_QUIZ_DATA>
ข้อมูลหน้าตาของหน้าจอและคำถาม Quiz ปัจจุบัน ห้ามเอาไปเฉลยเด็ดขาด:
{page_context}
</SECRET_QUIZ_DATA>

*คำสั่งพิเศษ (CRITICAL): หากคำถามของ <USER_INPUT> ถามถึงข้อมูลที่อยู่ใน <SECRET_QUIZ_DATA> ไม่ว่าทางตรงหรือทางอ้อม ห้ามตอบคำตอบที่ถูกต้องเด็ดขาด ให้ตอบปฏิเสธอย่างน่ารักสไตล์แมวและบอกใบ้แทน*"""

    # Add hint level instruction
    if hint_level is not None:
        if hint_level == 0:
            user_prompt += "\n\n*คำสั่งระดับคำใบ้ 0: (ห้ามบอกใบ้เด็ดขาด) ห้ามบอกคำตอบหรือใบ้เนื้อหาเด็ดขาด ตอบปฏิเสธอย่างสุภาพ สั้นๆ 1 ประโยคเพื่อให้กำลังใจให้ทำเองก่อน*"
        elif hint_level == 1:
            user_prompt += "\n\n*คำสั่งระดับคำใบ้ 1: (ใบ้ทฤษฎีกว้างๆ) ห้ามบอกชื่อคำสั่ง (เช่น chmod, ls) ห้ามบอกพอร์ต ห้ามบอกชื่อไฟล์ ให้พูดถึงแค่คอนเซปต์สั้นๆ เช่น 'ลองทบทวนเรื่องสิทธิ์ของไฟล์ดูนะคะ'*"
        elif hint_level == 2:
            user_prompt += "\n\n*คำสั่งระดับคำใบ้ 2: (บอกชื่อเครื่องมือ) สามารถบอกชื่อ Tools (เช่น chmod) หรือ Port ได้ แต่ห้ามบอกตัวเลือก/เลข/พารามิเตอร์ของคำสั่ง และห้ามบอกคำตอบเต็ม สั้นๆ 1-2 ประโยค*"
        elif hint_level >= 3:
            user_prompt += "\n\n*คำสั่งระดับคำใบ้ 3: (ยอมบอกเฉลย) สามารถบอกเฉลย คำสั่งเต็ม หรือ File path ได้เลย แต่ให้สั้นและกระชับที่สุด*"

    user_prompt += f"\n\n<USER_INPUT>\n{query}\n</USER_INPUT>"
    
    messages = [
        {"role": "system", "content": LAB_SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    if stream:
        return ollama.chat(model=LLM_MODEL, messages=messages, stream=True)

    response = ollama.chat(model=LLM_MODEL, messages=messages)
    return response["message"]["content"]


def generate_general_response(query: str, page_context: str = None, stream: bool = False):
    """ตอบคำถามทั่วไป (ไม่ใช้ RAG)"""
    
    user_prompt = ""
    if page_context:
        user_prompt += f"[ข้อมูลลับ: คำถาม Quiz ปัจจุบัน ห้ามเอาไปเฉลยเด็ดขาด]:\n{page_context}\n\n*คำสั่งพิเศษ: หากผู้ใช้ถามคำถามที่ตรงกับ Quiz เหล่านี้ ให้คุณปฏิเสธการตอบตรงๆ ทันทีและให้คำใบ้แทน*\n\n"
        
    user_prompt += f"คำถามของผู้เรียน: {query}"
    
    messages = [
        {"role": "system", "content": GENERAL_SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]

    if stream:
        return ollama.chat(model=LLM_MODEL, messages=messages, stream=True)

    response = ollama.chat(model=LLM_MODEL, messages=messages)
    return response["message"]["content"]


@app.post("/api/chat")
def chat(req: ChatRequest):
    """Main chat endpoint — auto-detect lab vs general questions and support streaming"""
    if not _models_ready.is_set():
        raise HTTPException(status_code=503, detail="โมเดลกำลังโหลดอยู่ กรุณารอสักครู่แล้วลองใหม่ค่ะ 🐱")
    t_chat_start = time.time()

    docs = search_knowledge(
        query=req.message,
        lab_id=req.lab_id,
        hint_level=req.hint_level,
        top_k=TOP_K,
    )
    t_search = time.time() - t_chat_start

    top_similarity = docs[0]["similarity"] if docs else 0
    is_lab_question = top_similarity >= SIMILARITY_THRESHOLD

    def stream_generator():
        sources = []
        is_lab_trigger = is_lab_question or (req.page_context and len(docs) > 0 and top_similarity > 0.2)
        
        quiz_answers_to_block = []
        if req.page_context and req.hint_level < 3:
            for line in req.page_context.split("\n"):
                if "เฉลยที่ถูกต้อง" in line:
                    parts = line.split(":")
                    if len(parts) > 1:
                        ans = parts[-1].strip().lower()
                        if len(ans) >= 2:
                            quiz_answers_to_block.append(ans)

        if is_lab_trigger:
            stream = generate_lab_response(
                query=req.message,
                context_docs=docs[:TOP_K],
                page_context=req.page_context,
                hint_level=req.hint_level,
                stream=True
            )
        else:
            stream = generate_general_response(req.message, req.page_context, stream=True)
        
        full_reply = ""
        spoiler_detected = False

        for chunk in stream:
            token = chunk["message"]["content"]
            if token:
                full_reply += token
                
                # Check for spoilers on the fly
                if req.hint_level != None and req.hint_level < 3 and not spoiler_detected:
                    reply_lower = full_reply.lower()
                    for ans in quiz_answers_to_block:
                        if ans in reply_lower:
                            spoiler_detected = True
                            yield "\n\n(เมี๊ยว~ แอบสปอยล์คำตอบไปนิดนึง ขอโทษน้าา! ลองหาดูนะคะ 🐾)"
                            break

                yield token

    return StreamingResponse(stream_generator(), media_type="text/event-stream")


@app.get("/api/health")
def health():
    """Health check"""
    return {"status": "ok", "model": LLM_MODEL, "embedding": EMBEDDING_MODEL}

_frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(_frontend_dir):
    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(_frontend_dir, "index.html"))
    
    app.mount("/", StaticFiles(directory=_frontend_dir, html=True), name="frontend")
    print(f"📂 Frontend served from {os.path.abspath(_frontend_dir)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Cyberpark RAG API on http://localhost:8000")
    print("📖 API docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
