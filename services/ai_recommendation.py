from sqlalchemy.orm import Session
from sqlalchemy import func
from models.activity_model import Activity

CAR_CO2_PER_KM = 0.192
BIKE_CO2_PER_KM = 0
BUS_CO2_PER_KM = 0.105


def generate_recommendations(db: Session, user_id: int):

    activities = db.query(
        Activity.activity_type,
        func.count(Activity.id),
        func.sum(Activity.carbon_saved)
    ).filter(
        Activity.user_id == user_id
    ).group_by(
        Activity.activity_type
    ).all()

    activity_map = {a: c for a, c, _ in activities}
    carbon_map = {a: carbon for a, _, carbon in activities}

    recommendations = []

    total_carbon = sum(carbon_map.values())

    # -------------------------------
    # Detect car dependency
    # -------------------------------
    car_usage = activity_map.get("car", 0)

    if car_usage > 3:
        potential_savings = car_usage * 2 * CAR_CO2_PER_KM
        recommendations.append(
            f"You rely on cars frequently. Replacing just two weekly trips with cycling could reduce ~{potential_savings:.2f} kg CO₂ monthly."
        )

    # -------------------------------
    # Encourage cycling
    # -------------------------------
    if activity_map.get("walk", 0) > 4:
        recommendations.append(
            "You already walk often. Using a bicycle for medium distances could increase your carbon savings significantly."
        )

    # -------------------------------
    # Promote AC reduction
    # -------------------------------
    if activity_map.get("no_ac", 0) < 2:
        recommendations.append(
            "Reducing AC usage by just 2 hours per day could save ~6–8 kg CO₂ per month."
        )

    # -------------------------------
    # Reward eco behavior
    # -------------------------------
    if total_carbon > 20:
        recommendations.append(
            "Great progress! Your eco actions are already making measurable environmental impact."
        )

    # fallback recommendation
    if not recommendations:
        recommendations.append(
            "Start replacing short vehicle trips with walking or cycling to reduce your carbon footprint."
        )

    return {
        "total_carbon_saved": round(total_carbon, 2),
        "recommendations": recommendations
    }