from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os

load_dotenv()

ADMIN: str = os.environ['ADMIN_USER']
PASSWORD: str = os.environ['PASSWORD']
COLLECTION: str = os.environ['DB_COLLECTION']
DOCUMENT: str = os.environ['COLLECTION_DB_DOCUMENT']

uri: str = f"mongodb+srv://{ADMIN}:{PASSWORD}@cluster0.u01k2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri, server_api=ServerApi('1'))


try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


db = client  # .dummy  # {Database cluster name should go here}

collection = db[COLLECTION]

user_collection = db[DOCUMENT]
