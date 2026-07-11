import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("backend/.env")

api_key = os.getenv("FIREWORKS_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.fireworks.ai/inference/v1",
)

candidate_models = [
    "accounts/fireworks/models/llama-v3p1-70b-instruct",
    "accounts/fireworks/models/llama-v3p1-8b-instruct",
    "accounts/fireworks/models/gemma2-9b-it",
    "accounts/fireworks/models/gemma-2-9b-it",
]

for model in candidate_models:
    print(f"Testing model: {model} ... ", end="")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Ping"}],
            max_tokens=10
        )
        print("SUCCESS!")
        print(f"Found working model: {model}")
        break
    except Exception as e:
        print(f"FAILED ({e})")
