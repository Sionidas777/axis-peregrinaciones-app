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

async def get_all_users_from_db() -> List[User]:
    """Get all users from database"""
    cursor = users_collection.find({})
    users = []
    async for user_doc in cursor:
        users.append(User(**user_doc))
    return users

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
    # Convert ItineraryCreate to dict using aliases, then create Itinerary
    itinerary_dict = itinerary_data.dict(by_alias=True)
    itinerary = Itinerary.parse_obj(itinerary_dict)
    # Store in MongoDB using aliases so retrieval works correctly
    await itineraries_collection.insert_one(itinerary.dict(by_alias=True))
    return itinerary

async def get_itinerary_by_id(itinerary_id: str) -> Optional[Itinerary]:
    itinerary_doc = await itineraries_collection.find_one({"id": itinerary_id})
    if itinerary_doc:
        return Itinerary.parse_obj(itinerary_doc)
    return None

async def get_itinerary_by_group_id(group_id: str) -> Optional[Itinerary]:
    itinerary_doc = await itineraries_collection.find_one({"group_id": group_id})
    if itinerary_doc:
        return Itinerary.parse_obj(itinerary_doc)
    return None

async def get_all_itineraries() -> List[Itinerary]:
    cursor = itineraries_collection.find({})
    itineraries = []
    async for itinerary_doc in cursor:
        itineraries.append(Itinerary.parse_obj(itinerary_doc))
    return itineraries

async def update_itinerary(itinerary_id: str, update_data: ItineraryUpdate) -> Optional[Itinerary]:
    update_dict = {k: v for k, v in update_data.dict(by_alias=True).items() if v is not None}
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
        try:
            content = SpiritualContent(**content_doc)
            contents.append(content)
        except Exception as e:
            # Log error but continue processing
            print(f"Error processing spiritual content document: {e}")
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
    
    # Create specific admin user with provided credentials
    from .auth import get_password_hash
    admin_data = UserCreate(
        email="julian.alcalde@axisperegrinaciones.com",
        password="Peregrina7'7$$$%%%",
        name="Julian Alcalde",
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
    
    # Create sample spiritual content
    spiritual_contents = [
        SpiritualContentCreate(
            category="rosary",
            title="Santo Rosario",
            description="Misterios del Rosario para la meditación diaria",
            content={
                "introduction": "El Santo Rosario es una oración contemplativa que nos ayuda a meditar en los misterios de la vida de Jesús y María.",
                "how_to_pray": "Se reza con el rosario, meditando en los misterios mientras se recitan las Ave Marías.",
                "joyful_mysteries": [
                    "1. La Anunciación del Ángel a María",
                    "2. La Visitación de María a su prima Isabel",
                    "3. El Nacimiento de Jesús en Belén",
                    "4. La Presentación del Niño Jesús en el Templo",
                    "5. El Niño Jesús perdido y hallado en el Templo"
                ],
                "sorrowful_mysteries": [
                    "1. La Agonía de Jesús en el Huerto de Getsemaní",
                    "2. La Flagelación del Señor",
                    "3. La Coronación de Espinas",
                    "4. Jesús con la Cruz a cuestas camino del Calvario",
                    "5. La Crucifixión y Muerte de Nuestro Señor"
                ],
                "glorious_mysteries": [
                    "1. La Resurrección del Señor",
                    "2. La Ascensión del Señor a los Cielos",
                    "3. La Venida del Espíritu Santo sobre los Apóstoles",
                    "4. La Asunción de María Santísima a los Cielos",
                    "5. La Coronación de María Santísima como Reina del Cielo y de la Tierra"
                ],
                "luminous_mysteries": [
                    "1. El Bautismo de Jesús en el Jordán",
                    "2. Las Bodas de Caná",
                    "3. El Anuncio del Reino de Dios",
                    "4. La Transfiguración del Señor",
                    "5. La Institución de la Eucaristía"
                ]
            }
        ),
        SpiritualContentCreate(
            category="angelus",
            title="El Ángelus",
            description="Oración mariana tradicional que se reza tres veces al día",
            content={
                "introduction": "El Ángelus es una oración que conmemora la Anunciación del Ángel Gabriel a la Virgen María. Se reza tradicionalmente al amanecer, al mediodía y al atardecer.",
                "when_to_pray": "Se reza al amanecer (6:00 AM), al mediodía (12:00 PM) y al atardecer (6:00 PM)",
                "prayer": {
                    "verse1": "V. El Ángel del Señor anunció a María.\nR. Y concibió por obra del Espíritu Santo.",
                    "ave_maria1": "Dios te salve, María...",
                    "verse2": "V. He aquí la esclava del Señor.\nR. Hágase en mí según tu palabra.",
                    "ave_maria2": "Dios te salve, María...",
                    "verse3": "V. Y el Verbo se hizo carne.\nR. Y habitó entre nosotros.",
                    "ave_maria3": "Dios te salve, María...",
                    "final_prayer": "V. Ruega por nosotros, Santa Madre de Dios.\nR. Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo.\n\nOREMOS: Infunde, Señor, tu gracia en nuestras almas, para que los que, por el anuncio del Ángel, hemos conocido la Encarnación de tu Hijo Jesucristo, por su Pasión y Cruz seamos llevados a la gloria de su Resurrección. Por el mismo Jesucristo nuestro Señor. Amén."
                }
            }
        ),
        SpiritualContentCreate(
            category="morning_prayer",
            title="Oración de Inicio del Día",
            description="Oración para comenzar el día encomendándose a Dios",
            content={
                "introduction": "Oración para ofrecer el nuevo día a Dios y pedirle su bendición y protección.",
                "prayer": "Señor Dios, Padre celestial, al despertar a este nuevo día que Tú me concedes, te doy gracias por el descanso de la noche y por la vida que me das.\n\nTe ofrezco este día: mis pensamientos, palabras y obras. Que todo lo que haga sea para tu mayor gloria y para el bien de mis hermanos.\n\nDame sabiduría para tomar buenas decisiones, fortaleza para enfrentar las dificultades, y caridad para amar como Tú me amas.\n\nProtégeme de todo mal y pecado. Que tu Espíritu Santo me guíe en todo momento.\n\nPor intercesión de María Santísima, mi Madre del Cielo, y de mi Ángel de la Guarda.\n\nAmén.",
                "additional_prayers": {
                    "offering": "Oh Jesús, por el Inmaculado Corazón de María, te ofrezco mis oraciones, trabajos, gozos y sufrimientos de este día, en reparación de nuestros pecados y por las intenciones del Santo Padre. Amén.",
                    "protection": "Ángel de Dios, que eres mi custodio, pues la bondad divina me ha encomendado a ti, ilumíname, guárdame, rige y gobiérname. Amén."
                }
            }
        ),
        SpiritualContentCreate(
            category="evening_prayer",
            title="Oración de Finalización del Día",
            description="Oración para agradecer por el día y pedir perdón antes del descanso",
            content={
                "introduction": "Oración para el final del día, agradeciendo a Dios por sus bendiciones y pidiendo perdón por nuestras faltas.",
                "examination": "Breve examen de conciencia:\n- ¿He ofendido a Dios con pensamientos, palabras u obras?\n- ¿He cumplido con mis deberes?\n- ¿He sido caritativo con mi prójimo?\n- ¿He dado buen ejemplo cristiano?",
                "prayer": "Señor Dios, al terminar este día, vengo ante Ti con un corazón agradecido.\n\nTe doy gracias por todas las bendiciones que he recibido: por la vida, la salud, el trabajo, la familia, los amigos y por tu constante amor y misericordia.\n\nTe pido perdón por todas las faltas que he cometido hoy, por las veces que no he correspondido a tu amor, por las oportunidades perdidas de hacer el bien.\n\nPor tu infinita misericordia, perdona mis pecados y ayúdame a ser mejor mañana.\n\nProtege durante la noche a mi familia y a todos mis seres queridos. Concede el descanso eterno a los fieles difuntos y fortalece a los que sufren.\n\nEn tus manos encomiendo mi alma. Que María Santísima me cubra con su manto maternal.\n\nAmén.",
                "final_prayers": {
                    "act_of_contrition": "Señor mío Jesucristo, Dios y hombre verdadero, me pesa de todo corazón haberte ofendido, porque eres infinitamente bueno y amable y el pecado te desagrada. Propongo firmemente, con el auxilio de tu gracia, enmendarme y alejarme de las ocasiones de pecar, confesarme y cumplir la penitencia. Confío en que me perdonarás por tu infinita misericordia. Amén.",
                    "consecration_to_mary": "Oh Señora mía, oh Madre mía, yo me ofrezco todo a Ti, y en prueba de mi filial afecto, te consagro en este día mis ojos, mis oídos, mi lengua, mi corazón; en una palabra, todo mi ser. Ya que soy todo tuyo, oh Madre de bondad, guárdame y defiéndeme como cosa y posesión tuya. Amén."
                }
            }
        ),
        SpiritualContentCreate(
            category="pilgrim_prayer",
            title="Oración del Peregrino",
            description="Oraciones especiales para el tiempo de peregrinación",
            content={
                "introduction": "Oraciones especiales para acompañar al peregrino en su caminar hacia los lugares santos.",
                "main_prayer": "Señor Jesús, como los discípulos de Emaús, camino contigo buscando tu rostro en los lugares santos donde pisaste esta tierra.\n\nHaz que en esta peregrinación mi corazón se abra a tu palabra, mis ojos te reconozcan en el hermano que camina a mi lado, y mis pies sigan fielmente tus huellas.\n\nQue cada paso sea una oración, cada lugar visitado sea un encuentro contigo, y cada momento compartido sea una oportunidad de crecer en santidad.\n\nMadre María, Reina de los Peregrinos, acompáñanos en este camino santo. Protégenos de todo peligro y ayúdanos a llevar tu hijo Jesús en nuestros corazones.\n\nSan José, protector de la Sagrada Familia, cuida de nosotros como cuidaste de Jesús y María en sus viajes.\n\nQue esta peregrinación transforme nuestras vidas y nos haga mejores cristianos.\n\nAmén.",
                "travel_prayer": "Señor, bendice nuestro viaje. Que los ángeles nos acompañen por el camino, que María Santísima nos proteja, y que lleguemos con bien a nuestro destino. Amén.",
                "unity_prayer": "Señor Jesús, bendice a nuestro grupo de peregrinos. Que seamos uno en Ti como Tú eres uno con el Padre. Ayúdanos a ser pacientes unos con otros, a compartir nuestras alegrías y a apoyarnos en las dificultades. Que el amor fraterno sea el signo de que somos tus discípulos. Amén.",
                "holy_places_prayer": "Jesús, al visitar estos lugares santos donde viviste, sufriste y resucitaste, aumenta mi fe, fortalece mi esperanza y enciende mi caridad. Que cada piedra me hable de tu amor, cada rincón me recuerde tu sacrificio, y cada momento me acerque más a Ti. Amén.",
                "thanksgiving_prayer": "Gracias, Señor, por este día santo. Que las experiencias vividas fructifiquen en mi alma y me ayuden a ser mejor cristiano al regresar a casa. Que este viaje no termine aquí, sino que sea el comienzo de una vida más santa y comprometida contigo. Amén."
            }
        )
    ]
    
    for content_data in spiritual_contents:
        await create_spiritual_content(content_data)
    
    print("Database initialized successfully!")