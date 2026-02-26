import re
import json
from llm import extract_experience
from date_utils import parse_tenure

def clean_json(raw):
    try:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except:
        pass

    return {"Companies": []}

def isolate_experience_section(text):
    keywords = [
        "experience",
        "work experience",
        "professional experience",
        "employment history"
    ]

    lines = text.split("\n")
    capture = False
    section = []

    for line in lines:
        if any(k in line.lower() for k in keywords):
            capture = True
            continue

        if capture:
            # Stop when next major section begins
            if line.strip().lower() in [
                "education",
                "skills",
                "projects",
                "certifications"
            ]:
                break
            section.append(line)

    return "\n".join(section) if section else text

def process_resume(text):

    text = isolate_experience_section(text)
    raw_output = extract_experience(text)
    data = clean_json(raw_output)

    companies = []
    total_months = 0

    for comp in data.get("Companies", []):
        start, end, months = parse_tenure(comp.get("Tenure", ""))

        total_months += months

        companies.append({
            "company_name": comp.get("Company Name", ""),
            "role": comp.get("Role", ""),
            "tenure_raw": comp.get("Tenure", ""),
            "start_date": start,
            "end_date": end,
            "duration_months": months,
            "is_current_role": False
        })

    return companies, total_months