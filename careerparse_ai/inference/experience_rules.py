import re

def extract_experience_rules(text):
    text = text.replace("\n", " ")

    companies = []

    pattern  = re.findall(
        r'(?:Worked at|Previously worked at)\s+'
        r'([A-Z][A-Za-z0-9 &]+?)\s+as\s+'
        r'([A-Za-z ]+?)\s+from\s+'
        r'(\d{2}/\d{4})\s+(?:to|-)\s+'
        r'(Present|\d{2}/\d{4})',
        text
    )

    for company, role, start, end in pattern:

        companies.append({
            "Company Name": company.strip(),
            "Role": role.strip(),
            "Start Date": start,
            "End Date": end,
            "Current_Flag": 1 if end.lower() == "present" else 0
        })
    
    return companies