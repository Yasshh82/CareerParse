import re
import json
from llm import extract_experience
from date_utils import parse_tenure

def clean_json(raw):
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return json.loads(match.group())
    return {"Companies": []}

def process_resume(text):

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