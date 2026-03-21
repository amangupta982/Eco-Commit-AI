from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.activity_model import Activity
from models.user_model import User
from schemas.activity_schema import ActivityCreate, ActivityResponse
from services.carbon_calculator import calculate_carbon
from utils.helpers import get_current_user

router = APIRouter(prefix="/activity", tags=["Activity"])


@router.post("/add", response_model=ActivityResponse)
def add_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    carbon_saved, eco_points = calculate_carbon(activity.activity_type)

    new_activity = Activity(
        user_id=current_user.id,
        activity_type=activity.activity_type,
        description=activity.description,
        carbon_saved=carbon_saved,
        eco_points_earned=eco_points
    )

    current_user.total_carbon_saved += carbon_saved
    current_user.eco_points += eco_points

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity