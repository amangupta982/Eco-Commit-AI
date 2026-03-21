from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    campus = Column(String, default="Unknown")
    city = Column(String)
    state = Column(String, default="Unknown")
    country = Column(String, default="India")

    eco_points = Column(Integer, default=0)
    total_carbon_saved = Column(Float, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())