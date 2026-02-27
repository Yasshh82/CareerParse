from fastapi import FastAPI, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Resume, Experience
from parser import process_resume
from file_utils import extract_pdf, extract_docx
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Database Dependency
# -------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------
# Upload Resume Endpoint
# -------------------------
@app.post("/upload")
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):

    if file.filename.endswith(".pdf"):
        text = extract_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text = extract_docx(file.file)
    else:
        return {"error": "Unsupported file"}

    companies, total_months = process_resume(text)

    # Save Resume
    resume = Resume(
        raw_text=text,
        total_experience_months=total_months
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Save Experiences
    for comp in companies:
        exp = Experience(
            resume_id=resume.id,
            company_name=comp["company_name"],
            role=comp["role"],
            tenure_raw=(
            ", ".join(comp["tenure_raw"])
            if isinstance(comp["tenure_raw"], list)
            else comp["tenure_raw"]
            ),
            start_date=comp["start_date"],
            end_date=comp["end_date"],
            duration_months=comp["duration_months"],
            is_current_role=comp["is_current_role"]
        )
        db.add(exp)

    db.commit()

    return {
        "resume_id": resume.id,
        "Companies": companies,
        "total_experience_months": total_months
    }


# -------------------------
# Get Resume by ID Endpoint
# -------------------------
@app.get("/resumes/{resume_id}")
def get_resume(resume_id: str, db: Session = Depends(get_db)):

    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        return {"error": "Resume not found"}

    experiences = db.query(Experience).filter(
        Experience.resume_id == resume_id
    ).all()

    return {
        "resume_id": resume.id,
        "total_experience_months": resume.total_experience_months,
        "Companies": [
            {
                "Company Name": e.company_name,
                "Role": e.role,
                "Tenure": e.tenure_raw,
                "Start Date": e.start_date,
                "End Date": e.end_date,
                "Duration Months": e.duration_months,
                "Is Current Role": e.is_current_role
            }
            for e in experiences
        ]
    }

@app.get("/resumes")
def get_all_resumes(
    min_experience: int = 0,
    company: str = None,
    sort: str = "desc",
    page: int = 1,
    page_size: int = 6,
    db: Session = Depends(get_db)
):

    query = db.query(Resume).filter(
        Resume.total_experience_months >= min_experience
    )

    if company:
        query = query.join(Experience).filter(
            Experience.company_name.ilike(f"%{company}%")
        )

    if sort == "asc":
        query = query.order_by(Resume.total_experience_months.asc())
    else:
        query = query.order_by(Resume.total_experience_months.desc())

    total = query.count()

    resumes = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "data": [
            {
                "resume_id": resume.id,
                "total_experience_months": resume.total_experience_months
            }
            for resume in resumes
        ]
    }

@app.delete("/resumes/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        return {"error": "Resume not found"}

    # Delete associated experiences first
    db.query(Experience).filter(
        Experience.resume_id == resume_id
    ).delete()

    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully"}