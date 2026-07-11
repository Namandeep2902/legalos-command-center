from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "legalos")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]

# Collections
users_col = db["users"]
cases_col = db["cases"]
documents_col = db["documents"]
ai_analysis_col = db["ai_analysis"]
notes_col = db["notes"]


def get_db():
    return db


def ping_db():
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False
