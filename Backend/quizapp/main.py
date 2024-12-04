from fastapi import FastAPI, HTTPException, Body, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, database
from .database import engine
from typing import Dict
import hashlib

app = FastAPI()

get_db = database.get_db

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Create the database tables
models.Base.metadata.create_all(engine)

# Pydantic models for request and response validation
class User(BaseModel):
    email: str
    name: str
    password: str

class Login(BaseModel):
    email: str
    password: str


class Score(BaseModel):
    quiz_name: str
    score: int


class SaveAnswer(BaseModel):
    user_email: str
    question_id: int
    selected_option: int
    is_correct: bool

# Function to hash passwords (you can use a stronger hashing algorithm in production)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Signup endpoint
@app.post("/signup")
async def signup(request: User, db: Session = Depends(get_db)):
    hashed_password = hash_password(request.password)
    new_user = models.User(name=request.name, email=request.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully","id": new_user.id, "email": new_user.email, "name": new_user.name}

# Login endpoint
@app.post("/login")
async def login(credentials: Login, db: Session = Depends(get_db)):
    # Query the database for the user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    # If the user is not found, raise an error
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # Verify the password
    hashed_password = hash_password(credentials.password)
    if user.password != hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    # Return a success message with user details
    return {"message": "Login successful","id": user.id, "email": user.email, "name": user.name}




@app.post("/submit-score")
async def submit_score(score_data: Score, user_email: str, db: Session = Depends(get_db)):
    # Get the user from the database
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Save the score in the database
    new_score = models.QuizScore(user_id=user.id, score=score_data.score, quiz_name=score_data.quiz_name)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return {"message": "Score submitted successfully"}


import logging

@app.get("/user-scores")
async def get_user_with_scores(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    scores = db.query(models.QuizScore).filter(models.QuizScore.user_id == user.id).all()

    logging.info(f"User {user.id} has scores: {scores}")
    return {
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "scores": [{"quiz_name": score.quiz_name, "score": score.score} for score in scores],
    }
