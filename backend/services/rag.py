
import os
from dotenv import load_dotenv
from groq import Groq

# Load the project's root .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing. Check your .env file.")

client = Groq(api_key=GROQ_API_KEY)


def get_answer(query, document_text):
    print("Calling AI...")

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": "Answer based on document"},
            {
                "role": "user",
                "content": (
                    f"Document:\n{document_text[:1500]}"
                    f"\n\nQuestion: {query}"
                ),
            },
        ],
    )

    print("AI responded")
    return response.choices[0].message.content
