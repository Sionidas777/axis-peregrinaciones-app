// Datos de ejemplo para la aplicación de peregrinación en español
export const mockPilgrimageGroups = {
  "group_001": {
    id: "group_001",
    name: "Peregrinación a Tierra Santa 2025",
    destination: "Jerusalén y Belén",
    startDate: "2025-03-15",
    endDate: "2025-03-22",
    status: "próximo",
    pilgrims: [
      { id: "p1", name: "María Santos", email: "maria@email.com" },
      { id: "p2", name: "Juan Rodríguez", email: "juan@email.com" },
      { id: "p3", name: "Catalina Williams", email: "catalina@email.com" }
    ]
  },
  "group_002": {
    id: "group_002",
    name: "Peregrinación Centenaria a Fátima",
    destination: "Fátima, Portugal",
    startDate: "2025-05-10",
    endDate: "2025-05-16",
    status: "próximo",
    pilgrims: [
      { id: "p4", name: "Roberto Chen", email: "roberto@email.com" },
      { id: "p5", name: "Isabella García", email: "isabella@email.com" }
    ]
  }
};

export const mockItineraries = {
  "group_001": {
    id: "group_001",
    groupName: "Peregrinación a Tierra Santa 2025",
    flights: {
      departure: {
        from: "Madrid (MAD)",
        to: "Tel Aviv (TLV)",
        date: "2025-03-15",
        time: "10:30 AM",
        airline: "El Al",
        flightNumber: "LY008"
      },
      return: {
        from: "Tel Aviv (TLV)",
        to: "Madrid (MAD)",
        date: "2025-03-22",
        time: "11:45 PM",
        airline: "El Al",
        flightNumber: "LY007"
      }
    },
    included: [
      "Vuelos de ida y vuelta",
      "Alojamiento en hoteles de 4 estrellas",
      "Todos los desayunos y cenas",
      "Guía turístico profesional",
      "Transporte durante toda la peregrinación",
      "Entradas a lugares santos",
      "Arreglos para la Santa Misa diaria"
    ],
    notIncluded: [
      "Almuerzos",
      "Gastos personales",
      "Seguro de viaje",
      "Propinas",
      "Bebidas con las comidas"
    ],
    dailySchedule: [
      {
        day: 1,
        date: "2025-03-15",
        title: "Llegada a Tierra Santa",
        activities: [
          "Llegada al Aeropuerto Ben Gurion",
          "Traslado al hotel en Jerusalén",
          "Cena de bienvenida y orientación"
        ],
        biblicalQuote: "Pedid por la paz de Jerusalén: 'Vivan seguros los que te aman.' - Salmo 122:6",
        accommodation: "Hotel Monte Sion, Jerusalén"
      },
      {
        day: 2,
        date: "2025-03-16",
        title: "Ciudad Vieja de Jerusalén",
        activities: [
          "Visita al Muro de las Lamentaciones",
          "Recorrido por la Vía Dolorosa",
          "Iglesia del Santo Sepulcro",
          "Santa Misa en la Iglesia del Santo Sepulcro"
        ],
        biblicalQuote: "Y cargando con su cruz, salió hacia el lugar llamado Calvario (que en arameo se dice Gólgota). - Juan 19:17",
        accommodation: "Hotel Monte Sion, Jerusalén"
      },
      {
        day: 3,
        date: "2025-03-17",
        title: "Monte de los Olivos y Getsemaní",
        activities: [
          "Amanecer en el Monte de los Olivos",
          "Iglesia de Todas las Naciones",
          "Jardín de Getsemaní",
          "Iglesia Dominus Flevit"
        ],
        biblicalQuote: "Entonces fue Jesús con sus discípulos a un lugar llamado Getsemaní, y les dijo: 'Sentaos aquí, mientras voy allí a orar.' - Mateo 26:36",
        accommodation: "Hotel Monte Sion, Jerusalén"
      },
      {
        day: 4,
        date: "2025-03-18",
        title: "Belén - Ciudad de la Natividad",
        activities: [
          "Iglesia de la Natividad",
          "Plaza del Pesebre",
          "Campo de los Pastores",
          "Santa Misa en la Iglesia de la Natividad"
        ],
        biblicalQuote: "Pero tú, Belén Efrata, pequeña para estar entre las familias de Judá, de ti me saldrá el que será Señor en Israel. - Miqueas 5:2",
        accommodation: "Hotel Monte Sion, Jerusalén"
      },
      {
        day: 5,
        date: "2025-03-19",
        title: "Mar de Galilea",
        activities: [
          "Cafarnaúm - segundo hogar de Jesús",
          "Iglesia de la Multiplicación",
          "Monte de las Bienaventuranzas",
          "Paseo en barco por el Mar de Galilea"
        ],
        biblicalQuote: "Recorría Jesús toda Galilea, enseñando en sus sinagogas, proclamando el evangelio del reino. - Mateo 4:23",
        accommodation: "Hotel Galilea, Tiberíades"
      },
      {
        day: 6,
        date: "2025-03-20",
        title: "Nazaret y Caná",
        activities: [
          "Basílica de la Anunciación",
          "Taller de San José",
          "Iglesia de las Bodas en Caná",
          "Ceremonia de renovación de votos matrimoniales"
        ],
        biblicalQuote: "Y entrando el ángel en donde ella estaba, dijo: '¡Alégrate, llena de gracia, el Señor está contigo!' - Lucas 1:28",
        accommodation: "Hotel Galilea, Tiberíades"
      },
      {
        day: 7,
        date: "2025-03-21",
        title: "Río Jordán y Mar Muerto",
        activities: [
          "Sitio bautismal del Río Jordán",
          "Renovación bautismal opcional",
          "Experiencia en el Mar Muerto",
          "Cena de despedida en Jerusalén"
        ],
        biblicalQuote: "Apenas fue bautizado Jesús, salió del agua. En ese momento se abrieron los cielos. - Mateo 3:16",
        accommodation: "Hotel Monte Sion, Jerusalén"
      },
      {
        day: 8,
        date: "2025-03-22",
        title: "Partida",
        activities: [
          "Santa Misa final en Jerusalén",
          "Compras de último momento",
          "Traslado al aeropuerto",
          "Partida a casa"
        ],
        biblicalQuote: "Id, pues, y haced discípulos a todas las gentes, bautizándolas en el nombre del Padre y del Hijo y del Espíritu Santo. - Mateo 28:19",
        accommodation: "Vuelo de regreso"
      }
    ]
  }
};

export const mockDestinations = {
  "jerusalen": {
    id: "jerusalen",
    name: "Jerusalén",
    country: "Israel",
    description: "La Ciudad Santa, sagrada para las tres religiones principales",
    facts: [
      "Jerusalén es mencionada más de 800 veces en la Biblia",
      "El Muro de las Lamentaciones es la última pared que queda del Segundo Templo",
      "La Vía Dolorosa es tradicionalmente el camino que Jesús recorrió hacia la crucifixión",
      "La Ciudad Vieja cubre solo 0.35 millas cuadradas pero contiene sitios sagrados para el cristianismo, judaísmo e islam"
    ],
    spiritualSignificance: "Jerusalén tiene una profunda importancia como el lugar de la crucifixión, sepultura y resurrección de Jesús. También es el sitio de la Última Cena y muchas de las enseñanzas de Jesús.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  },
  "belen": {
    id: "belen",
    name: "Belén",
    country: "Palestina",
    description: "El lugar de nacimiento de Jesucristo",
    facts: [
      "La Iglesia de la Natividad es una de las iglesias en funcionamiento continuo más antiguas del mundo",
      "La Estrella de Plata marca el lugar tradicional donde nació Jesús",
      "Belén significa 'Casa del Pan' en hebreo",
      "La ciudad es mencionada 44 veces en la Biblia"
    ],
    spiritualSignificance: "Belén es el lugar de nacimiento de Jesucristo, convirtiéndola en uno de los destinos de peregrinación más importantes para los cristianos de todo el mundo.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  },
  "fatima": {
    id: "fatima",
    name: "Fátima",
    country: "Portugal",
    description: "Sitio de las famosas apariciones marianas",
    facts: [
      "Las apariciones ocurrieron a tres pastorcitos en 1917",
      "El Santuario recibe más de 4 millones de peregrinos anualmente",
      "El Milagro del Sol fue presenciado por aproximadamente 70,000 personas",
      "El Papa Francisco canonizó a Francisco y Jacinta Marto en 2017"
    ],
    spiritualSignificance: "Fátima es uno de los sitios de peregrinación mariana más importantes, donde la Virgen María se apareció a tres niños con mensajes de paz y conversión.",
    imageUrl: "https://images.unsplash.com/photo-1665338033511-e9b19abbce8a"
  }
};

export const mockPrayers = {
  "liturgia_de_las_horas": {
    id: "liturgia_de_las_horas",
    title: "Liturgia de las Horas",
    description: "La oración oficial de la Iglesia Católica",
    prayers: {
      "laudes": {
        title: "Laudes (Oración de la Mañana)",
        content: `
Oh Dios, ven en mi auxilio.
Señor, date prisa en socorrerme.
Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre,
por los siglos de los siglos. Amén. Aleluya.

CÁNTICO DE ZACARÍAS (Lucas 1:68-79)

Bendito sea el Señor, Dios de Israel,
porque ha visitado y redimido a su pueblo,
suscitándonos una fuerza de salvación
en la casa de David, su siervo.
        `
      },
      "visperas": {
        title: "Vísperas (Oración de la Tarde)",
        content: `
Oh Dios, ven en mi auxilio.
Señor, date prisa en socorrerme.
Gloria al Padre, y al Hijo, y al Espíritu Santo.
Como era en el principio, ahora y siempre,
por los siglos de los siglos. Amén. Aleluya.

CÁNTICO DE MARÍA (Lucas 1:46-55)

Proclama mi alma la grandeza del Señor,
se alegra mi espíritu en Dios, mi salvador;
porque ha mirado la humillación de su esclava.
Desde ahora me felicitarán todas las generaciones:
        `
      },
      "completas": {
        title: "Completas (Oración de la Noche)",
        content: `
El Señor todopoderoso nos conceda una noche tranquila y una muerte santa.
Amén.

Hermanos, es hora de examinar nuestra conciencia
en preparación para esta oración nocturna.

Yo confieso ante Dios todopoderoso
y ante vosotros, hermanos,
que he pecado mucho
de pensamiento, palabra, obra y omisión...
        `
      }
    }
  },
  "rosario": {
    id: "rosario",
    title: "El Santo Rosario",
    description: "Una oración católica tradicional centrada en la vida de Jesús y María",
    mysteries: {
      "gozosos": {
        title: "Misterios Gozosos",
        days: "Lunes y Sábado",
        mysteries: [
          "La Anunciación",
          "La Visitación",
          "El Nacimiento de Jesús",
          "La Presentación en el Templo",
          "El Niño Jesús perdido y hallado en el Templo"
        ]
      },
      "dolorosos": {
        title: "Misterios Dolorosos",
        days: "Martes y Viernes",
        mysteries: [
          "La Oración en el Huerto",
          "La Flagelación",
          "La Coronación de Espinas",
          "Jesús con la Cruz a cuestas",
          "La Crucifixión y Muerte de Jesús"
        ]
      },
      "gloriosos": {
        title: "Misterios Gloriosos",
        days: "Miércoles y Domingo",
        mysteries: [
          "La Resurrección",
          "La Ascensión",
          "La Venida del Espíritu Santo",
          "La Asunción de María",
          "La Coronación de María"
        ]
      },
      "luminosos": {
        title: "Misterios Luminosos",
        days: "Jueves",
        mysteries: [
          "El Bautismo de Jesús",
          "Las Bodas de Caná",
          "La Proclamación del Reino",
          "La Transfiguración",
          "La Institución de la Eucaristía"
        ]
      }
    },
    prayers: {
      "señal_de_la_cruz": "Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor, Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
      "credo": "Creo en Dios, Padre todopoderoso, creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor...",
      "padrenuestro": "Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo...",
      "avemaria": "Dios te salve, María, llena eres de gracia, el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús...",
      "gloria": "Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén."
    }
  },
  "oraciones_diarias": {
    id: "oraciones_diarias",
    title: "Oraciones Diarias",
    description: "Oraciones esenciales para la devoción diaria",
    prayers: [
      {
        title: "Ofrenda de la Mañana",
        content: `
Oh Jesús, por el Corazón Inmaculado de María,
te ofrezco mis oraciones, trabajos, alegrías y sufrimientos
de este día por todas las intenciones de tu Sagrado Corazón,
en unión con el Santo Sacrificio de la Misa
en todo el mundo,
en reparación por mis pecados,
por las intenciones de todos mis asociados,
y en particular por las intenciones de nuestro Santo Padre este mes. Amén.
        `
      },
      {
        title: "Oración al Ángel de la Guarda",
        content: `
Ángel de mi guarda,
dulce compañía,
no me desampares
ni de noche ni de día.
No me dejes solo
que me perdería. Amén.
        `
      },
      {
        title: "Oración antes de las Comidas",
        content: `
Bendícenos, Señor, y bendice estos alimentos
que por tu bondad vamos a tomar.
Por Cristo nuestro Señor. Amén.
        `
      },
      {
        title: "Oración después de las Comidas",
        content: `
Te damos gracias, Señor,
por todos los beneficios
que hemos recibido
de tu bondad,
por Cristo nuestro Señor. Amén.
        `
      }
    ]
  }
};

export const mockUser = {
  id: "user_001",
  email: "peregrino@email.com",
  name: "María Santos",
  groupId: "group_001",
  role: "peregrino"
};

export const mockAdmin = {
  id: "admin_001",
  email: "admin@peregrinacion.com",
  name: "Padre Miguel",
  role: "admin"
};