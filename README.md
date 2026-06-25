# Cyberpark (Secure Sensei Platform)

Cyberpark is a full-stack cybersecurity learning platform designed for both technical and non-technical paths. The platform offers hands-on simulator labs, theory-based learning, a global leaderboard, and an interactive RAG-based AI Sensei chatbot.

The backend is built with FastAPI, using Sentence-Transformers and Ollama for Retrieval-Augmented Generation (RAG). The frontend is a static web application built with vanilla HTML/CSS/JS and served via Nginx. Database management is handled via PostgreSQL (local or Neon Cloud).

---

## Directory Structure

* **backend/**: The Python FastAPI application, including the API server (`api_server.py`), knowledge ingestion script (`insert_knowledge.py`), and dependencies.
* **frontend/**: The user interface files including HTML, CSS, JavaScript, assets, components, and course pages.
* **database/**: Database schema and initialization scripts (`init.sql` and `knowledgechunk.sql`).
* **charter/**: Project documentation, user manual, and technical specifications.
* **docker-compose.yml**: Configuration file to run the entire stack in containers.

---

## Features

* **Learning Paths**: Structured courses for both Technical and Non-Technical students.
* **Interactive Simulators**: Labs for Phishing, Social Engineering, Linux commands, Network security, Defensive, and Offensive security.
* **AI Sensei Chatbot**: A RAG-powered cybersecurity assistant capable of answering questions, guiding users, and delivering hints based on the learning module contexts.
* **Leaderboard and Progress**: Tracking completion percentage, rank updates, and total XP with global rankings.

---

## Tech Stack

* **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+), Nginx
* **Backend**: FastAPI, Uvicorn, Python 3.11
* **Database**: PostgreSQL with `pgvector` extension
* **AI/RAG**: Ollama (LLM inference), Sentence-Transformers (`BAAI/bge-m3` embedding model)

---

## Prerequisites

Before starting, ensure you have the following installed:
* Docker and Docker Compose
* Ollama (with the target LLM pulled, e.g., llama3) installed on your host machine

---

## Getting Started

### 1. Environment Configuration

Create a `.env` file in the root directory (same folder as `docker-compose.yml`) with the following environment variables:

```env
# Database Settings
DATABASE_URL=postgresql://username:password@host:port/database_name
# Or individual DB connection configs:
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=host.docker.internal
DB_PORT=5432
DB_SSLMODE=prefer

# Authentication Settings
JWT_SECRET=your_jwt_secret_key_here

# Mailer Settings (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=your-email@gmail.com

# App Configuration
APP_URL=http://localhost:8080
```

### 2. Run with Docker Compose

Run the following command to start both the FastAPI backend and Nginx web server:

```bash
docker-compose up --build
```

The services will be available at:
* Frontend: [http://localhost:8080](http://localhost:8080)
* Backend API: [http://localhost:8000](http://localhost:8000)

---

## Database & Knowledge Ingestion

To seed the AI chatbot with training module knowledge, use the ingestion script.

### Local Python Ingestion Setup

1. Install backend dependencies locally:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Seed data into the database:
   ```bash
   # Insert default linux modules
   python insert_knowledge.py --file data/linux-modules.json
   
   # List currently ingested modules
   python insert_knowledge.py --list
   ```

---

## Development

If you prefer to run services individually without Docker:

### Running Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn api_server:app --host 127.0.0.1 --port 8000 --reload
```

### Running Frontend Locally

You can serve the `frontend` folder using any static web server, such as:
```bash
cd frontend
python -m http.server 8080
```
