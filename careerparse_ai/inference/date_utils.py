from datetime import datetime

def parse_date(date_str):

    if not date_str:
        return None
    
    if date_str.lower() == "present":
        return datetime.now()
    
    try:
        return datetime.strptime(date_str, "%m/%Y")
    except:
        return None
    
def calculate_duration(start, end):

    if not start or not end:
        return 0
    
    return (end.year - start.year) * 12 + (end.month - start.month)