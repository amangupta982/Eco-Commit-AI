from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.auth_routes import router as auth_router
from routes.activity_routes import router as activity_router
from models.user_model import User
from models.activity_model import Activity
from utils.helpers import get_current_user
from routes.dashboard_routes import router as dashboard_router
from routes.ai_routes import router as ai_router
from routes.leaderboard_routes import router as leaderboard_router
from routes.platform_routes import router as platform_router


app = FastAPI(
    title="EcoCommit AI API",
    version="1.0.0"
)

# -------------------------
# CORS (IMPORTANT for frontend)
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon demo only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Include Routes
# -------------------------
app.include_router(auth_router)
app.include_router(activity_router)
app.include_router(dashboard_router)
app.include_router(ai_router)
app.include_router(leaderboard_router)
app.include_router(platform_router)

# -------------------------
# Create Tables Automatically
# -------------------------
Base.metadata.create_all(bind=engine)


# -------------------------
# Root Route
# -------------------------
@app.get("/")
def root():
    return {"message": "EcoCommit AI Backend Running 🚀"}


# -------------------------
# Protected Test Route
# -------------------------
@app.get("/protected")
def protected_route(current_user=Depends(get_current_user)):
    return {
        "message": "You are authenticated 🔐",
        "user": current_user.email
    }