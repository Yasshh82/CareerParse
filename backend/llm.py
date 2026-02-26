import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "phi3:mini"

def extract_experience(text):

    prompt = f"""
Extract ONLY work experience.

Return STRICT JSON:

{{
  "Companies": [
    {{
      "Company Name": "",
      "Role": "",
      "Tenure": ""
    }}
  ]
}}

Resume:
{text}
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0
            }
        }
    )

    return response.json()["response"]