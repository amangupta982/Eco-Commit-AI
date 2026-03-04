def calculate_carbon(activity_type: str):

    activity_type = activity_type.lower()

    carbon_map = {
        "public transport": 2.5,
        "walk": 1.0,
        "cycled": 1.8,
        "avoided ac": 3.0,
        "planted tree": 10.0,
        "carpool": 2.0
    }

    # Default minimal value if activity not recognized
    carbon_saved = carbon_map.get(activity_type, 0.5)

    eco_points = int(carbon_saved * 10)

    return carbon_saved, eco_points