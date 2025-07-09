// Mock data for the pilgrimage app
export const mockPilgrimageGroups = {
  "group_001": {
    id: "group_001",
    name: "Holy Land Pilgrimage 2025",
    destination: "Jerusalem & Bethlehem",
    startDate: "2025-03-15",
    endDate: "2025-03-22",
    status: "upcoming",
    pilgrims: [
      { id: "p1", name: "Maria Santos", email: "maria@email.com" },
      { id: "p2", name: "John Rodriguez", email: "john@email.com" },
      { id: "p3", name: "Catherine Williams", email: "catherine@email.com" }
    ]
  },
  "group_002": {
    id: "group_002",
    name: "Fatima Centennial Journey",
    destination: "Fatima, Portugal",
    startDate: "2025-05-10",
    endDate: "2025-05-16",
    status: "upcoming",
    pilgrims: [
      { id: "p4", name: "Robert Chen", email: "robert@email.com" },
      { id: "p5", name: "Isabella Garcia", email: "isabella@email.com" }
    ]
  }
};

export const mockItineraries = {
  "group_001": {
    id: "group_001",
    groupName: "Holy Land Pilgrimage 2025",
    flights: {
      departure: {
        from: "New York (JFK)",
        to: "Tel Aviv (TLV)",
        date: "2025-03-15",
        time: "10:30 AM",
        airline: "El Al",
        flightNumber: "LY008"
      },
      return: {
        from: "Tel Aviv (TLV)",
        to: "New York (JFK)",
        date: "2025-03-22",
        time: "11:45 PM",
        airline: "El Al",
        flightNumber: "LY007"
      }
    },
    included: [
      "Round-trip flights",
      "4-star hotel accommodations",
      "All breakfasts and dinners",
      "Professional tour guide",
      "Transportation throughout",
      "Entrance fees to holy sites",
      "Daily Mass arrangements"
    ],
    notIncluded: [
      "Lunches",
      "Personal expenses",
      "Travel insurance",
      "Gratuities",
      "Beverages with meals"
    ],
    dailySchedule: [
      {
        day: 1,
        date: "2025-03-15",
        title: "Arrival in the Holy Land",
        activities: [
          "Arrival at Ben Gurion Airport",
          "Transfer to hotel in Jerusalem",
          "Welcome dinner and orientation"
        ],
        biblicalQuote: "Pray for the peace of Jerusalem: 'May those who love you be secure.' - Psalm 122:6",
        accommodation: "Mount Zion Hotel, Jerusalem"
      },
      {
        day: 2,
        date: "2025-03-16",
        title: "Old City Jerusalem",
        activities: [
          "Visit to the Western Wall",
          "Walk the Via Dolorosa",
          "Church of the Holy Sepulchre",
          "Mass at the Church of the Holy Sepulchre"
        ],
        biblicalQuote: "And carrying his own cross, he went out to the place of the Skull (which in Aramaic is called Golgotha). - John 19:17",
        accommodation: "Mount Zion Hotel, Jerusalem"
      },
      {
        day: 3,
        date: "2025-03-17",
        title: "Mount of Olives & Gethsemane",
        activities: [
          "Sunrise at Mount of Olives",
          "Church of All Nations",
          "Garden of Gethsemane",
          "Dominus Flevit Church"
        ],
        biblicalQuote: "Then Jesus went with his disciples to a place called Gethsemane, and he said to them, 'Sit here while I go over there and pray.' - Matthew 26:36",
        accommodation: "Mount Zion Hotel, Jerusalem"
      },
      {
        day: 4,
        date: "2025-03-18",
        title: "Bethlehem - City of the Nativity",
        activities: [
          "Church of the Nativity",
          "Manger Square",
          "Shepherds' Field",
          "Mass at the Church of the Nativity"
        ],
        biblicalQuote: "But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel. - Micah 5:2",
        accommodation: "Mount Zion Hotel, Jerusalem"
      },
      {
        day: 5,
        date: "2025-03-19",
        title: "Sea of Galilee",
        activities: [
          "Capernaum - Jesus' second home",
          "Church of the Multiplication",
          "Mount of Beatitudes",
          "Boat ride on Sea of Galilee"
        ],
        biblicalQuote: "Jesus went throughout Galilee, teaching in their synagogues, proclaiming the good news of the kingdom. - Matthew 4:23",
        accommodation: "Galilee Hotel, Tiberias"
      },
      {
        day: 6,
        date: "2025-03-20",
        title: "Nazareth & Cana",
        activities: [
          "Basilica of the Annunciation",
          "St. Joseph's Workshop",
          "Wedding Church at Cana",
          "Renewal of wedding vows ceremony"
        ],
        biblicalQuote: "The angel went to her and said, 'Greetings, you who are highly favored! The Lord is with you.' - Luke 1:28",
        accommodation: "Galilee Hotel, Tiberias"
      },
      {
        day: 7,
        date: "2025-03-21",
        title: "Jordan River & Dead Sea",
        activities: [
          "Jordan River baptismal site",
          "Optional baptism renewal",
          "Dead Sea experience",
          "Farewell dinner in Jerusalem"
        ],
        biblicalQuote: "As soon as Jesus was baptized, he went up out of the water. At that moment heaven was opened. - Matthew 3:16",
        accommodation: "Mount Zion Hotel, Jerusalem"
      },
      {
        day: 8,
        date: "2025-03-22",
        title: "Departure",
        activities: [
          "Final Mass in Jerusalem",
          "Last-minute shopping",
          "Transfer to airport",
          "Departure to home"
        ],
        biblicalQuote: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit. - Matthew 28:19",
        accommodation: "Flight home"
      }
    ]
  }
};

export const mockDestinations = {
  "jerusalem": {
    id: "jerusalem",
    name: "Jerusalem",
    country: "Israel",
    description: "The Holy City, sacred to three major religions",
    facts: [
      "Jerusalem is mentioned over 800 times in the Bible",
      "The Western Wall is the last remaining wall of the Second Temple",
      "The Via Dolorosa is traditionally believed to be the path Jesus walked to crucifixion",
      "The Old City covers just 0.35 square miles but contains sites sacred to Christianity, Judaism, and Islam"
    ],
    spiritualSignificance: "Jerusalem holds profound significance as the place of Jesus' crucifixion, burial, and resurrection. It is also the site of the Last Supper and many of Jesus' teachings.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  },
  "bethlehem": {
    id: "bethlehem",
    name: "Bethlehem",
    country: "Palestine",
    description: "The birthplace of Jesus Christ",
    facts: [
      "The Church of the Nativity is one of the oldest continuously operating churches in the world",
      "The Silver Star marks the traditional spot where Jesus was born",
      "Bethlehem means 'House of Bread' in Hebrew",
      "The city is mentioned 44 times in the Bible"
    ],
    spiritualSignificance: "Bethlehem is the birthplace of Jesus Christ, making it one of the most important pilgrimage destinations for Christians worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  },
  "fatima": {
    id: "fatima",
    name: "Fatima",
    country: "Portugal",
    description: "Site of the famous Marian apparitions",
    facts: [
      "The apparitions occurred to three shepherd children in 1917",
      "The Sanctuary receives over 4 million pilgrims annually",
      "The Miracle of the Sun was witnessed by approximately 70,000 people",
      "Pope Francis canonized Francisco and Jacinta Marto in 2017"
    ],
    spiritualSignificance: "Fatima is one of the most important Marian pilgrimage sites, where the Virgin Mary appeared to three children with messages of peace and conversion.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  }
};

export const mockPrayers = {
  "liturgy_of_hours": {
    id: "liturgy_of_hours",
    title: "Liturgy of the Hours",
    description: "The official prayer of the Catholic Church",
    prayers: {
      "lauds": {
        title: "Lauds (Morning Prayer)",
        content: `
O God, come to my assistance.
Lord, make haste to help me.
Glory be to the Father, and to the Son, and to the Holy Spirit:
as it was in the beginning, is now, and ever shall be, 
world without end. Amen. Alleluia.

CANTICLE OF ZECHARIAH (Luke 1:68-79)

Blessed be the Lord, the God of Israel;
he has come to his people and set them free.
He has raised up for us a mighty savior,
born of the house of his servant David.
        `
      },
      "vespers": {
        title: "Vespers (Evening Prayer)",
        content: `
O God, come to my assistance.
Lord, make haste to help me.
Glory be to the Father, and to the Son, and to the Holy Spirit:
as it was in the beginning, is now, and ever shall be, 
world without end. Amen. Alleluia.

CANTICLE OF MARY (Luke 1:46-55)

My soul proclaims the greatness of the Lord,
my spirit rejoices in God my Savior
for he has looked with favor on his lowly servant.
From this day all generations will call me blessed:
        `
      },
      "compline": {
        title: "Compline (Night Prayer)",
        content: `
The Lord grant us a restful night and peace at the last.
Amen.

Brothers and sisters, it is time to examine our conscience
in preparation for this night prayer.

I confess to almighty God
and to you, my brothers and sisters,
that I have greatly sinned,
in my thoughts and in my words,
in what I have done and in what I have failed to do...
        `
      }
    }
  },
  "rosary": {
    id: "rosary",
    title: "The Holy Rosary",
    description: "A traditional Catholic prayer focused on the life of Jesus and Mary",
    mysteries: {
      "joyful": {
        title: "Joyful Mysteries",
        days: "Monday, Saturday",
        mysteries: [
          "The Annunciation",
          "The Visitation",
          "The Nativity",
          "The Presentation in the Temple",
          "The Finding of Jesus in the Temple"
        ]
      },
      "sorrowful": {
        title: "Sorrowful Mysteries",
        days: "Tuesday, Friday",
        mysteries: [
          "The Agony in the Garden",
          "The Scourging at the Pillar",
          "The Crowning with Thorns",
          "The Carrying of the Cross",
          "The Crucifixion"
        ]
      },
      "glorious": {
        title: "Glorious Mysteries",
        days: "Wednesday, Sunday",
        mysteries: [
          "The Resurrection",
          "The Ascension",
          "The Descent of the Holy Spirit",
          "The Assumption of Mary",
          "The Coronation of Mary"
        ]
      },
      "luminous": {
        title: "Luminous Mysteries",
        days: "Thursday",
        mysteries: [
          "The Baptism of Jesus",
          "The Wedding at Cana",
          "The Proclamation of the Kingdom",
          "The Transfiguration",
          "The Institution of the Eucharist"
        ]
      }
    },
    prayers: {
      "sign_of_cross": "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      "apostles_creed": "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord...",
      "our_father": "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven...",
      "hail_mary": "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus...",
      "glory_be": "Glory be to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and ever shall be, world without end. Amen."
    }
  },
  "daily_prayers": {
    id: "daily_prayers",
    title: "Daily Prayers",
    description: "Essential prayers for daily devotion",
    prayers: [
      {
        title: "Morning Offering",
        content: `
O Jesus, through the Immaculate Heart of Mary,
I offer you my prayers, works, joys, and sufferings
of this day for all the intentions of your Sacred Heart,
in union with the Holy Sacrifice of the Mass
throughout the world,
in reparation for my sins,
for the intentions of all my associates,
and in particular for the intentions of our Holy Father this month. Amen.
        `
      },
      {
        title: "Guardian Angel Prayer",
        content: `
Angel of God, my guardian dear,
to whom God's love commits me here,
ever this day be at my side,
to light and guard, to rule and guide. Amen.
        `
      },
      {
        title: "Prayer Before Meals",
        content: `
Bless us, O Lord, and these thy gifts,
which we are about to receive
from thy bounty,
through Christ our Lord. Amen.
        `
      },
      {
        title: "Prayer After Meals",
        content: `
We give thee thanks, O Lord,
for all thy benefits,
which we have received
from thy goodness,
through Christ our Lord. Amen.
        `
      }
    ]
  }
};

export const mockUser = {
  id: "user_001",
  email: "pilgrim@email.com",
  name: "Maria Santos",
  groupId: "group_001",
  role: "pilgrim"
};

export const mockAdmin = {
  id: "admin_001",
  email: "admin@pilgrimageapp.com",
  name: "Father Michael",
  role: "admin"
};