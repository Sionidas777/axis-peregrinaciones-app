#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_users():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Find users
    users_collection = db.users
    cursor = users_collection.find({})
    
    print("Users in database:")
    async for user in cursor:
        print(f"Email: {user.get('email')}, Name: {user.get('name')}, Role: {user.get('role')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_users())