#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_groups():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Find groups
    groups_collection = db.groups
    cursor = groups_collection.find({})
    
    print("Groups in database:")
    async for group in cursor:
        print(f"ID: {group.get('id')}, Name: {group.get('name')}, Status: {group.get('status')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_groups())