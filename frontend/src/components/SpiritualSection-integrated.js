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

const SpiritualSection = ({ spiritualContent }) => {
  const [expandedPrayer, setExpandedPrayer] = useState(null);

  const togglePrayer = (prayerId) => {
    setExpandedPrayer(expandedPrayer === prayerId ? null : prayerId);
  };

  // Organize spiritual content by category
  const organizeSpiritualContent = () => {
    const organized = {
      liturgy_of_hours: null,
      rosary: null,
      daily_prayers: null
    };

    if (spiritualContent) {
      spiritualContent.forEach(item => {
        if (item.category === 'liturgy_of_hours') {
          organized.liturgy_of_hours = item;
        } else if (item.category === 'rosary') {
          organized.rosary = item;
        } else if (item.category === 'daily_prayers') {
          organized.daily_prayers = item;
        }
      });
    }

    return organized;
  };

  const organizedContent = organizeSpiritualContent();

  if (!spiritualContent || spiritualContent.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Book className="w-8 h-8 text-purple-600" />
            Compañero Espiritual
          </h2>
          <p className="text-gray-600">Nutre tu alma con oraciones y devociones católicas tradicionales</p>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8 text-center">
            <Book className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Contenido Espiritual No Disponible
            </h3>
            <p className="text-gray-600">
              El contenido espiritual aún no está disponible. Por favor, contacta a tu organizador.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {organizedContent.liturgy_of_hours ? (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  {organizedContent.liturgy_of_hours.title}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {organizedContent.liturgy_of_hours.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {organizedContent.liturgy_of_hours.content.prayers && 
                  Object.entries(organizedContent.liturgy_of_hours.content.prayers).map(([key, prayer]) => (
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
                  ))
                }
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Liturgia de las Horas No Disponible
                </h3>
                <p className="text-gray-600">
                  El contenido de la Liturgia de las Horas aún no está disponible.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Santo Rosario */}
        <TabsContent value="rosario" className="space-y-4">
          {organizedContent.rosary ? (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  {organizedContent.rosary.title}
                </CardTitle>
                <CardDescription className="text-pink-100">
                  {organizedContent.rosary.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Rosary content would go here */}
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Contenido del rosario en desarrollo...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Santo Rosario No Disponible
                </h3>
                <p className="text-gray-600">
                  El contenido del Santo Rosario aún no está disponible.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Oraciones Diarias */}
        <TabsContent value="diarias" className="space-y-4">
          {organizedContent.daily_prayers ? (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  {organizedContent.daily_prayers.title}
                </CardTitle>
                <CardDescription className="text-green-100">
                  {organizedContent.daily_prayers.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {organizedContent.daily_prayers.content.prayers &&
                  organizedContent.daily_prayers.content.prayers.map((prayer, index) => (
                    <Card key={index} className="border shadow-md">
                      <Collapsible open={expandedPrayer === `daily_${index}`}>
                        <CollapsibleTrigger asChild>
                          <CardHeader 
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => togglePrayer(`daily_${index}`)}
                          >
                            <CardTitle className="flex items-center justify-between text-lg">
                              <span>{prayer.title}</span>
                              {expandedPrayer === `daily_${index}` ? 
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
                  ))
                }
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Oraciones Diarias No Disponibles
                </h3>
                <p className="text-gray-600">
                  Las oraciones diarias aún no están disponibles.
                </p>
              </CardContent>
            </Card>
          )}
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