#!/usr/bin/env python3
import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from database import initialize_database, get_database
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    print("Reinitializing database...")
    
    # Clear existing data
    db = get_database()
    
    # Drop all collections
    collections = await db.list_collection_names()
    for collection_name in collections:
        print(f"Dropping collection: {collection_name}")
        await db.drop_collection(collection_name)
    
    # Reinitialize with fresh data
    await initialize_database()
    
    print("Database reinitialized successfully!")

if __name__ == "__main__":
    asyncio.run(main())