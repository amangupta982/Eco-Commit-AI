from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    activity_type = Column(String)
    description = Column(String)

    distance_km = Column(Float, default=0)
    carbon_saved = Column(Float, default=0)
    eco_points_earned = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())