from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from utils.helpers import get_current_user
from services.ai_recommendation import generate_recommendations
from services.ai_service import calculate_climate_score

router = APIRouter(prefix="/ai", tags=["AI Engine"])


# -------------------------
# AI RECOMMENDATIONS
# -------------------------
@router.get("/recommendations")
def get_ai_recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return generate_recommendations(db, current_user.id)


# -------------------------
# CLIMATE SCORE
# -------------------------
@router.get("/climate-score")
def climate_score(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return calculate_climate_score(db, current_user.id)