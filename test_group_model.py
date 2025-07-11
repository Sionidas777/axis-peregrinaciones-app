#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys

# Add the backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from models import PilgrimageGroup

async def test_group_model():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Find groups
    groups_collection = db.groups
    group_doc = await groups_collection.find_one({"id": "group_001"})
    
    if group_doc:
        print("Raw group document:")
        print(group_doc)
        
        try:
            group = PilgrimageGroup(**group_doc)
            print("Successfully created PilgrimageGroup model:")
            print(f"ID: {group.id}")
            print(f"Name: {group.name}")
            print(f"Status: {group.status}")
        except Exception as e:
            print(f"Error creating PilgrimageGroup model: {e}")
    else:
        print("Group not found in database")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(test_group_model())