from sqlalchemy.orm import Session
from sqlalchemy import func
from models.activity_model import Activity


def calculate_climate_score(db: Session, user_id: int):

    activities = db.query(
        func.count(Activity.id),
        func.sum(Activity.carbon_saved)
    ).filter(
        Activity.user_id == user_id
    ).first()

    total_activities = activities[0] or 0
    total_carbon = activities[1] or 0

    score = min(int(total_carbon * 5 + total_activities * 2), 100)

    if score > 80:
        category = "Eco Champion"
    elif score > 60:
        category = "Green Leader"
    elif score > 40:
        category = "Eco Contributor"
    else:
        category = "Starter"

    suggestion = "Use public transport more often to improve your score."

    return {
        "score": score,
        "category": category,
        "total_carbon_saved": round(total_carbon, 2),
        "activities_logged": total_activities,
        "suggestion": suggestion
    }