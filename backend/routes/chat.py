from fastapi import APIRouter
from pydantic import BaseModel
from services.rag import get_answer
import os

router = APIRouter()

class Query(BaseModel):
    question: str

@router.post("/chat")
def chat(query: Query):
    try:
        # ✅ CHECK FILE EXISTS
        if not os.path.exists("document.txt"):
            return {"answer": "Please upload a document first"}

        # ✅ READ FILE
        with open("document.txt", "r", encoding="utf-8") as f:
            document_text = f.read()

        print("Document loaded, length:", len(document_text))

        answer = get_answer(query.question, document_text)

        return {"answer": answer}

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}