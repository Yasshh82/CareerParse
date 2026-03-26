from experience_rules import extract_experience_rules
from date_utils import parse_date, calculate_duration

def structure_entities(doc):
    companies = []
    education = []

    current_company = {}

    for ent in doc.ents:

        if ent.label_ == "COMPANY":

            if current_company:
                companies.append(current_company)

            current_company = {
                "Company Name": ent.text,
                "Role": None,
                "Start Date": None,
                "End Date": None,
                "Current_Flag": 0,
                "duration_months": 0
            }

        elif ent.label_ == "ROLE" and current_company:
            current_company["Role"] = ent.text
        
        elif ent.label_ == "START_DATE" and current_company:
            current_company["Start Date"] = ent.text

        elif ent.label_ == "END_DATE" and current_company:
            current_company["End Date"] = ent.text

            if ent.text.lower() == "present":
                current_company["Current_Flag"] = 1

        elif ent.label_ == "COLLEGE":
            education.append({
                "College_Name": ent.text,
                "Degree": None
            })

        elif ent.label_ == "DEGREE" and education:
            education[-1]["Degree"] = ent.text

    if current_company:
        companies.append(current_company)

    ner_companies = companies.copy()
    
    rule_companies = extract_experience_rules(doc.text)

    companies = []

    if rule_companies:
        companies.extend(rule_companies)

    if ner_companies:
        companies.extend(ner_companies)

    unique = {}

    for comp in companies:
        name = comp.get("Company Name")

        if not name:
            continue

        if name not in unique:
            unique[name] = comp

        else:
            if comp.get("Role"):
                unique[name] = comp

    companies = list(unique.values())

    for comp in companies:
        start = parse_date(comp.get("Start Date"))
        end = parse_date(comp.get("End Date"))

        comp["duration_months"] = calculate_duration(start, end)

    total_experience = sum(
        comp.get("duration_months", 0) for comp in companies
    )

    if total_experience < 12:
        level = "Fresher"
    elif total_experience < 36:
        level = "Junior"
    elif total_experience < 72:
        level = "Mid-level"
    else:
        level = "Senior"

    current_company_name = None

    for comp in companies:
        if comp.get("Current_Flag") == 1:
            current_company_name = comp.get("Company Name")
            break

    summary = []

    for comp in companies:
        role = comp.get("Role") or "Unknown Role"
        company = comp.get("Company Name") or "Unknown Company"
        duration = comp.get("duration_months", 0)

        summary.append(f"{role} at {company} ({duration} months)")

    return {
        "Companies": companies,
        "Education": education,
        "total_experience_months": total_experience,
        "experience_level": level,
        "current_company": current_company_name,
        "experience_summary": summary
    }