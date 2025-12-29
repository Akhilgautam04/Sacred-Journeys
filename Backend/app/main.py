from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import models
from .schemas import OperatorCreate, TripCreate, ItineraryDayCreate

# ---------------- CREATE TABLES ----------------
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print("DB init error:", e)

# ---------------- APP ----------------
app = FastAPI(
    title="Sacred Journeys API",
    description="Backend API for Sacred Journeys (Phase 1)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://sacred-journeys.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- BASIC ----------------
@app.get("/")
def root():
    return {"status": "Sacred Journeys backend running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ---------------- OPERATORS ----------------
@app.get("/operators")
def get_operators(db: Session = Depends(get_db)):
    return db.query(models.Operator).all()

@app.post("/operators")
def create_operator(operator: OperatorCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Operator).filter(
        models.Operator.email == operator.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Operator already exists")

    new_operator = models.Operator(
        name=operator.name,
        email=operator.email,
        phone=operator.phone
    )

    db.add(new_operator)
    db.commit()
    db.refresh(new_operator)
    return new_operator

# ---------------- TRIPS ----------------
@app.get("/trips")
def get_trips(db: Session = Depends(get_db)):
    return db.query(models.Trip).all()

@app.post("/trips")
def create_trip(trip: TripCreate, db: Session = Depends(get_db)):
    operator = db.query(models.Operator).filter(
        models.Operator.id == trip.operator_id
    ).first()

    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")

    new_trip = models.Trip(
        name=trip.name,
        start_date=trip.start_date,
        end_date=trip.end_date,
        start_location=trip.start_location,
        end_location=trip.end_location,
        price=trip.price,
        operator_id=trip.operator_id
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

# 🔹 UPDATE TRIP
@app.put("/trips/{trip_id}")
def update_trip(trip_id: int, trip: TripCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Trip not found")

    existing.name = trip.name
    existing.start_date = trip.start_date
    existing.end_date = trip.end_date
    existing.start_location = trip.start_location
    existing.end_location = trip.end_location
    existing.price = trip.price

    db.commit()
    db.refresh(existing)
    return existing

# 🔹 DELETE TRIP (SAFE)
@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # Delete itinerary days first
    db.query(models.ItineraryDay).filter(
        models.ItineraryDay.trip_id == trip_id
    ).delete()

    db.delete(trip)
    db.commit()

    return {"message": "Trip deleted successfully"}

# ---------------- ITINERARY ----------------
@app.get("/trips/{trip_id}/itinerary")
def get_itinerary(trip_id: int, db: Session = Depends(get_db)):
    return db.query(models.ItineraryDay).filter(
        models.ItineraryDay.trip_id == trip_id
    ).all()

@app.post("/trips/{trip_id}/itinerary")
def add_itinerary_day(trip_id: int, item: ItineraryDayCreate, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    itinerary_day = models.ItineraryDay(
        trip_id=trip_id,
        day_date=item.day_date,
        location=item.location,
        transport=item.transport,
        pilgrimage_site=item.pilgrimage_site,
        lodging=item.lodging
    )

    db.add(itinerary_day)
    db.commit()
    db.refresh(itinerary_day)
    return itinerary_day

# 🔹 UPDATE ITINERARY DAY
@app.put("/itinerary/{day_id}")
def update_itinerary_day(day_id: int, item: ItineraryDayCreate, db: Session = Depends(get_db)):
    day = db.query(models.ItineraryDay).filter(
        models.ItineraryDay.id == day_id
    ).first()

    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")

    day.day_date = item.day_date
    day.location = item.location
    day.transport = item.transport
    day.pilgrimage_site = item.pilgrimage_site
    day.lodging = item.lodging

    db.commit()
    db.refresh(day)
    return day

# 🔹 DELETE ITINERARY DAY
@app.delete("/itinerary/{day_id}")
def delete_itinerary_day(day_id: int, db: Session = Depends(get_db)):
    day = db.query(models.ItineraryDay).filter(
        models.ItineraryDay.id == day_id
    ).first()

    if not day:
        raise HTTPException(status_code=404, detail="Itinerary day not found")

    db.delete(day)
    db.commit()
    return {"message": "Itinerary day deleted successfully"}
