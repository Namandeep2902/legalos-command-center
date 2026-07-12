import os
import json
import re
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
    "accounts/fireworks/models/deepseek-v4-pro",
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
                "content": "You are a legal AI assistant. Always respond with valid JSON only. Do not wrap the JSON in markdown code blocks.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=4096,
    )

    raw = response.choices[0].message.content.strip()

    # Clean up output
    if raw.startswith("```"):
        # split by code block markers
        blocks = raw.split("```")
        for block in blocks:
            cleaned = block.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()
            if (cleaned.startswith("{") and cleaned.endswith("}")) or (cleaned.startswith("[") and cleaned.endswith("]")):
                raw = cleaned
                break

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Try regex search for JSON block
        json_match = re.search(r"(\{.*\}|\[.*\])", raw, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Fallbacks to avoid crashing the whole pipeline
        print(f"Warning: Failed to parse JSON from Fireworks. Raw response: {raw}")
        if "timeline" in prompt.lower():
            return {
                "brief": "Summary of uploaded document. Unable to parse structured JSON.",
                "timeline": [],
                "missing_docs": [],
                "recommendations": [],
                "risk_reason": "Low confidence due to parsing limitations.",
                "risk_level": "Medium",
                "health_score": 70
            }
        else:
            return {
                "category": "Other",
                "confidence": 75,
                "brief": "Document uploaded successfully.",
                "risk_signals": [],
                "entities": {}
            }
