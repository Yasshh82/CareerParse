import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

def generate_id():
    return str(uuid.uuid4())

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, default=generate_id)
    raw_text = Column(String)
    total_experience_months = Column(Integer, default=0)

    experiences = relationship("Experience", back_populates="resume")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String, primary_key=True, default=generate_id)
    resume_id = Column(String, ForeignKey("resumes.id"))

    company_name = Column(String)
    role = Column(String)
    tenure_raw = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    duration_months = Column(Integer)
    is_current_role = Column(Boolean)

    resume = relationship("Resume", back_populates="experiences")