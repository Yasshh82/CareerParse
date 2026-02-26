from fastapi import FastAPI, UploadFile, File
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Resume, Experience
from parser import process_resume
from file_utils import extract_pdf, extract_docx

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/upload")
async def upload(file: UploadFile = File(...)):

    if file.filename.endswith(".pdf"):
        text = extract_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text = extract_docx(file.file)
    else:
        return {"error": "Unsupported file"}

    companies, total_months = process_resume(text)

    db = SessionLocal()
    resume = Resume(raw_text=text, total_experience_months=total_months)
    db.add(resume)
    db.commit()
    db.refresh(resume)

    for comp in companies:
        exp = Experience(
            resume_id=resume.id,
            company_name=comp["company_name"],
            role=comp["role"],
            tenure_raw=comp["tenure_raw"],
            start_date=comp["start_date"],
            end_date=comp["end_date"],
            duration_months=comp["duration_months"],
            is_current_role=comp["is_current_role"]
        )
        db.add(exp)

    db.commit()
    db.close()

    return {
        "resume_id": resume.id,
        "Companies": companies,
        "total_experience_months": total_months
    }