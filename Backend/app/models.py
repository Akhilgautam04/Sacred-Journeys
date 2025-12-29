from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)

    trips = relationship("Trip", back_populates="operator")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    start_date = Column(Date)
    end_date = Column(Date)

    start_location = Column(String)
    end_location = Column(String)

    price = Column(Float)

    operator_id = Column(Integer, ForeignKey("operators.id"))
    operator = relationship("Operator", back_populates="trips")
class ItineraryDay(Base):
    __tablename__ = "itinerary_days"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)

    day_date = Column(Date, nullable=False)
    location = Column(String, nullable=False)
    transport = Column(String, nullable=True)
    pilgrimage_site = Column(String, nullable=True)
    lodging = Column(Text, nullable=True)

    trip = relationship("Trip", backref="itinerary_days")
