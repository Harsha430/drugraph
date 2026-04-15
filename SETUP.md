# 🚀 DruGraph Setup Guide

Quick setup instructions for getting DruGraph running locally.

---

## ⚡ Quick Start (5 Minutes)

### 1. Clone Repository

```bash
git clone https://github.com/Harsha430/drugraph.git
cd drugraph
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env with your credentials
# Required: NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, GROQ_API_KEY
```

### 4. Start Backend

```bash
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

✅ Backend running at: `http://127.0.0.1:8000`

### 5. Frontend Setup (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## 📊 Load Data (Optional)

If you have DrugBank XML data:

```bash
cd backend

# 1. Parse DrugBank XML
python -m scripts.parse_drugbank

# 2. Enrich with RxNav
python -m scripts.enrich_rxnav

# 3. Build embeddings
python -m scripts.build_embeddings

# 4. Load to Neo4j
python -m scripts.load_to_neo4j
```

---

## 🔑 Required API Keys

### Neo4j Database
1. Sign up at [Neo4j AuraDB](https://neo4j.com/cloud/aura/)
2. Create a free instance
3. Copy connection URI, username, and password

### Groq API
1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate API key
3. Copy to `.env` file

---

## ✅ Verify Installation

### Backend Health Check
```bash
curl http://127.0.0.1:8000/health
# Should return: {"status":"ok"}
```

### Frontend
Open browser: `http://localhost:5173`

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.9+)
- Verify virtual environment is activated
- Check `.env` file exists and has correct values

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### CORS errors
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS settings in `backend/api/main.py`

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [backend/README.md](backend/README.md) for API details
- Check [frontend/README.md](frontend/README.md) for UI details

---

**Happy coding! 🎉**
