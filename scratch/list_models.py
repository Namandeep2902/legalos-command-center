import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("backend/.env")

api_key = os.getenv("FIREWORKS_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.fireworks.ai/inference/v1",
)

try:
    models = client.models.list()
    ids = [m.id for m in models.data]
    print("\nAll Available Models on Fireworks:")
    for m in sorted(ids):
        print(f"- {m}")
except Exception as e:
    print(f"Error: {e}")
