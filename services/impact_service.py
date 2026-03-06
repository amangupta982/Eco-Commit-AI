# backend/services/impact_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func
from models.activity_model import Activity
from datetime import datetime, timedelta


# =====================================================
# 1️⃣ DASHBOARD SUMMARY (Top Cards)
# =====================================================
def get_dashboard_summary(db: Session, user_id: int):

    today = datetime.utcnow().date()
    month_start = today.replace(day=1)

    # Daily CO2
    daily_co2 = db.query(func.sum(Activity.carbon_saved))\
        .filter(Activity.user_id == user_id)\
        .filter(func.date(Activity.created_at) == today)\
        .scalar() or 0

    # Monthly CO2
    monthly_co2 = db.query(func.sum(Activity.carbon_saved))\
        .filter(Activity.user_id == user_id)\
        .filter(Activity.created_at >= month_start)\
        .scalar() or 0

    # Total Eco Points
    eco_points = db.query(func.sum(Activity.eco_points_earned))\
        .filter(Activity.user_id == user_id)\
        .scalar() or 0

    # Environmental Equivalents
    trees_equivalent = monthly_co2 / 21  # Approx: 1 tree absorbs 21kg/year
    money_saved = monthly_co2 * 8       # Approx: ₹8 per kg saved

    return {
        "daily_co2": round(daily_co2, 2),
        "monthly_co2": round(monthly_co2, 2),
        "trees_equivalent": round(trees_equivalent, 2),
        "money_saved": round(money_saved, 2),
        "eco_points": eco_points
    }


# =====================================================
# 2️⃣ WEEKLY CARBON GRAPH
# =====================================================
def get_weekly_data(db: Session, user_id: int):

    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=6)

    rows = db.query(
        func.date(Activity.created_at),
        func.sum(Activity.carbon_saved)
    ).filter(
        Activity.user_id == user_id,
        Activity.created_at >= week_ago
    ).group_by(
        func.date(Activity.created_at)
    ).all()

    result = []

    for date, value in rows:
        result.append({
            "day": date.strftime("%a"),
            "value": round(value or 0, 2)
        })

    return result


# =====================================================
# 3️⃣ MONTHLY PROGRESS GRAPH
# =====================================================
def get_monthly_data(db: Session, user_id: int):

    rows = db.query(
        func.extract("month", Activity.created_at),
        func.sum(Activity.carbon_saved)
    ).filter(
        Activity.user_id == user_id
    ).group_by(
        func.extract("month", Activity.created_at)
    ).all()

    month_map = {
        1: "Jan", 2: "Feb", 3: "Mar",
        4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep",
        10: "Oct", 11: "Nov", 12: "Dec"
    }

    result = []

    for month_num, value in rows:
        result.append({
            "month": month_map[int(month_num)],
            "value": round(value or 0, 2)
        })

    return result


# =====================================================
# 4️⃣ ACTIVITY DISTRIBUTION (Pie Chart)
# =====================================================
def get_activity_distribution(db: Session, user_id: int):

    activities = db.query(
        Activity.activity_type,
        func.count(Activity.id)
    ).filter(
        Activity.user_id == user_id
    ).group_by(
        Activity.activity_type
    ).all()

    result = {
        "walk": 0,
        "bus": 0,
        "bike": 0,
        "car": 0,
        "no_ac": 0
    }

    for activity_type, count in activities:
        if activity_type in result:
            result[activity_type] = count

    return result