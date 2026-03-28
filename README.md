<p align="center">
  <img src="frontend/image.png" alt="Eco-Commit AI" width="120" />
</p>

<h1 align="center">🌿 Eco-Commit AI</h1>

<p align="center">
  <strong>Track your eco-friendly habits. Measure your CO₂ savings. Get AI-powered sustainability insights.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" /></a>
  <a href="#"><img src="https://img.shields.io/badge/python-3.10%20%7C%203.11-blue" alt="Python" /></a>
  <a href="#"><img src="https://img.shields.io/badge/framework-FastAPI-009688" alt="FastAPI" /></a>
  <a href="#"><img src="https://github.com/amangupta982/Eco-Commit-AI/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

---

## 💡 What is Eco-Commit AI?

Eco-Commit AI is a full-stack sustainability tracker that helps individuals **log eco-friendly daily habits** and see the real-world environmental impact of their choices.

**The idea is simple:** every time you choose to walk instead of drive, cycle instead of taking a cab, use public transport, turn off the AC, or avoid unnecessary refrigerator use — you're saving CO₂. Eco-Commit AI **quantifies that impact**, turns it into eco-points, builds streaks, and provides **AI-powered recommendations** to help you do even more.

### How It Works

1. **Log a habit** — Tell the app what eco-friendly action you took today (walked, cycled, took public transport, avoided AC, etc.)
2. **See your CO₂ savings** — The backend calculates exactly how many kg of CO₂ you saved with each action
3. **Earn eco-points** — Every action earns points proportional to its environmental impact
4. **Get AI insights** — The AI engine analyzes your patterns and gives personalized recommendations
5. **Compete on leaderboards** — Compare your impact with others at campus, city, state, and country levels
6. **Track long-term progress** — Weekly/monthly dashboards show your environmental journey over time

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Login /  │ │Dashboard │ │  Rewards │ │  Leaderboard /    │  │
│  │ Sign Up  │ │ & Charts │ │  & Shop  │ │  Settings / Map   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬──────────┘  │
│       │             │            │                 │             │
│       └─────────────┴────────────┴─────────────────┘             │
│                         api.js (HTTP Client)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │  REST API (JSON)
                            │  JWT Bearer Auth
┌───────────────────────────┴─────────────────────────────────────┐
│                     BACKEND (FastAPI)                            │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Auth Routes │  │ Activity     │  │ Dashboard Routes       │  │
│  │ /auth/*     │  │ /activity/*  │  │ /dashboard/*           │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────┬────────────┘  │
│         │                │                      │                │
│  ┌──────┴──────┐  ┌──────┴───────┐  ┌───────────┴────────────┐  │
│  │ AI Routes   │  │ Leaderboard  │  │ Platform Routes        │  │
│  │ /ai/*       │  │ /leaderboard │  │ /platform/*            │  │
│  └──────┬──────┘  └──────┬───────┘  └───────────┬────────────┘  │
│         │                │                      │                │
│  ┌──────┴────────────────┴──────────────────────┴────────────┐  │
│  │                    Services Layer                          │  │
│  │  carbon_calculator │ ai_recommendation │ impact_service    │  │
│  │  ai_service │ leaderboard_service │ platform_service       │  │
│  │  simulation_service                                        │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┴────────────────────────────────┐  │
│  │               SQLAlchemy ORM (Models)                      │  │
│  │            User  │  Activity  (+ migrations)               │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┴────────────────────────────────┐  │
│  │           PostgreSQL (prod) / SQLite (test/CI)             │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+**
- **PostgreSQL** (for production) or SQLite (auto-used in tests)
- **pip** (Python package manager)

### 1. Clone the repository

```bash
git clone https://github.com/amangupta982/Eco-Commit-AI.git
cd Eco-Commit-AI
```

### 2. Set up the backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secret key:
#   DATABASE_URL=postgresql://user:password@localhost/eco_commit
#   SECRET_KEY=your-secret-key-here
```

### 3. Run the backend

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 4. Open the frontend

Simply open `frontend/home.html` in your browser — the frontend is static HTML/CSS/JS that calls the backend API.

### 5. Run tests

```bash
cd backend
DATABASE_URL="sqlite:///./test.db" SECRET_KEY="test-secret" python -m pytest tests/ -v
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login (returns JWT token) | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

### Activity Logging

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/activity/add` | Log an eco-friendly activity | ✅ |

### Dashboard & Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/dashboard/summary` | Daily/monthly CO₂, eco-points, equivalents | ✅ |
| `GET` | `/dashboard/weekly` | Weekly carbon savings graph data | ✅ |
| `GET` | `/dashboard/monthly` | Monthly progress graph data | ✅ |
| `GET` | `/dashboard/distribution` | Activity type distribution (pie chart) | ✅ |
| `GET` | `/dashboard/simulate?users=N` | Simulate impact for N users | ❌ |

### AI Engine

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/ai/recommendations` | AI-powered personalized recommendations | ✅ |
| `GET` | `/ai/climate-score` | User's climate score and category | ✅ |

### Leaderboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/leaderboard/?level=X&value=Y` | Leaderboard by campus/city/state/country | ❌ |

### Platform Impact

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/platform/impact` | Platform-wide statistics | ❌ |
| `GET` | `/platform/impact-by-city` | CO₂ saved grouped by city | ❌ |
| `GET` | `/platform/global-impact` | Global environmental impact summary | ❌ |

### Carbon Savings Reference

| Activity | CO₂ Saved (kg) | Eco Points |
|----------|----------------|------------|
| Walk | 1.0 | 10 |
| Cycled | 1.8 | 18 |
| Public Transport | 2.5 | 25 |
| Carpool | 2.0 | 20 |
| Avoided AC | 3.0 | 30 |
| Planted Tree | 10.0 | 100 |
| Unknown/Other | 0.5 | 5 |

---

## 📸 Screenshots

> _Screenshots coming soon! Run the app locally to see the full UI._

| Page | Description |
|------|-------------|
| 🏠 Home | Landing page with project introduction and call to action |
| 📊 Dashboard | Real-time CO₂ savings, weekly/monthly charts, activity distribution |
| 🏆 Leaderboard | Campus, city, state, and country-level rankings |
| 🎁 Rewards | Eco-points marketplace with vouchers and donations |
| ⚙️ Settings | Profile management and theme customization |

---

## 🗺️ Roadmap

- [ ] **🔔 Push Notifications** — Daily reminders to log eco-habits with streak motivation
- [ ] **📱 Mobile App (React Native)** — Cross-platform mobile app with offline activity logging
- [ ] **🤖 GPT-Powered Insights** — Integrate OpenAI/Gemini for deeper, conversational sustainability coaching
- [ ] **🏘️ Community Challenges** — Create and join group eco-challenges with shared leaderboards
- [ ] **📊 Carbon Footprint Calculator** — Full lifestyle carbon footprint assessment (food, travel, energy) with reduction plans

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and add tests
4. **Run the test suite** to make sure nothing breaks:
   ```bash
   cd backend
   DATABASE_URL="sqlite:///./test.db" SECRET_KEY="test-secret" python -m pytest tests/ -v
   ```
5. **Commit** with a descriptive message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push** and open a **Pull Request**

### Code Style

- Backend: Python 3.10+, FastAPI, type hints encouraged
- Frontend: Vanilla HTML/CSS/JS
- Tests: pytest with `TestClient` for integration tests

### Reporting Issues

Found a bug? Open an [issue](https://github.com/amangupta982/Eco-Commit-AI/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Python version and OS

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💚 for a greener planet
</p>
