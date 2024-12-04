from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    # Relationship with QuizScore
    scores = relationship("QuizScore", back_populates="user")


class QuizScore(Base):
    __tablename__ = "quiz_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    quiz_name = Column(String, nullable=False)

    # Relationship to User (back_populates must match the one in User model)
    user = relationship("User", back_populates="scores")

# class QuizAnswer(Base):
#     __tablename__ = "quiz_answers"

#     id = Column(Integer, primary_key=True, index=True)
#     user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
#     question_id = Column(Integer, nullable=False)
#     selected_option = Column(Integer, nullable=False)
#     is_correct = Column(Boolean, nullable=False)

#     # Relationship back to User
#     user = relationship("User", back_populates="answers")
