from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ActivityCreate(BaseModel):
    activity_type: str
    description: Optional[str] = None


class ActivityResponse(BaseModel):
    id: int
    activity_type: str
    description: Optional[str]
    carbon_saved: float
    eco_points_earned: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }