from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from utils.helpers import get_current_user
from services.impact_service import (
    get_dashboard_summary,
    get_activity_distribution,
    get_weekly_data,
    get_monthly_data
)
from services.simulation_service import simulate_future

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_dashboard_summary(db, current_user.id)


@router.get("/distribution")
def activity_distribution(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_activity_distribution(db, current_user.id)


@router.get("/weekly")
def weekly_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_weekly_data(db, current_user.id)


@router.get("/simulate")
def future_simulation(users: int):
    return simulate_future(users)


@router.get("/monthly")
def monthly_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_monthly_data(db, current_user.id)