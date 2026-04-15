# 🧬 DruGraph - Clinical Drug Knowledge Graph & RAG System

A full-stack pharmaceutical intelligence platform combining **Neo4j Knowledge Graph**, **RAG (Retrieval-Augmented Generation)**, and **interactive visualization** for drug discovery, safety analysis, and therapeutic alternatives.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=flat&logo=neo4j&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

---

## 🎯 Features

### 🔍 **Semantic Search**
- Vector similarity search using sentence transformers
- Search by drug name, condition, mechanism, or target
- Real-time relevance scoring

### 🤖 **AI Assistant (RAG)**
- Hybrid retrieval: Vector search + Cypher queries
- Powered by LangChain + Groq LLM
- Explainable answers with source citations

### ⚠️ **Safety Checker**
- Multi-drug interaction analysis
- Severity classification (Critical/Major/Minor)
- Real-time conflict detection from Neo4j graph

### 🌐 **Knowledge Graph Visualization**
- Interactive force-directed graph
- Explore drug-target-category relationships
- Dynamic filtering and pathfinding

### 💊 **Therapeutic Alternatives**
- Find alternative medications by condition
- Ranked by interaction conflicts
- Same-category drug recommendations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Search  │  │Assistant │  │  Safety  │  │  Graph   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Vector Store │  │  RAG Engine  │  │ Neo4j Driver │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ Cypher
┌─────────────────────────────────────────────────────────────┐
│                    Neo4j Knowledge Graph                     │
│         Drugs ←→ Targets ←→ Categories ←→ Interactions      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **Neo4j Database** (AuraDB or local instance)
- **Groq API Key** (for LLM)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Harsha430/drugraph.git
cd drugraph
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example ../.env
# Edit .env with your Neo4j and Groq credentials

# Run backend server
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

Backend will be available at: `http://127.0.0.1:8000`

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📊 Data Pipeline

### Load DrugBank Data to Neo4j

```bash
cd backend

# 1. Parse DrugBank XML
python -m scripts.parse_drugbank

# 2. Enrich with RxNav data
python -m scripts.enrich_rxnav

# 3. Build embeddings
python -m scripts.build_embeddings

# 4. Load to Neo4j
python -m scripts.load_to_neo4j
```

**Data Sources:**
- DrugBank XML (`fulldb.xml`)
- RxNav API (drug interactions)
- Sentence Transformers (embeddings)

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# Neo4j Configuration
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEO4J_DATABASE=neo4j

# LLM Configuration
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant

# Embedding Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
VECTOR_INDEX_NAME=drug_embeddings
VECTOR_NODE_LABEL=Drug
VECTOR_TEXT_PROPERTY=rag_text
VECTOR_EMBEDDING_PROPERTY=embedding
```

---

## 📁 Project Structure

```
drugraph/
├── backend/
│   ├── api/
│   │   └── main.py              # FastAPI endpoints
│   ├── core/
│   │   ├── config.py            # Environment config
│   │   └── schemas.py           # Pydantic models
│   ├── db/
│   │   └── neo4j.py             # Neo4j driver
│   ├── services/
│   │   └── rag.py               # RAG engine
│   ├── scripts/
│   │   ├── parse_drugbank.py   # XML parser
│   │   ├── enrich_rxnav.py     # Interaction enrichment
│   │   ├── build_embeddings.py # Vector generation
│   │   └── load_to_neo4j.py    # Graph loader
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, TopBar, etc.
│   │   │   └── pillars/         # Feature views
│   │   │       ├── Search/
│   │   │       ├── Assistant/
│   │   │       ├── Safety/
│   │   │       ├── Graph/
│   │   │       └── Alternatives/
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   ├── store/
│   │   │   └── index.ts         # Zustand state
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript types
│   │   └── App.tsx
│   └── package.json
├── datasets/                     # Processed CSV data
├── .env.example
└── README.md
```

---

## 🛠️ API Endpoints

### Search
- `POST /search` - Semantic drug search
  ```json
  { "query": "diabetes medication", "k": 5 }
  ```

### Assistant
- `POST /ask` - RAG-powered Q&A
  ```json
  { "question": "What are the side effects of Metformin?" }
  ```

### Safety
- `POST /check` - Multi-drug interaction check
  ```json
  { "drugs": ["Aspirin", "Warfarin"] }
  ```

### Graph
- `GET /graph?limit=200` - Knowledge graph data
- `GET /drug/{drug_id}` - Drug details with relationships

### Alternatives
- `GET /alternatives/{drug}/{condition}?current_meds=Med1,Med2`
  - Find therapeutic alternatives with minimal conflicts

---

## 🎨 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Neo4j** - Graph database
- **LangChain** - LLM orchestration
- **Sentence Transformers** - Embeddings
- **Groq** - Fast LLM inference

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **React Force Graph** - Graph visualization

---

## 🧪 Development

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Type Checking
```bash
cd frontend
npm run typecheck
```

### Build for Production
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm run build
```

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Contact

**Harsha** - [GitHub](https://github.com/Harsha430)

**Project Link:** [https://github.com/Harsha430/drugraph](https://github.com/Harsha430/drugraph)

---

## 🙏 Acknowledgments

- DrugBank for pharmaceutical data
- Neo4j for graph database technology
- Groq for fast LLM inference
- LangChain for RAG framework

---

**Built with ❤️ for clinical intelligence and drug safety**
