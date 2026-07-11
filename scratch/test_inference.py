import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("backend/.env")

api_key = os.getenv("FIREWORKS_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.fireworks.ai/inference/v1",
)

# Test the active models returned by the API
active_models = [
    "accounts/fireworks/models/deepseek-v4-pro",
    "accounts/fireworks/models/gpt-oss-120b",
    "accounts/fireworks/models/glm-5p1",
]

for model in active_models:
    print(f"Testing active model: {model} ... ", end="")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Say hello!"}],
            max_tokens=10
        )
        print("SUCCESS!")
        print(f"Response: {response.choices[0].message.content.strip()}")
        break
    except Exception as e:
        print(f"FAILED ({e})")
