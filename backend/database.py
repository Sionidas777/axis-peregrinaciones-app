from motor.motor_asyncio import AsyncIOMotorClient
from .models import *
from typing import List, Optional
import os
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pilgrimage_db')]

# Collections
users_collection = db.users
groups_collection = db.pilgrimage_groups
itineraries_collection = db.itineraries
destinations_collection = db.destinations
spiritual_content_collection = db.spiritual_content

# User Database Operations
async def create_user(user_data: UserCreate, password_hash: str) -> User:
    user = User(
        email=user_data.email,
        password_hash=password_hash,
        name=user_data.name,
        role=user_data.role,
        group_id=user_data.group_id
    )
    await users_collection.insert_one(user.dict())
    return user

async def get_user_by_email(email: str) -> Optional[User]:
    user_doc = await users_collection.find_one({"email": email})
    if user_doc:
        return User(**user_doc)
    return None

async def get_user_by_id(user_id: str) -> Optional[User]:
    user_doc = await users_collection.find_one({"id": user_id})
    if user_doc:
        return User(**user_doc)
    return None

async def get_users_by_group_id(group_id: str) -> List[User]:
    cursor = users_collection.find({"group_id": group_id})
    users = []
    async for user_doc in cursor:
        users.append(User(**user_doc))
    return users

async def update_user(user_id: str, update_data: dict) -> Optional[User]:
    update_data["updated_at"] = datetime.utcnow()
    result = await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data}
    )
    if result.modified_count > 0:
        return await get_user_by_id(user_id)
    return None

async def delete_user(user_id: str) -> bool:
    result = await users_collection.delete_one({"id": user_id})
    return result.deleted_count > 0

# Pilgrimage Group Database Operations
async def create_pilgrimage_group(group_data: PilgrimageGroupCreate) -> PilgrimageGroup:
    group = PilgrimageGroup(**group_data.dict())
    await groups_collection.insert_one(group.dict())
    return group

async def get_pilgrimage_group_by_id(group_id: str) -> Optional[PilgrimageGroup]:
    group_doc = await groups_collection.find_one({"id": group_id})
    if group_doc:
        return PilgrimageGroup(**group_doc)
    return None

async def get_all_pilgrimage_groups() -> List[PilgrimageGroup]:
    cursor = groups_collection.find({})
    groups = []
    async for group_doc in cursor:
        groups.append(PilgrimageGroup(**group_doc))
    return groups

async def update_pilgrimage_group(group_id: str, update_data: PilgrimageGroupUpdate) -> Optional[PilgrimageGroup]:
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await groups_collection.update_one(
        {"id": group_id},
        {"$set": update_dict}
    )
    if result.modified_count > 0:
        return await get_pilgrimage_group_by_id(group_id)
    return None

async def delete_pilgrimage_group(group_id: str) -> bool:
    result = await groups_collection.delete_one({"id": group_id})
    return result.deleted_count > 0

async def add_pilgrim_to_group(group_id: str, pilgrim_info: PilgrimInfo) -> Optional[PilgrimageGroup]:
    result = await groups_collection.update_one(
        {"id": group_id},
        {"$push": {"pilgrims": pilgrim_info.dict()}}
    )
    if result.modified_count > 0:
        return await get_pilgrimage_group_by_id(group_id)
    return None

async def remove_pilgrim_from_group(group_id: str, pilgrim_id: str) -> Optional[PilgrimageGroup]:
    result = await groups_collection.update_one(
        {"id": group_id},
        {"$pull": {"pilgrims": {"id": pilgrim_id}}}
    )
    if result.modified_count > 0:
        return await get_pilgrimage_group_by_id(group_id)
    return None

# Itinerary Database Operations
async def create_itinerary(itinerary_data: ItineraryCreate) -> Itinerary:
    itinerary = Itinerary(**itinerary_data.dict())
    await itineraries_collection.insert_one(itinerary.dict())
    return itinerary

async def get_itinerary_by_id(itinerary_id: str) -> Optional[Itinerary]:
    itinerary_doc = await itineraries_collection.find_one({"id": itinerary_id})
    if itinerary_doc:
        return Itinerary(**itinerary_doc)
    return None

async def get_itinerary_by_group_id(group_id: str) -> Optional[Itinerary]:
    itinerary_doc = await itineraries_collection.find_one({"group_id": group_id})
    if itinerary_doc:
        return Itinerary(**itinerary_doc)
    return None

async def get_all_itineraries() -> List[Itinerary]:
    cursor = itineraries_collection.find({})
    itineraries = []
    async for itinerary_doc in cursor:
        itineraries.append(Itinerary(**itinerary_doc))
    return itineraries

async def update_itinerary(itinerary_id: str, update_data: ItineraryUpdate) -> Optional[Itinerary]:
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await itineraries_collection.update_one(
        {"id": itinerary_id},
        {"$set": update_dict}
    )
    if result.modified_count > 0:
        return await get_itinerary_by_id(itinerary_id)
    return None

async def delete_itinerary(itinerary_id: str) -> bool:
    result = await itineraries_collection.delete_one({"id": itinerary_id})
    return result.deleted_count > 0

# Destination Database Operations
async def create_destination(destination_data: DestinationCreate) -> Destination:
    destination = Destination(**destination_data.dict())
    await destinations_collection.insert_one(destination.dict())
    return destination

async def get_destination_by_id(destination_id: str) -> Optional[Destination]:
    destination_doc = await destinations_collection.find_one({"id": destination_id})
    if destination_doc:
        return Destination(**destination_doc)
    return None

async def get_all_destinations() -> List[Destination]:
    cursor = destinations_collection.find({})
    destinations = []
    async for destination_doc in cursor:
        destinations.append(Destination(**destination_doc))
    return destinations

async def update_destination(destination_id: str, update_data: DestinationUpdate) -> Optional[Destination]:
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await destinations_collection.update_one(
        {"id": destination_id},
        {"$set": update_dict}
    )
    if result.modified_count > 0:
        return await get_destination_by_id(destination_id)
    return None

async def delete_destination(destination_id: str) -> bool:
    result = await destinations_collection.delete_one({"id": destination_id})
    return result.deleted_count > 0

# Spiritual Content Database Operations
async def create_spiritual_content(content_data: SpiritualContentCreate) -> SpiritualContent:
    content = SpiritualContent(**content_data.dict())
    await spiritual_content_collection.insert_one(content.dict())
    return content

async def get_spiritual_content_by_id(content_id: str) -> Optional[SpiritualContent]:
    content_doc = await spiritual_content_collection.find_one({"id": content_id})
    if content_doc:
        return SpiritualContent(**content_doc)
    return None

async def get_spiritual_content_by_category(category: str) -> List[SpiritualContent]:
    cursor = spiritual_content_collection.find({"category": category})
    contents = []
    async for content_doc in cursor:
        contents.append(SpiritualContent(**content_doc))
    return contents

async def get_all_spiritual_content() -> List[SpiritualContent]:
    cursor = spiritual_content_collection.find({})
    contents = []
    async for content_doc in cursor:
        contents.append(SpiritualContent(**content_doc))
    return contents

async def update_spiritual_content(content_id: str, update_data: SpiritualContentUpdate) -> Optional[SpiritualContent]:
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await spiritual_content_collection.update_one(
        {"id": content_id},
        {"$set": update_dict}
    )
    if result.modified_count > 0:
        return await get_spiritual_content_by_id(content_id)
    return None

async def delete_spiritual_content(content_id: str) -> bool:
    result = await spiritual_content_collection.delete_one({"id": content_id})
    return result.deleted_count > 0

# Initialize database with sample data
async def initialize_database():
    # Check if data already exists
    user_count = await users_collection.count_documents({})
    if user_count > 0:
        return  # Database already initialized
    
    print("Initializing database with sample data...")
    
    # Create sample admin user
    from .auth import get_password_hash
    admin_data = UserCreate(
        email="admin@pilgrimageapp.com",
        password="admin123",
        name="Father Michael",
        role=UserRole.ADMIN
    )
    admin_password_hash = get_password_hash(admin_data.password)
    await create_user(admin_data, admin_password_hash)
    
    # Create sample pilgrim users
    pilgrim1_data = UserCreate(
        email="maria@email.com",
        password="password",
        name="Maria Santos",
        role=UserRole.PILGRIM,
        group_id="group_001"
    )
    pilgrim1_password_hash = get_password_hash(pilgrim1_data.password)
    await create_user(pilgrim1_data, pilgrim1_password_hash)
    
    pilgrim2_data = UserCreate(
        email="john@email.com",
        password="password",
        name="John Rodriguez",
        role=UserRole.PILGRIM,
        group_id="group_001"
    )
    pilgrim2_password_hash = get_password_hash(pilgrim2_data.password)
    await create_user(pilgrim2_data, pilgrim2_password_hash)
    
    # Create sample pilgrimage group with fixed ID
    group_data = PilgrimageGroupCreate(
        name="Holy Land Pilgrimage 2025",
        destination="Jerusalem & Bethlehem",
        start_date="2025-03-15",
        end_date="2025-03-22",
        status=PilgrimageStatus.UPCOMING
    )
    # Create group with fixed ID for consistency with mock data
    group = PilgrimageGroup(**group_data.dict())
    group.id = "group_001"  # Fixed ID to match mock data
    await groups_collection.insert_one(group.dict())
    
    # Update group with pilgrim info
    await add_pilgrim_to_group("group_001", PilgrimInfo(
        id="p1",
        name="Maria Santos",
        email="maria@email.com"
    ))
    await add_pilgrim_to_group("group_001", PilgrimInfo(
        id="p2",
        name="John Rodriguez",
        email="john@email.com"
    ))
    
    # Create sample destinations
    destinations = [
        DestinationCreate(
            name="Jerusalem",
            country="Israel",
            description="The Holy City, sacred to three major religions",
            facts=[
                "Jerusalem is mentioned over 800 times in the Bible",
                "The Western Wall is the last remaining wall of the Second Temple",
                "The Via Dolorosa is traditionally believed to be the path Jesus walked to crucifixion",
                "The Old City covers just 0.35 square miles but contains sites sacred to Christianity, Judaism, and Islam"
            ],
            spiritual_significance="Jerusalem holds profound significance as the place of Jesus' crucifixion, burial, and resurrection. It is also the site of the Last Supper and many of Jesus' teachings.",
            image_url="https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
        ),
        DestinationCreate(
            name="Bethlehem",
            country="Palestine",
            description="The birthplace of Jesus Christ",
            facts=[
                "The Church of the Nativity is one of the oldest continuously operating churches in the world",
                "The Silver Star marks the traditional spot where Jesus was born",
                "Bethlehem means 'House of Bread' in Hebrew",
                "The city is mentioned 44 times in the Bible"
            ],
            spiritual_significance="Bethlehem is the birthplace of Jesus Christ, making it one of the most important pilgrimage destinations for Christians worldwide.",
            image_url="https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
        ),
        DestinationCreate(
            name="Fatima",
            country="Portugal",
            description="Site of the famous Marian apparitions",
            facts=[
                "The apparitions occurred to three shepherd children in 1917",
                "The Sanctuary receives over 4 million pilgrims annually",
                "The Miracle of the Sun was witnessed by approximately 70,000 people",
                "Pope Francis canonized Francisco and Jacinta Marto in 2017"
            ],
            spiritual_significance="Fatima is one of the most important Marian pilgrimage sites, where the Virgin Mary appeared to three children with messages of peace and conversion.",
            image_url="https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
        )
    ]
    
    for dest_data in destinations:
        await create_destination(dest_data)
    
    print("Database initialized successfully!")