import pandas as pd
import ast
import spacy
from spacy.tokens import DocBin
from sklearn.model_selection import train_test_split
from tqdm import tqdm

nlp = spacy.load("en_core_web_trf")

DATA_PATH = "../data/raw/prepared_ent_9999_500.csv"

TRAIN_OUTPUT = "../data/spacy_format/train.spacy"
DEV_OUTPUT = "../data/spacy_format/dev.spacy"

def overlaps(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)

df = pd.read_csv(DATA_PATH)

training_data = []

for _, row in tqdm(df.iterrows(), total=len(df)):

    text = str(row["ResumeText"]).replace("{new_line}", "\n")

    try:
        parsed = ast.literal_eval(row["GPT_Output"])
    except:
        continue

    entities = []

    # Extracting Company Entities
    for comp in parsed.get("Companies", []):
        company = comp.get("Company Name")
        role = comp.get("Role")
        start_date = comp.get("Start Date")
        end_date = comp.get("End Date")

        if company:
            start = text.lower().find(company.lower())
            if start != -1:
                end = start + len(company)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "COMPANY"))

        if role:
            start = text.lower().find(role.lower())
            if(start != -1):
                end = start + len(role)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "ROLE"))

        if start_date:
            start = text.lower().find(start_date.lower())
            if start != -1:
                end = start + len(start_date)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "START_DATE"))

        if end_date:
            start = text.lower().find(end_date.lower())
            if start != -1:
                end = start + len(end_date)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "END_DATE"))

    # Extracting Education
    for edu in parsed.get("Education", []):
        college = edu.get("College Name")
        degree = edu.get("Degree")

        if college:
            start = text.lower().find(college.lower())
            if start != -1:
                end = start + len(college)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "COLLEGE"))

        if degree:
            start = text.lower().find(degree.lower())
            if start != -1:
                end = start + len(degree)
                if not any(overlaps(start, end, s, e) for s, e, _ in entities):
                    entities.append((start, end, "DEGREE"))

    if entities:
        training_data.append((text, {"entities": entities}))

print("Total usable samples", len(training_data))

# Split into train and dev
train_data, dev_data = train_test_split(training_data, test_size=0.1, random_state=42)

def create_docbin(data, path):

    db = DocBin()

    for text, annot in data:
        doc = nlp.make_doc(text)

        ents = []

        for start, end, label in annot["entities"]:
            span = doc.char_span(start, end, label=label)

            if span is not None:
                ents.append(span)
            
        doc.ents = ents
        db.add(doc)
    
    db.to_disk(path)

create_docbin(train_data, TRAIN_OUTPUT)
create_docbin(dev_data, DEV_OUTPUT)

print("Conversion Complete!")