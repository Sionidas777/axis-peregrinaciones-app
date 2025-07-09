from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from starlette.middleware.cors import CORSMiddleware
from datetime import timedelta
import os
import logging
from pathlib import Path
from typing import List

# Import our models and database functions
from .models import *
from .database import *
from .auth import *

ROOT_DIR = Path(__file__).parent

# Create the main app without a prefix
app = FastAPI(title="Sacred Journey API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    password_hash = get_password_hash(user_data.password)
    user = await create_user(user_data, password_hash)
    
    # If user is a pilgrim and has group_id, add them to the group
    if user.role == UserRole.PILGRIM and user.group_id:
        pilgrim_info = PilgrimInfo(
            id=user.id,
            name=user.name,
            email=user.email
        )
        await add_pilgrim_to_group(user.group_id, pilgrim_info)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        group_id=user.group_id,
        created_at=user.created_at
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return access token"""
    user = await get_user_by_email(user_credentials.email)
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            group_id=user.group_id,
            created_at=user.created_at
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        group_id=current_user.group_id,
        created_at=current_user.created_at
    )

# Pilgrimage Groups endpoints
@api_router.get("/groups", response_model=List[PilgrimageGroup])
async def get_all_groups(current_user: User = Depends(get_current_admin)):
    """Get all pilgrimage groups (admin only)"""
    return await get_all_pilgrimage_groups()

@api_router.get("/groups/{group_id}", response_model=PilgrimageGroup)
async def get_group(group_id: str, current_user: User = Depends(get_current_user)):
    """Get specific pilgrimage group"""
    # Pilgrims can only access their own group
    if current_user.role == UserRole.PILGRIM and current_user.group_id != group_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this group"
        )
    
    group = await get_pilgrimage_group_by_id(group_id)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    return group

@api_router.post("/groups", response_model=PilgrimageGroup)
async def create_group(group_data: PilgrimageGroupCreate, current_user: User = Depends(get_current_admin)):
    """Create new pilgrimage group (admin only)"""
    return await create_pilgrimage_group(group_data)

@api_router.put("/groups/{group_id}", response_model=PilgrimageGroup)
async def update_group(group_id: str, group_data: PilgrimageGroupUpdate, current_user: User = Depends(get_current_admin)):
    """Update pilgrimage group (admin only)"""
    group = await update_pilgrimage_group(group_id, group_data)
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    return group

@api_router.delete("/groups/{group_id}")
async def delete_group(group_id: str, current_user: User = Depends(get_current_admin)):
    """Delete pilgrimage group (admin only)"""
    success = await delete_pilgrimage_group(group_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    return {"message": "Group deleted successfully"}

# Itinerary endpoints
@api_router.get("/itineraries", response_model=List[Itinerary])
async def get_all_itineraries_endpoint(current_user: User = Depends(get_current_admin)):
    """Get all itineraries (admin only)"""
    return await get_all_itineraries()

@api_router.get("/itineraries/group/{group_id}", response_model=Itinerary)
async def get_itinerary_by_group(group_id: str, current_user: User = Depends(get_current_user)):
    """Get itinerary for specific group"""
    # Pilgrims can only access their own group's itinerary
    if current_user.role == UserRole.PILGRIM and current_user.group_id != group_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this itinerary"
        )
    
    itinerary = await get_itinerary_by_group_id(group_id)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    return itinerary

@api_router.post("/itineraries", response_model=Itinerary)
async def create_itinerary_endpoint(itinerary_data: ItineraryCreate, current_user: User = Depends(get_current_admin)):
    """Create new itinerary (admin only)"""
    return await create_itinerary(itinerary_data)

@api_router.put("/itineraries/{itinerary_id}", response_model=Itinerary)
async def update_itinerary_endpoint(itinerary_id: str, itinerary_data: ItineraryUpdate, current_user: User = Depends(get_current_admin)):
    """Update itinerary (admin only)"""
    itinerary = await update_itinerary(itinerary_id, itinerary_data)
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    return itinerary

@api_router.delete("/itineraries/{itinerary_id}")
async def delete_itinerary_endpoint(itinerary_id: str, current_user: User = Depends(get_current_admin)):
    """Delete itinerary (admin only)"""
    success = await delete_itinerary(itinerary_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found"
        )
    return {"message": "Itinerary deleted successfully"}

# Destinations endpoints
@api_router.get("/destinations", response_model=List[Destination])
async def get_all_destinations_endpoint():
    """Get all destinations (public)"""
    return await get_all_destinations()

@api_router.get("/destinations/{destination_id}", response_model=Destination)
async def get_destination(destination_id: str):
    """Get specific destination (public)"""
    destination = await get_destination_by_id(destination_id)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    return destination

@api_router.post("/destinations", response_model=Destination)
async def create_destination_endpoint(destination_data: DestinationCreate, current_user: User = Depends(get_current_admin)):
    """Create new destination (admin only)"""
    return await create_destination(destination_data)

@api_router.put("/destinations/{destination_id}", response_model=Destination)
async def update_destination_endpoint(destination_id: str, destination_data: DestinationUpdate, current_user: User = Depends(get_current_admin)):
    """Update destination (admin only)"""
    destination = await update_destination(destination_id, destination_data)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    return destination

@api_router.delete("/destinations/{destination_id}")
async def delete_destination_endpoint(destination_id: str, current_user: User = Depends(get_current_admin)):
    """Delete destination (admin only)"""
    success = await delete_destination(destination_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    return {"message": "Destination deleted successfully"}

# Spiritual Content endpoints
@api_router.get("/spiritual-content", response_model=List[SpiritualContent])
async def get_all_spiritual_content_endpoint():
    """Get all spiritual content (public)"""
    return await get_all_spiritual_content()

@api_router.get("/spiritual-content/category/{category}", response_model=List[SpiritualContent])
async def get_spiritual_content_by_category(category: str):
    """Get spiritual content by category (public)"""
    return await get_spiritual_content_by_category(category)

@api_router.post("/spiritual-content", response_model=SpiritualContent)
async def create_spiritual_content(content_data: SpiritualContentCreate, current_user: User = Depends(get_current_admin)):
    """Create new spiritual content (admin only)"""
    return await create_spiritual_content(content_data)

@api_router.put("/spiritual-content/{content_id}", response_model=SpiritualContent)
async def update_spiritual_content(content_id: str, content_data: SpiritualContentUpdate, current_user: User = Depends(get_current_admin)):
    """Update spiritual content (admin only)"""
    content = await update_spiritual_content(content_id, content_data)
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Spiritual content not found"
        )
    return content

@api_router.delete("/spiritual-content/{content_id}")
async def delete_spiritual_content(content_id: str, current_user: User = Depends(get_current_admin)):
    """Delete spiritual content (admin only)"""
    success = await delete_spiritual_content(content_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Spiritual content not found"
        )
    return {"message": "Spiritual content deleted successfully"}

# User management endpoints
@api_router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: User = Depends(get_current_admin)):
    """Get all users (admin only)"""
    users = await get_all_pilgrimage_groups()  # This will be implemented
    return users

@api_router.get("/users/group/{group_id}", response_model=List[UserResponse])
async def get_users_by_group(group_id: str, current_user: User = Depends(get_current_user)):
    """Get users in specific group"""
    # Pilgrims can only access their own group
    if current_user.role == UserRole.PILGRIM and current_user.group_id != group_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this group"
        )
    
    users = await get_users_by_group_id(group_id)
    return [UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        group_id=user.group_id,
        created_at=user.created_at
    ) for user in users]

# Test endpoint
@api_router.get("/")
async def root():
    return {"message": "Sacred Journey API is running"}

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Sacred Journey API...")
    try:
        await initialize_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Sacred Journey API...")
    if client:
        client.close()