from fastapi import APIRouter, UploadFile
import os
from utils.pdf_parser import extract_text

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile):
    try:
        path = f"temp_{file.filename}"
        
        with open(path, "wb") as f:
            f.write(await file.read())

        text = extract_text(path)

        # ✅ SAVE TO FILE (PERMANENT)
        with open("document.txt", "w", encoding="utf-8") as f:
            f.write(text)

        os.remove(path)

        print("Document saved to file")

        return {"message": "File uploaded successfully"}

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}