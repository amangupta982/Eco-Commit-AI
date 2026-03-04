from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.leaderboard_service import get_leaderboard

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("/")
def leaderboard(level: str, value: str, db: Session = Depends(get_db)):

    return get_leaderboard(db, level, value)