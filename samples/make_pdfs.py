import os

def create_simple_pdf(text_content: str, output_path: str, title: str):
    """
    Generates a valid, readable minimal PDF 1.4 document containing the text
    without requiring third-party heavy C libraries.
    """
    lines = text_content.strip().split("\n")
    # Clean text to ASCII safe characters
    clean_lines = []
    for line in lines:
        line_clean = line.replace("—", "-").replace("“", '"').replace("”", '"').replace("’", "'").replace("★", "*")
        line_clean = "".join([c if ord(c) < 128 else "" for c in line_clean])
        clean_lines.append(line_clean)

    # Format text into PDF stream
    text_commands = ["BT", "/F1 10 Tf", "50 780 Td", "14 TL"]
    for l in clean_lines[:52]: # Fit on single page
        safe_line = l.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        if l.isupper() and len(l) < 30:
            text_commands.append(f"/F1 11 Tf ({safe_line}) Tj T* /F1 9 Tf")
        else:
            text_commands.append(f"({safe_line}) Tj T*")
    text_commands.append("ET")
    stream_content = "\n".join(text_commands).encode("latin1")

    stream_len = len(stream_content)

    pdf_body = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length {stream_len} >>
stream
""".encode("latin1") + stream_content + b"""
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
""" + str(400 + stream_len).encode("latin1") + b"""
%%EOF
"""
    with open(output_path, "wb") as f:
        f.write(pdf_body)
    print(f"Generated PDF: {output_path}")

if __name__ == "__main__":
    dir_path = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(dir_path, "rahul_resume.txt"), "r", encoding="utf-8") as f:
        resume_txt = f.read()
    with open(os.path.join(dir_path, "rahul_marksheet.txt"), "r", encoding="utf-8") as f:
        marksheet_txt = f.read()

    create_simple_pdf(resume_txt, os.path.join(dir_path, "rahul_resume.pdf"), "Rahul Sharma Resume")
    create_simple_pdf(marksheet_txt, os.path.join(dir_path, "rahul_marksheet.pdf"), "Rahul Sharma Marksheet")
