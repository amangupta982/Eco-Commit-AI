from pydantic import BaseModel
from typing import List

class SummaryResponse(BaseModel):
    daily_co2: float
    monthly_co2: float
    trees_equivalent: float
    money_saved: float
    eco_points: int

class WeeklyData(BaseModel):
    day: str
    value: float

class MonthlyData(BaseModel):
    month: str
    value: float

class DistributionResponse(BaseModel):
    walk: int
    bus: int
    bike: int
    car: int
    no_ac: int

class SimulationResponse(BaseModel):
    co2_reduced: float
    aqi_improvement: float
    fuel_savings: float