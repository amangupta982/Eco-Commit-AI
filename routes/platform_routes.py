from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services.platform_service import get_platform_impact
from services.platform_service import get_city_impact
from services.platform_service import get_global_impact

router = APIRouter(prefix="/platform", tags=["Platform Impact"])


@router.get("/impact")
def platform_impact(db: Session = Depends(get_db)):
    return get_platform_impact(db)



@router.get("/impact-by-city")
def city_impact(db: Session = Depends(get_db)):
    return get_city_impact(db)

@router.get("/global-impact")
def global_impact(db: Session = Depends(get_db)):
    return get_global_impact(db)