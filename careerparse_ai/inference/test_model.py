import spacy
from structure_entities import structure_entities
from pathlib import Path

# Build a path relative to this script's directory (careerparse_ai/inference)
root = Path(__file__).resolve().parent.parent
model_path = root / "models" / "resume_ner_model" / "model-last"

nlp = spacy.load(str(model_path))

text = """
Jyoti Singh
QA Engineer

Worked at Venturit as QA Engineer from 12/2021 to Present.
Previously worked at Globalstep as Test Engineer from 11/2020 to 12/2021.

Education:
Bachelor of Engineering in Computer Science
Rungta Engineering College
"""

doc = nlp(text)

result = structure_entities(doc)

print("\nStructured Output:\n")
print(result)