# CareerParse 🚀

### Turn messy resumes into structured recruiter-ready insights in seconds.

CareerParse is an intelligent resume parsing system that
automatically extracts **work experience, company names, roles,
education, and dates** from resumes and converts them into **structured
JSON data** for recruiter dashboards and HR systems.

Instead of relying on large generative models, this project uses a
**Transformer-based Named Entity Recognition (NER) pipeline with spaCy**
to achieve fast, accurate, and locally deployable resume parsing.

The system is designed to power the **CareerParse recruiter dashboard**,
enabling automated resume analysis at scale.

------------------------------------------------------------------------

# 📑 Table of Contents

-   Overview
-   Project Architecture
-   System Flow
-   Tech Stack
-   Installation
-   Dataset Preparation
-   Training the NER Model
-   Running the Resume Parser
-   Example Output
-   Performance
-   Future Scope

------------------------------------------------------------------------

# 🧠 Overview

Recruiters spend significant time manually extracting information from
resumes such as:

-   Company names
-   Roles
-   Experience duration
-   Education details

CareerParse AI automates this process using a **machine learning
pipeline trained on labeled resume data**.

The system extracts key entities and structures them into a
recruiter-friendly format.

------------------------------------------------------------------------

# 🏗 Project Architecture

    Resume 
      ↓
    NER Model (spaCy Transformer) 
      ↓ 
    Entity Extraction 
      ↓
    Post-Processing Rules 
      ↓ 
    Structured JSON Output 
      ↓ 
    Recruiter Dashboard

Unlike LLM-based pipelines, this architecture:

-   Runs locally
-   Is fast
-   Is cost efficient
-   Works well with smaller datasets

------------------------------------------------------------------------

# 🔄 System Flow

    User uploads resume 
            ↓ 
    Resume text extraction 
            ↓ 
    NER model identifies entities 
            ↓ 
    Entities grouped into experience blocks 
            ↓ 
    Post-processing structures JSON 
            ↓ 
    Output returned to recruiter dashboard

------------------------------------------------------------------------

# 🧰 Tech Stack

Machine Learning - spaCy - spaCy Transformers - PyTorch - Scikit-learn

Data Processing - Pandas - TQDM

Backend (Integration Phase) - FastAPI - Python

Frontend - React - TailwindCSS

------------------------------------------------------------------------

# ⚙️ Installation

Clone the repository:

    git clone `<repo_url>`{=html} cd careerparse_ai

Create and activate virtual environment:

    python -m venv parser_venv parser_venv`\Scripts`{=tex}`\activate`{=tex}

Install dependencies:

    pip install -r requirements.txt

Download **spaCy transformer** model:

    python -m spacy download en_core_web_trf

------------------------------------------------------------------------

# 📊 Dataset Preparation

Dataset columns:

ResumeText --- Raw resume text\
GPT_Output --- Structured JSON labels\
Education --- Education details\
CleanedText --- Preprocessed resume text

Example

ResumeText: Worked at Venturit as QA Engineer from 12/2021 to Present

    GPT_Output: { "Companies":[ 
                    { "Company Name":"Venturit", 
                      "Role":"QA Engineer", 
                      "Start Date":"12/2021", 
                      "End Date":"Present" }
                ] }

------------------------------------------------------------------------

# 🔄 Convert Dataset to spaCy Format

    python scripts/convert_dataset.py

This generates:
    
    train.spacy
    dev.spacy

------------------------------------------------------------------------

# 🤖 Train the NER Model

    python -m spacy train configs/config.cfg --output models/resume_ner_model

Training metrics:

    ENTS_P --- Precision\
    ENTS_R --- Recall\
    ENTS_F --- F1 Score

------------------------------------------------------------------------

# 🔎 Run the Resume Parser
```python
python inference/test_model.py
```
Example entities:

Venturit → COMPANY\
QA Engineer → ROLE\
12/2021 → START_DATE\
Present → END_DATE\
Rungta Engineering College → COLLEGE\
Bachelor of Engineering → DEGREE

------------------------------------------------------------------------

# 📦 Example Output

    { "Companies":[ 
        { "Company Name":"Venturit", 
          "Role":"QA Engineer",
          "Start Date":"12/2021", 
          "End Date":"Present", 
          "Current_Flag":1 }
      ],
      "Education":[ 
        { "College Name":"Rungta Engineering College",
          "Degree":"Bachelor of Engineering" }
      ] 
    }

------------------------------------------------------------------------

# ⚡ Performance

Precision \~0.61\
Recall \~0.50\
F1 Score \~0.55

------------------------------------------------------------------------

# 🚀 Future Scope

Model Improvements - Better span alignment - Larger dataset - Skill
extraction - Certification extraction - Project extraction

Pipeline Improvements - Hybrid NER + LLM correction - Regex date
normalization - Experience duration calculation - Company normalization

System Improvements - Resume ranking using job descriptions - Candidate
skill scoring - Semantic search using embeddings - ATS integration

Scaling - Docker deployment - Cloud inference API - Vector database
search

------------------------------------------------------------------------

# 💡 Key Advantages

-   Fast inference (\<50ms per resume)
-   Runs locally
-   Low operational cost
-   Easy retraining
-   Production-ready architecture

------------------------------------------------------------------------

# 👨‍💻 Author

Yash Gupta  
[Email](yash8740gupta@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/yash-gupta82/)
