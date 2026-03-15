def structure_entities(doc):
    companies = []
    education = []

    current_company = {}

    for ent in doc.ents:

        if ent.label_ == "COMPANY":

            if current_company:
                companies.append(current_company)

            current_company = {
                "Company_Name": ent.text,
                "Role": None,
                "Start Date": None,
                "End Date": None,
                "Current_Flag": 0
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

    return {
        "Companies": companies,
        "Education": education
    }