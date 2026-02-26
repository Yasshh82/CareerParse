from dateutil import parser
from datetime import datetime

def parse_tenure(tenure_text):
    try:
        parts = tenure_text.split("-")
        start = parser.parse(parts[0].strip())
        end = parser.parse(parts[1].strip()) if len(parts) > 1 else datetime.now()

        months = (end.year - start.year) * 12 + (end.month - start.month)

        return start.strftime("%Y-%m"), end.strftime("%Y-%m"), months
    except:
        return None, None, 0