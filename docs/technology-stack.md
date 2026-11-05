# TRUTHLENS AI — Technology Stack

> **Version:** 1.0  
> **Last Updated:** 2026-11-05  
> **Status:** Final recommended stack for all phases

---

## Stack Overview

The technology stack for TRUTHLENS AI is intentionally minimal and practical. Every technology chosen has a clear, specific purpose. No technology has been added for trend-following reasons.

---

## Frontend Technologies

### React 19 + TypeScript

**Why needed:** React provides the component model for building the interactive UI. TypeScript adds compile-time type safety, preventing entire categories of runtime bugs and making the codebase maintainable as it grows.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Current usage:** All 8 pages, all components, all hooks are TypeScript. Zero compile errors.

---

### Vite 8

**Why needed:** Vite is the development build tool. It provides extremely fast hot module replacement (HMR) during development and bundles the React app for production. It is significantly faster than the older Create React App approach.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Notes:** The existing `vite.config.ts` includes a proxy configuration that forwards `/api` requests to FastAPI during development. This eliminates CORS issues in development.

---

### Tailwind CSS v4

**Why needed:** Utility-first CSS framework. Tailwind v4 uses a `@theme {}` block in `index.css` instead of a separate `tailwind.config.js`. This allows design tokens (colors, fonts, spacing) to be defined centrally and used throughout the application.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Notes:** Do NOT upgrade to or expect `tailwind.config.js` — the project uses the v4 CSS-first configuration approach.

---

### Framer Motion 14

**Why needed:** Provides smooth, physics-based animations. Used for page transitions (opacity/y fade), navigation indicator animation (layoutId), mobile menu slide-in, and tab transitions in the Research Lab. All animations respect `prefers-reduced-motion`.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**When to remove/reduce:** No removal planned. Keep animations purposeful and restrained.

---

### React Router v7

**Why needed:** Client-side routing. Maps URLs to page components without full page reloads. Provides the `<Outlet>` pattern for nested layouts and `NavLink` for active state management.

**When needed:** ✅ Required now (Phase 1 — already implemented)

---

### Recharts 3

**Why needed:** Data visualization library for the weekly scan activity chart on the Overview dashboard. Built on D3.js but provides React-native components. Required when real scan data becomes available from the backend.

**When needed:** ✅ Required now (Phase 1 — already implemented, will display real data in Phase 4)

---

### Lucide React

**Why needed:** Icon library providing consistent SVG icons across the application. Used for navigation icons, status indicators, file upload UI, and action buttons. Lightweight — only imported icons are bundled.

**When needed:** ✅ Required now (Phase 1 — already implemented)

---

### Axios

**Why needed:** HTTP client for communicating with the FastAPI backend. Used instead of `fetch` because it provides automatic JSON serialization/deserialization, timeout support, and clean request/response interceptor hooks.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Current usage:** `api/client.ts` — health check, with interceptors ready for future scan API calls.

---

### Space Grotesk + IBM Plex Mono (via @fontsource)

**Why needed:** Typography is a core part of the TRUTHLENS AI brand identity.
- **Space Grotesk:** Modern geometric sans-serif for headings and body text. Loaded via `@fontsource/space-grotesk`.
- **IBM Plex Mono:** Monospaced font for technical labels, metadata, numbered section markers. Loaded via `@fontsource/ibm-plex-mono`.

**When needed:** ✅ Required now (Phase 1 — already implemented)

---

## Backend Technologies

### Python 3.10+

**Why needed:** Primary backend language. Required for FastAPI, PyTorch, OpenCV, Pillow, and all ML tooling. The project currently uses Python 3.14.6.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Notes:** Python 3.10+ is recommended for `match` statements and improved type annotations. Python 3.12+ is preferred for performance. Python 3.14 is used but is a newer release — ensure compatibility with PyTorch when moving to Phase 4.

---

### FastAPI

**Why needed:** Modern, high-performance Python web framework. Features automatic OpenAPI schema generation, Pydantic integration for request/response validation, async support via ASGI, and dependency injection.

**When needed:** ✅ Required now (Phase 1 — already implemented)

**Why not Django REST or Flask:** FastAPI is significantly faster, has native async support, and auto-generates API documentation. For an AI platform that will perform async file processing and model inference, FastAPI is the correct choice.

---

### Uvicorn

**Why needed:** ASGI server that runs the FastAPI application. The `[standard]` extras include `uvloop` (faster event loop) and `httptools` (faster HTTP parsing).

**When needed:** ✅ Required now (Phase 1 — already implemented)

---

### Pydantic v2 + Pydantic-Settings

**Why needed:** Data validation and settings management.
- **Pydantic v2:** Validates all API request and response data. Significantly faster than v1.
- **Pydantic-Settings:** Loads configuration from `.env` files via `BaseSettings`. Provides type-safe environment variable access.

**When needed:** ✅ Required now (Phase 1 — already implemented)

---

### SQLAlchemy 2.0 Async + AsyncPG

**Why needed:**
- **SQLAlchemy 2.0:** Python ORM for database interaction. The async version is used to avoid blocking the event loop during database queries.
- **AsyncPG:** High-performance async PostgreSQL driver for Python. Much faster than the standard `psycopg2`.

**When needed:** ⏳ Scaffolded in Phase 1; **activated in Phase 4** when scan history is implemented.

**Current state:** Engine and session factory are defined in `database.py` but not connected to a live database. All database operations are staged.

---

### PostgreSQL

**Why needed:** Relational database for storing scan history, user settings, and report metadata. PostgreSQL is chosen over SQLite because it supports concurrent connections, JSON columns (for storing detection signals), and scales to production.

**When needed:** ⏳ Required in **Phase 4**

**Recommended setup:**
- Development: Local PostgreSQL via Docker (`docker run --name truthlens-db -e POSTGRES_PASSWORD=... -p 5432:5432 -d postgres:16`)
- Production: Railway, Supabase, or Render PostgreSQL (free tiers available)

---

### PyTorch + torchvision

**Why needed:**
- **PyTorch:** Deep learning framework for training and running the detection model. Industry standard for research and production ML.
- **torchvision:** Provides pre-trained model weights (EfficientNet, ResNet, ConvNeXt) and image transformation utilities.

**When needed:** ⏳ Required in **Phase 2** (training) and **Phase 4** (inference)

**Hardware note (RTX 3050 / 4GB VRAM):** PyTorch supports CUDA 12.x on this GPU. Use `torch.cuda.is_available()` to verify. Training must use `batch_size` ≤ 16 to fit within 4GB VRAM.

---

### OpenCV (`opencv-python-headless`)

**Why needed:** Video frame extraction (Phase 5) and image preprocessing utilities. The `headless` variant is used in servers (no GUI dependencies).

**When needed:** ⏳ Required in **Phase 5** (video analysis)

**Note:** For Phase 4 image-only processing, Pillow is sufficient. Add OpenCV when video is added.

---

### Pillow

**Why needed:** Image loading, format verification, resizing, and preprocessing. Used in the backend to open uploaded images and prepare them for model inference.

**When needed:** ⏳ Required in **Phase 4**

**Add to requirements.txt:** `Pillow>=10.0.0`

---

### NumPy

**Why needed:** Numerical computing. Required by PyTorch and for postprocessing model outputs (softmax calculations, array operations, heatmap normalization).

**When needed:** ⏳ Required in **Phase 4** (installed automatically as PyTorch dependency)

---

### Pytest + Pytest-AsyncIO + HTTPX

**Why needed:**
- **Pytest:** Python testing framework. Used for backend unit and integration tests.
- **Pytest-AsyncIO:** Enables testing async FastAPI endpoints.
- **HTTPX:** Async HTTP client for testing FastAPI with `ASGITransport` (no actual server needed in tests).

**When needed:** ✅ Required now (Phase 1 — already implemented, 2 tests passing)

---

## Training Infrastructure

### Google Colab (Pro recommended)

**Why needed:** Cloud GPU access for model training. Your RTX 3050 with 4GB VRAM is sufficient for fine-tuning small models but will be very slow for training on large datasets like FaceForensics++.

**When needed:** ⏳ Required in **Phase 2** (model training)

**Free tier:** Provides T4 GPU (16GB VRAM) with limited daily hours.
**Pro tier (~\$10/month):** Provides A100/L4 GPUs with longer sessions. Recommended for Phase 2.

**Alternative:** Kaggle Notebooks (free, 30 hours/week GPU, P100 GPU).

---

### Git + GitHub

**Why needed:**
- **Git:** Version control. Track every change, create branches for experiments, roll back mistakes.
- **GitHub:** Remote repository hosting, collaboration, and CI/CD integration.

**When needed:** ✅ Required **immediately** — not yet initialized.

**Critical gap:** No git repository exists. This should be the very first remaining Phase 1 task.

---

## Technologies Intentionally Excluded

| Technology | Reason Excluded |
|---|---|
| Redux / Zustand | Overkill; React Context is sufficient for this application size |
| Next.js | Server-side rendering not needed; Vite + SPA is simpler and faster to develop |
| Docker (Phase 1) | Added in Phase 7 for deployment; not needed for development |
| Celery | Task queue for async ML inference; added only if inference takes >30s |
| Redis | Cache layer; added only if performance issues appear in production |
| GraphQL | REST is simpler and sufficient for this application |
| TensorFlow / Keras | PyTorch has better ecosystem for research-to-production workflows |
| Vue / Angular | React already chosen; consistency is more important than alternatives |
| Prisma | SQLAlchemy is already implemented; Prisma is for Node.js backends |

---

## Stack Summary Table

| Technology | Phase | Status |
|---|---|---|
| React 19 + TypeScript | 1 | ✅ Implemented |
| Vite 8 | 1 | ✅ Implemented |
| Tailwind CSS v4 | 1 | ✅ Implemented |
| Framer Motion 14 | 1 | ✅ Implemented |
| React Router v7 | 1 | ✅ Implemented |
| Recharts 3 | 1 | ✅ Implemented (ready for real data) |
| Lucide React | 1 | ✅ Implemented |
| Axios | 1 | ✅ Implemented |
| Space Grotesk + IBM Plex Mono | 1 | ✅ Implemented |
| FastAPI | 1 | ✅ Implemented |
| Uvicorn | 1 | ✅ Implemented |
| Pydantic v2 + Settings | 1 | ✅ Implemented |
| SQLAlchemy Async + AsyncPG | 1 | ✅ Scaffolded |
| Pytest + AsyncIO + HTTPX | 1 | ✅ Implemented |
| Git + GitHub | 1 | ❌ Not initialized |
| PostgreSQL | 4 | ⏳ Planned |
| PyTorch + torchvision | 2–4 | ⏳ Planned |
| Pillow | 4 | ⏳ Planned |
| NumPy | 4 | ⏳ Auto-installed with PyTorch |
| Google Colab | 2 | ⏳ Planned |
| OpenCV | 5 | ⏳ Planned (video only) |
| Docker | 7 | ⏳ Planned |

