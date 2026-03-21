def simulate_future(users: int):

    co2_reduced = users * 0.024  # tons per user
    aqi_improvement = users * 0.003
    fuel_savings = users * 12

    return {
        "co2_reduced": round(co2_reduced, 2),
        "aqi_improvement": round(aqi_improvement, 2),
        "fuel_savings": round(fuel_savings, 2)
    }