import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Book, 
  Heart, 
  Sun, 
  Moon, 
  Star, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';

const SpiritualSection = ({ prayers }) => {
  const [expandedPrayer, setExpandedPrayer] = useState(null);
  const [activeRosaryMystery, setActiveRosaryMystery] = useState('gozosos');

  const togglePrayer = (prayerId) => {
    setExpandedPrayer(expandedPrayer === prayerId ? null : prayerId);
  };

  const getCurrentDayMystery = () => {
    const today = new Date().getDay();
    const mysteryMap = {
      0: 'gloriosos', // Domingo
      1: 'gozosos',   // Lunes
      2: 'dolorosos', // Martes
      3: 'gloriosos',  // Miércoles
      4: 'luminosos',  // Jueves
      5: 'dolorosos', // Viernes
      6: 'gozosos'     // Sábado
    };
    return mysteryMap[today] || 'gozosos';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Book className="w-8 h-8 text-purple-600" />
          Compañero Espiritual
        </h2>
        <p className="text-gray-600">Nutre tu alma con oraciones y devociones católicas tradicionales</p>
      </div>

      <Tabs defaultValue="liturgia" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm">
          <TabsTrigger value="liturgia" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Liturgia de las Horas
          </TabsTrigger>
          <TabsTrigger value="rosario" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Santo Rosario
          </TabsTrigger>
          <TabsTrigger value="diarias" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Oraciones Diarias
          </TabsTrigger>
        </TabsList>

        {/* Liturgia de las Horas */}
        <TabsContent value="liturgia" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Liturgia de las Horas
              </CardTitle>
              <CardDescription className="text-purple-100">
                La oración oficial de la Iglesia Católica
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {Object.entries(prayers.liturgia_de_las_horas.prayers).map(([key, prayer]) => (
                <Card key={key} className="border shadow-md">
                  <Collapsible open={expandedPrayer === key}>
                    <CollapsibleTrigger asChild>
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => togglePrayer(key)}
                      >
                        <CardTitle className="flex items-center justify-between text-lg">
                          <div className="flex items-center gap-2">
                            {key === 'laudes' && <Sun className="w-5 h-5 text-yellow-600" />}
                            {key === 'visperas' && <Moon className="w-5 h-5 text-blue-600" />}
                            {key === 'completas' && <Star className="w-5 h-5 text-purple-600" />}
                            {prayer.title}
                          </div>
                          {expandedPrayer === key ? 
                            <ChevronUp className="w-5 h-5" /> : 
                            <ChevronDown className="w-5 h-5" />
                          }
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif">
                            {prayer.content}
                          </pre>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Santo Rosario */}
        <TabsContent value="rosario" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                El Santo Rosario
              </CardTitle>
              <CardDescription className="text-pink-100">
                Una oración católica tradicional centrada en la vida de Jesús y María
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Mystery Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Misterios del Rosario</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(prayers.rosario.mysteries).map(([key, mystery]) => (
                    <Button
                      key={key}
                      variant={activeRosaryMystery === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveRosaryMystery(key)}
                      className="text-xs"
                    >
                      {mystery.title}
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Misterio de Hoy: {prayers.rosario.mysteries[getCurrentDayMystery()].title}
                  </Badge>
                </div>
              </div>

              {/* Selected Mystery */}
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {prayers.rosario.mysteries[activeRosaryMystery].title}
                  </CardTitle>
                  <CardDescription>
                    Se reza los: {prayers.rosario.mysteries[activeRosaryMystery].days}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {prayers.rosario.mysteries[activeRosaryMystery].mysteries.map((mystery, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{mystery}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Rosary Prayers */}
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Oraciones del Rosario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(prayers.rosario.prayers).map(([key, prayer]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-700 capitalize mb-2">
                        {key === 'señal_de_la_cruz' && 'Señal de la Cruz'}
                        {key === 'credo' && 'Credo'}
                        {key === 'padrenuestro' && 'Padre Nuestro'}
                        {key === 'avemaria' && 'Ave María'}
                        {key === 'gloria' && 'Gloria'}
                      </h4>
                      <p className="text-sm text-gray-600 font-serif">
                        {prayer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Oraciones Diarias */}
        <TabsContent value="diarias" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Oraciones Diarias
              </CardTitle>
              <CardDescription className="text-green-100">
                Oraciones esenciales para la devoción diaria
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {prayers.oraciones_diarias.prayers.map((prayer, index) => (
                <Card key={index} className="border shadow-md">
                  <Collapsible open={expandedPrayer === `diarias_${index}`}>
                    <CollapsibleTrigger asChild>
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => togglePrayer(`diarias_${index}`)}
                      >
                        <CardTitle className="flex items-center justify-between text-lg">
                          <span>{prayer.title}</span>
                          {expandedPrayer === `diarias_${index}` ? 
                            <ChevronUp className="w-5 h-5" /> : 
                            <ChevronDown className="w-5 h-5" />
                          }
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif">
                            {prayer.content}
                          </pre>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prayer Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1612799403932-29fdf8686a56" 
            alt="Oración del rosario" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Oración del Rosario</p>
          </div>
        </div>
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1594856707526-4611f168c116" 
            alt="Libro de oraciones" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Libro de Oraciones</p>
          </div>
        </div>
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1562701903-c2095e99251f" 
            alt="Crucifijo" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Crucifijo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualSection;