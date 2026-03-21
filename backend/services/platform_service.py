from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user_model import User
from models.activity_model import Activity


def get_platform_impact(db: Session):

    total_users = db.query(func.count(User.id)).scalar()

    total_activities = db.query(func.count(Activity.id)).scalar()

    total_co2_saved = db.query(func.sum(Activity.carbon_saved)).scalar() or 0

    total_points = db.query(func.sum(User.eco_points)).scalar() or 0

    # 1 tree absorbs ~20kg CO2 yearly
    trees_equivalent = total_co2_saved / 20

    return {
        "total_users": total_users,
        "total_activities": total_activities,
        "total_co2_saved": round(total_co2_saved, 2),
        "trees_equivalent": round(trees_equivalent, 2),
        "total_eco_points": total_points
    }

def get_city_impact(db: Session):

    rows = db.query(
        User.city,
        func.sum(Activity.carbon_saved)
    ).join(
        Activity, Activity.user_id == User.id
    ).group_by(
        User.city
    ).all()

    result = []

    for city, carbon in rows:
        result.append({
            "city": city,
            "co2_saved": round(carbon or 0, 2)
        })

    return result

def get_global_impact(db: Session):

    total_users = db.query(func.count(User.id)).scalar()

    total_activities = db.query(func.count(Activity.id)).scalar()

    total_co2 = db.query(func.sum(Activity.carbon_saved)).scalar() or 0

    # Tree equivalence (1 tree absorbs ~21kg CO2 per year)
    trees_equivalent = total_co2 / 21

    # Approx fuel savings (₹100 per kg CO2 avoided roughly)
    fuel_saved = total_co2 * 100

    return {
        "total_users": total_users,
        "total_activities": total_activities,
        "total_co2_saved": round(total_co2, 2),
        "trees_equivalent": round(trees_equivalent, 1),
        "fuel_money_saved": round(fuel_saved, 2)
    }