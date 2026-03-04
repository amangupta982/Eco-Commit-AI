from pydantic import BaseModel, EmailStr
from typing import Optional


# -------------------------
# USER CREATE (REGISTER)
# -------------------------
class UserCreate(BaseModel):

    name: str
    email: EmailStr
    password: str
    campus: str
    city: str
    state: str
    country: str


# -------------------------
# USER RESPONSE
# -------------------------
class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr

    campus: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]

    total_carbon_saved: float
    eco_points: int

    model_config = {
        "from_attributes": True
    }


# -------------------------
# USER LOGIN
# -------------------------
class UserLogin(BaseModel):

    email: EmailStr
    password: str