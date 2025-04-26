import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
_client = None

def get_client():
    global _client
    if _client is None:
        mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
        _client = MongoClient(mongo_uri)
    return _client

def get_db():
    client = get_client()
    db_name = os.environ.get('MONGO_DB', 'trash_to_cash')
    return client[db_name]

def close_db():
    global _client
    if _client is not None:
        _client.close()
        _client = None