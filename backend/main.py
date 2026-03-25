from fastapi import FastAPI, HTTPException, Security, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import Resume, Experience, Recruiter
from parser import process_resume
from file_utils import extract_pdf, extract_docx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import hashlib
import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from services.resume_parser import parse_resume

load_dotenv()

# Fetch variables with fallbacks for safety
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in environment variables")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
security = HTTPBearer()
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

def verify_password(plain_password, hashed_password):
    plain_password = plain_password[:72] #bcrypt limit
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    password = password[:72] #bcrypt limit
    return pwd_context.hash(password)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        recruiter_id: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str = Field(..., min_length=6, max_length=72)

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    recruiter = db.query(Recruiter).filter(
        Recruiter.email == data.email
    ).first()

    if not recruiter or not verify_password(data.password, recruiter.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    token_data = {
        "sub": recruiter.id,
        "exp": expire
    }

    access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "name": recruiter.name,
        "email": recruiter.email
    }

@app.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):

    existing_user = db.query(Recruiter).filter(
        Recruiter.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(data.password)

    recruiter = Recruiter(
        name=data.name,
        email=data.email,
        password=hashed_password
    )

    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)

    return {
        "message": "User created successfully",
        "token": recruiter.id,
        "name": recruiter.name,
        "email": recruiter.email
    }

# -------------------------
# Upload Resume Endpoint
# -------------------------
@app.post("/upload")
async def upload(
    file: UploadFile = File(...),
    current_user: Recruiter = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if file.filename.endswith(".pdf"):
        text = extract_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text = extract_docx(file.file)
    else:
        return {"error": "Unsupported file"}

    parsed_output = parse_resume(text)

    companies = parsed_output.get("Companies", [])

    total_months = 0

    # Save Resume
    resume = Resume(
        recruiter_id=current_user.id,
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
            company_name=comp.get("Company Name"),
            role=comp.get("Role"),
            tenure_raw=None,
            start_date=comp.get("Start Date"),
            end_date=comp.get("End Date"),
            duration_months=None,
            is_current_role=bool(comp.get("Current_Flag"))
        )
        db.add(exp)

    db.commit()

    return {
        "resume_id": resume.id,
        "parsed_data": parsed_output
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
    current_user: Recruiter = Depends(get_current_user),
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