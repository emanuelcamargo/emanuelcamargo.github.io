from pypdf import PdfReader

r = PdfReader("Emanuel Camargo - Resume (1).pdf")
for page in r.pages:
    print(page.extract_text())
