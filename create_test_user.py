#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
import uuid
from datetime import datetime

async def create_test_user():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Setup password context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Create a test user
    test_password = "password"
    password_hash = pwd_context.hash(test_password)
    
    print(f"Creating test user with password hash: {password_hash}")
    
    # Verify the hash works
    is_valid = pwd_context.verify(test_password, password_hash)
    print(f"Password verification test: {is_valid}")
    
    if is_valid:
        # Create user document
        user_doc = {
            "id": str(uuid.uuid4()),
            "email": "maria@email.com",
            "password_hash": password_hash,
            "name": "Maria Santos",
            "role": "pilgrim",
            "group_id": "group_001",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Remove existing user if exists
        users_collection = db.users
        await users_collection.delete_one({"email": "maria@email.com"})
        
        # Insert new user
        await users_collection.insert_one(user_doc)
        
        print("Test user created successfully!")
    else:
        print("Password hash verification failed!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_test_user())