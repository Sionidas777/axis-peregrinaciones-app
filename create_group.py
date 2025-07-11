#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime

async def create_group():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Create the group
    groups_collection = db.groups
    
    # Check if group exists
    existing_group = await groups_collection.find_one({"id": "group_001"})
    if existing_group:
        print("Group group_001 already exists")
        client.close()
        return
    
    # Create group document
    group_doc = {
        "id": "group_001",
        "name": "Holy Land Pilgrimage 2025",
        "destination": "Jerusalem & Bethlehem",
        "start_date": "2025-03-15",
        "end_date": "2025-03-22",
        "status": "upcoming",
        "pilgrims": [
            {
                "id": "p1",
                "name": "Maria Santos",
                "email": "maria@email.com"
            }
        ],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert group
    await groups_collection.insert_one(group_doc)
    print("Group group_001 created successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_group())