
# TRUTHLENS AI

> **See Beyond the Surface.**  
> Commercial AI Media Authenticity Intelligence and Deepfake Detection Platform.

TRUTHLENS AI is a cybersecurity and artificial intelligence research platform designed to inspect images and video to estimate whether digital media is authentic, synthetic, or manipulated.

---

## 🌟 Platform Highlights

- **Aesthetic Direction:** Futuristic **Midnight Aurora** semi-dark theme (midnight navy, slate surfaces, electric blue, violet, and restrained cyan accents).
- **Multi-Page Experience:** Complete layout with collapsible sidebar, global breadcrumbs, global search modal (`⌘K`), notifications dropdown, and responsive mobile navigation.
- **Media Scanner:** Interactive drag-and-drop file upload with format validation (JPG, PNG, WEBP), file size inspection, simulated progress visualization, and clear system status boundaries.
- **Intelligence Center:** Curated educational knowledge base examining GANs, Latent Diffusion models, FaceSwap artifacts, metadata forensics, and C2PA standards.
- **Research Lab:** Documented model architecture roadmap (EfficientNet-B4 + ViT fusion), dataset catalogs (FaceForensics++, DFDC, Celeb-DF), and target evaluation metrics.
- **Scaffolded Backend:** FastAPI architecture with API versioning (`/api/v1`), Pydantic models, async PostgreSQL schema architecture, and health status indicators.
- **Zero Hallucination Guarantee:** Phase 1 explicitly labels all analytics as demonstration data without fabricating model accuracy or fake inference results.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Custom Design Tokens (Midnight Aurora palette)
- **Icons & Motion:** Lucide React + Framer Motion
- **Visualizations:** Recharts (responsive area charts)
- **HTTP Client:** Axios with structured interceptors

### Backend
- **Framework:** Python 3.14 + FastAPI
- **Validation:** Pydantic v2 + Pydantic-Settings
- **Database Architecture:** SQLAlchemy 2.0 Async + AsyncPG for PostgreSQL
- **Testing:** Pytest + Pytest-AsyncIO + HTTPX

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 24 recommended)
- Python 3.10+ (Python 3.14 tested)

### 1. Backend Setup & Run

```bash
# Navigate to project root
cd "Deepfake Detection"

# Run tests
python -m pytest backend/tests

# Start FastAPI server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **API Documentation (Swagger):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check Endpoint:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 2. Frontend Setup & Run

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Run frontend in development mode
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── health.py        # Health check endpoint
│   │   │       └── router.py        # v1 router aggregator
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic Settings & environment
│   │   │   └── database.py          # SQLAlchemy async session scaffold
│   │   ├── schemas/
│   │   │   ├── health.py            # Health schemas
│   │   │   └── scan.py              # Staged scan schemas
│   │   ├── services/
│   │   │   └── health_service.py    # Health service logic
│   │   └── main.py                  # FastAPI app entry with CORS & error handlers
│   ├── tests/
│   │   └── test_health.py           # Pytest async test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                     # Axios API client
│   │   ├── components/
│   │   │   ├── layout/              # AppLayout, Sidebar, TopNav, Logo
│   │   │   └── ui/                  # Toast, Modal, Primitives (ProgressBar, Badges, EmptyState)
│   │   ├── data/                    # Demonstration data & knowledge base
│   │   ├── hooks/                   # useFileUpload, useToast, useLocalStorage
│   │   ├── pages/                   # Overview, Scanner, Results, History, Intelligence, Lab, Reports, Settings
│   │   ├── store/                   # AppContext global state
│   │   └── types/                   # TypeScript interfaces & types
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/
│   ├── architecture.md              # System architecture details
│   ├── design-system.md             # Tokens, typography, and component specs
│   └── phase-1-progress.md          # Completed roadmap & phase deliverables
├── .env.example
└── .gitignore
```

---

## 🔒 Security & Privacy Commitments
- No fake predictions or synthetic metrics are passed off as real AI results.
- Sensitive user media handling is designed with user-configurable retention policies.
- Environment variable separation for all connection strings and secrets.

