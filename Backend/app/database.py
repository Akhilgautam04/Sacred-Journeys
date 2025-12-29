import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

# Fallback DATABASE_URL (CRITICAL FIX)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@db:5432/sacredjourneys"
)

engine = None

#  Retry logic for DB startup (Docker-safe)
for i in range(10):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()
        print(" Database connected")
        break
    except OperationalError:
        print(f" Database not ready (attempt {i+1}/10), retrying...")
        time.sleep(3)
else:
    raise Exception(" Could not connect to database")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
