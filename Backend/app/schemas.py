from pydantic import BaseModel
from datetime import date
from typing import Optional

class OperatorBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None


class OperatorCreate(OperatorBase):
    pass


class OperatorResponse(OperatorBase):
    id: int

    class Config:
        orm_mode = True


class TripBase(BaseModel):
    name: str
    start_date: Optional[date]
    end_date: Optional[date]
    start_location: Optional[str]
    end_location: Optional[str]
    price: Optional[float]


class TripResponse(TripBase):
    id: int
    operator_id: int

    class Config:
        orm_mode = True

class OperatorCreate(BaseModel):
    name: str
    email: str
    phone: str

class TripCreate(BaseModel):
    name: str
    start_date: date
    end_date: date
    start_location: str
    end_location: str
    price: float
    operator_id: int
class ItineraryDayCreate(BaseModel):
    day_date: date
    location: str
    transport: Optional[str] = None
    pilgrimage_site: Optional[str] = None
    lodging: Optional[str] = None



class ItineraryDayResponse(ItineraryDayCreate):
    id: int
    trip_id: int

    class Config:
        orm_mode = True


