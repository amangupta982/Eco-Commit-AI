from sqlalchemy.orm import Session
from models.user_model import User


def get_leaderboard(db: Session, level: str, value: str):

    query = db.query(User)

    if level == "campus":
        query = query.filter(User.campus == value)

    elif level == "city":
        query = query.filter(User.city == value)

    elif level == "state":
        query = query.filter(User.state == value)

    elif level == "country":
        query = query.filter(User.country == value)

    users = query.order_by(User.eco_points.desc()).limit(10).all()

    leaderboard = []

    rank = 1

    for user in users:
        leaderboard.append({
            "rank": rank,
            "name": user.name,
            "eco_points": user.eco_points,
            "carbon_saved": user.total_carbon_saved,
            "city": user.city
        })
        rank += 1

    return leaderboard