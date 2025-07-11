from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserRole(str, Enum):
    ADMIN = "admin"
    PILGRIM = "pilgrim"

class PilgrimageStatus(str, Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    name: str
    role: UserRole
    group_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole
    group_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    group_id: Optional[str] = None
    created_at: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    group_id: Optional[str] = None

# Pilgrimage Group Models
class PilgrimInfo(BaseModel):
    id: str
    name: str
    email: str

class PilgrimageGroup(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    destination: str
    start_date: str
    end_date: str
    status: PilgrimageStatus
    pilgrims: List[PilgrimInfo] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PilgrimageGroupCreate(BaseModel):
    name: str
    destination: str
    start_date: str
    end_date: str
    status: PilgrimageStatus = PilgrimageStatus.UPCOMING

class PilgrimageGroupUpdate(BaseModel):
    name: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[PilgrimageStatus] = None

# Flight Models
class FlightInfo(BaseModel):
    from_location: str = Field(..., alias="from")
    to: str
    date: str
    time: str
    airline: str
    flight_number: str

class FlightDetails(BaseModel):
    departure: FlightInfo
    return_flight: FlightInfo = Field(..., alias="return")

# Daily Schedule Models
class DailySchedule(BaseModel):
    day: int
    date: str
    title: str
    activities: List[str]
    biblical_quote: str
    accommodation: str

# Itinerary Models
class Itinerary(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    group_id: str
    group_name: str
    flights: FlightDetails
    included: List[str]
    not_included: List[str]
    daily_schedule: List[DailySchedule]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ItineraryCreate(BaseModel):
    group_id: str
    group_name: str
    flights: FlightDetails
    included: List[str]
    not_included: List[str]
    daily_schedule: List[DailySchedule]

class ItineraryUpdate(BaseModel):
    group_name: Optional[str] = None
    flights: Optional[FlightDetails] = None
    included: Optional[List[str]] = None
    not_included: Optional[List[str]] = None
    daily_schedule: Optional[List[DailySchedule]] = None

# Destination Models
class Destination(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    description: str
    facts: List[str]
    spiritual_significance: str
    image_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DestinationCreate(BaseModel):
    name: str
    country: str
    description: str
    facts: List[str]
    spiritual_significance: str
    image_url: str

class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    facts: Optional[List[str]] = None
    spiritual_significance: Optional[str] = None
    image_url: Optional[str] = None

# Spiritual Content Models
class Prayer(BaseModel):
    title: str
    content: str

class LiturgyPrayer(BaseModel):
    title: str
    content: str

class RosaryMystery(BaseModel):
    title: str
    days: str
    mysteries: List[str]

class SpiritualContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    type: str  # prayer, reading, meditation
    content: str  # Changed from Dict to str
    category: str  # devotion, daily, pilgrimage, liturgy
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SpiritualContentCreate(BaseModel):
    title: str
    type: str
    content: str  # Changed from Dict to str
    category: str

class SpiritualContentUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    content: Optional[str] = None  # Changed from Dict to str
    category: Optional[str] = None

# Authentication Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None