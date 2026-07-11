import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Fireworks AI uses OpenAI-compatible API
fireworks_client = OpenAI(
    api_key=os.getenv("FIREWORKS_API_KEY"),
    base_url="https://api.fireworks.ai/inference/v1",
)

FIREWORKS_MODEL = os.getenv(
    "FIREWORKS_MODEL",
    "accounts/fireworks/models/llama-v3p1-70b-instruct",
)


def call_fireworks(prompt: str) -> dict | list:
    """
    Send a prompt to Fireworks AI and parse the JSON response.
    Returns parsed dict or list.
    """
    response = fireworks_client.chat.completions.create(
        model=FIREWORKS_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a legal AI assistant. Always respond with valid JSON only.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    return json.loads(raw)
