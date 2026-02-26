import fitz
from docx import Document

def extract_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_docx(file):
    document = Document(file)
    return "\n".join([p.text for p in document.paragraphs])