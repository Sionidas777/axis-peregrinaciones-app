#!/usr/bin/env python3
import asyncio
import os
import sys
from datetime import datetime
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def initialize_db():
    # Get MongoDB URL from environment
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/pilgrimage_app')
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongo_url)
    db = client.get_default_database()
    
    users_collection = db.users
    groups_collection = db.groups
    
    # Check if users already exist
    user_count = await users_collection.count_documents({})
    if user_count > 0:
        print("Database already initialized")
        client.close()
        return
    
    print("Initializing database...")
    
    # Create admin user with specified credentials
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "julian.alcalde@axisperegrinaciones.com",
        "password_hash": get_password_hash("Peregrina7'7$$$%%%"),
        "name": "Julian Alcalde",
        "role": "admin",
        "group_id": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Create sample pilgrim
    pilgrim_user = {
        "id": str(uuid.uuid4()),
        "email": "maria@email.com",
        "password_hash": get_password_hash("password"),
        "name": "Maria Santos",
        "role": "pilgrim",
        "group_id": "group_001",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Create sample group
    sample_group = {
        "id": "group_001",
        "name": "Peregrinación a Tierra Santa 2025",
        "destination": "Tierra Santa",
        "start_date": "2025-03-15",
        "end_date": "2025-03-22",
        "status": "active",
        "pilgrims": [pilgrim_user["id"]],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert into database
    await users_collection.insert_one(admin_user)
    await users_collection.insert_one(pilgrim_user)
    await groups_collection.insert_one(sample_group)
    
    print("Database initialized successfully!")
    print(f"Admin created: {admin_user['email']} - {admin_user['name']}")
    print(f"Pilgrim created: {pilgrim_user['email']} - {pilgrim_user['name']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(initialize_db())