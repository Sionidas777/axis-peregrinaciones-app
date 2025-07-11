#!/usr/bin/env python3
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os

async def test_passwords():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    # Setup password context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Find users
    users_collection = db.users
    cursor = users_collection.find({})
    
    test_password = "password"
    
    print("Testing password verification:")
    async for user in cursor:
        email = user.get('email')
        password_hash = user.get('password_hash')
        
        if email and password_hash:
            is_valid = pwd_context.verify(test_password, password_hash)
            print(f"Email: {email}, Password 'password' valid: {is_valid}")
            
            # Also test with empty password
            is_valid_empty = pwd_context.verify("", password_hash)
            print(f"Email: {email}, Password '' valid: {is_valid_empty}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(test_passwords())