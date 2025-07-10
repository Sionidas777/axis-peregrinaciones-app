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
  Sparkles,
  Cross,
  MapPin
} from 'lucide-react';

const SpiritualSection = ({ spiritualContent }) => {
  const [expandedPrayer, setExpandedPrayer] = useState(null);

  const togglePrayer = (prayerId) => {
    setExpandedPrayer(expandedPrayer === prayerId ? null : prayerId);
  };

  // Organize spiritual content by category
  const organizeSpiritualContent = () => {
    const organized = {
      rosary: null,
      angelus: null,
      morning_prayer: null,
      evening_prayer: null,
      pilgrim_prayer: null
    };

    if (spiritualContent) {
      spiritualContent.forEach(item => {
        organized[item.category] = item;
      });
    }

    return organized;
  };

  const organizedContent = organizeSpiritualContent();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rosary':
        return <Star className="w-5 h-5 text-blue-600" />;
      case 'angelus':
        return <Sun className="w-5 h-5 text-yellow-600" />;
      case 'morning_prayer':
        return <Sun className="w-5 h-5 text-orange-600" />;
      case 'evening_prayer':
        return <Moon className="w-5 h-5 text-purple-600" />;
      case 'pilgrim_prayer':
        return <MapPin className="w-5 h-5 text-green-600" />;
      default:
        return <Book className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'rosary':
        return 'border-blue-200 bg-blue-50';
      case 'angelus':
        return 'border-yellow-200 bg-yellow-50';
      case 'morning_prayer':
        return 'border-orange-200 bg-orange-50';
      case 'evening_prayer':
        return 'border-purple-200 bg-purple-50';
      case 'pilgrim_prayer':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Cross className="w-6 h-6" />
            Vida Espiritual del Peregrino
          </CardTitle>
          <CardDescription className="text-purple-100">
            Oraciones y meditaciones para acompañarte en tu peregrinación
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            
            {/* Santo Rosario */}
            {organizedContent.rosary && (
              <Card className={`${getCategoryColor('rosary')} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    {getCategoryIcon('rosary')}
                    {organizedContent.rosary.title}
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    {organizedContent.rosary.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-blue-800">
                    {organizedContent.rosary.content.introduction}
                  </p>
                  
                  <Tabs defaultValue="joyful" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="joyful">Gozosos</TabsTrigger>
                      <TabsTrigger value="sorrowful">Dolorosos</TabsTrigger>
                      <TabsTrigger value="glorious">Gloriosos</TabsTrigger>
                      <TabsTrigger value="luminous">Luminosos</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="joyful" className="space-y-2 mt-4">
                      <h4 className="font-semibold text-blue-800">Misterios Gozosos (Lunes y Sábados)</h4>
                      <ul className="space-y-1">
                        {organizedContent.rosary.content.joyful_mysteries?.map((mystery, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                            <Star className="w-3 h-3 mt-1 text-blue-500" />
                            {mystery}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="sorrowful" className="space-y-2 mt-4">
                      <h4 className="font-semibold text-blue-800">Misterios Dolorosos (Martes y Viernes)</h4>
                      <ul className="space-y-1">
                        {organizedContent.rosary.content.sorrowful_mysteries?.map((mystery, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                            <Cross className="w-3 h-3 mt-1 text-blue-500" />
                            {mystery}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="glorious" className="space-y-2 mt-4">
                      <h4 className="font-semibold text-blue-800">Misterios Gloriosos (Miércoles y Domingos)</h4>
                      <ul className="space-y-1">
                        {organizedContent.rosary.content.glorious_mysteries?.map((mystery, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                            <Sparkles className="w-3 h-3 mt-1 text-blue-500" />
                            {mystery}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="luminous" className="space-y-2 mt-4">
                      <h4 className="font-semibold text-blue-800">Misterios Luminosos (Jueves)</h4>
                      <ul className="space-y-1">
                        {organizedContent.rosary.content.luminous_mysteries?.map((mystery, index) => (
                          <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                            <Sun className="w-3 h-3 mt-1 text-blue-500" />
                            {mystery}
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* El Ángelus */}
            {organizedContent.angelus && (
              <Card className={`${getCategoryColor('angelus')} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    {getCategoryIcon('angelus')}
                    {organizedContent.angelus.title}
                  </CardTitle>
                  <CardDescription className="text-yellow-700">
                    {organizedContent.angelus.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-yellow-800 space-y-2">
                    <p><strong>Cuándo rezar:</strong> {organizedContent.angelus.content.when_to_pray}</p>
                    <p>{organizedContent.angelus.content.introduction}</p>
                  </div>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-yellow-800 hover:text-yellow-900">
                      <Button variant="outline" size="sm" className="border-yellow-300">
                        Ver oración completa
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-3 text-sm text-yellow-800">
                      <div className="bg-yellow-100 p-3 rounded">
                        <div dangerouslySetInnerHTML={{ 
                          __html: organizedContent.angelus.content.prayer.verse1.replace(/\n/g, '<br/>') 
                        }} />
                        <div className="mt-2 italic">{organizedContent.angelus.content.prayer.ave_maria1}</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded">
                        <div dangerouslySetInnerHTML={{ 
                          __html: organizedContent.angelus.content.prayer.verse2.replace(/\n/g, '<br/>') 
                        }} />
                        <div className="mt-2 italic">{organizedContent.angelus.content.prayer.ave_maria2}</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded">
                        <div dangerouslySetInnerHTML={{ 
                          __html: organizedContent.angelus.content.prayer.verse3.replace(/\n/g, '<br/>') 
                        }} />
                        <div className="mt-2 italic">{organizedContent.angelus.content.prayer.ave_maria3}</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded">
                        <div dangerouslySetInnerHTML={{ 
                          __html: organizedContent.angelus.content.prayer.final_prayer.replace(/\n/g, '<br/>') 
                        }} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Oración de Inicio del Día */}
            {organizedContent.morning_prayer && (
              <Card className={`${getCategoryColor('morning_prayer')} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    {getCategoryIcon('morning_prayer')}
                    {organizedContent.morning_prayer.title}
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    {organizedContent.morning_prayer.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-orange-800">
                    {organizedContent.morning_prayer.content.introduction}
                  </p>
                  
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <div className="whitespace-pre-line text-sm text-orange-800">
                      {organizedContent.morning_prayer.content.prayer}
                    </div>
                  </div>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-orange-800 hover:text-orange-900">
                      <Button variant="outline" size="sm" className="border-orange-300">
                        Ver oraciones adicionales
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-3">
                      <div className="bg-orange-50 p-3 rounded">
                        <h5 className="font-semibold text-orange-800 mb-2">Ofrecimiento del día:</h5>
                        <p className="text-sm text-orange-700">
                          {organizedContent.morning_prayer.content.additional_prayers?.offering}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <h5 className="font-semibold text-orange-800 mb-2">Oración al Ángel de la Guarda:</h5>
                        <p className="text-sm text-orange-700">
                          {organizedContent.morning_prayer.content.additional_prayers?.protection}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Oración de Finalización del Día */}
            {organizedContent.evening_prayer && (
              <Card className={`${getCategoryColor('evening_prayer')} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    {getCategoryIcon('evening_prayer')}
                    {organizedContent.evening_prayer.title}
                  </CardTitle>
                  <CardDescription className="text-purple-700">
                    {organizedContent.evening_prayer.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-purple-800">
                    {organizedContent.evening_prayer.content.introduction}
                  </p>
                  
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">Examen de conciencia:</h5>
                    <div className="whitespace-pre-line text-sm text-purple-700">
                      {organizedContent.evening_prayer.content.examination}
                    </div>
                  </div>
                  
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <div className="whitespace-pre-line text-sm text-purple-800">
                      {organizedContent.evening_prayer.content.prayer}
                    </div>
                  </div>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-purple-800 hover:text-purple-900">
                      <Button variant="outline" size="sm" className="border-purple-300">
                        Ver oraciones finales
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-3">
                      <div className="bg-purple-50 p-3 rounded">
                        <h5 className="font-semibold text-purple-800 mb-2">Acto de contrición:</h5>
                        <p className="text-sm text-purple-700">
                          {organizedContent.evening_prayer.content.final_prayers?.act_of_contrition}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded">
                        <h5 className="font-semibold text-purple-800 mb-2">Consagración a María:</h5>
                        <p className="text-sm text-purple-700">
                          {organizedContent.evening_prayer.content.final_prayers?.consecration_to_mary}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            )}

            {/* Oración del Peregrino */}
            {organizedContent.pilgrim_prayer && (
              <Card className={`${getCategoryColor('pilgrim_prayer')} border-2`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    {getCategoryIcon('pilgrim_prayer')}
                    {organizedContent.pilgrim_prayer.title}
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    {organizedContent.pilgrim_prayer.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-green-800">
                    {organizedContent.pilgrim_prayer.content.introduction}
                  </p>
                  
                  <div className="bg-green-100 p-4 rounded-lg">
                    <div className="whitespace-pre-line text-sm text-green-800">
                      {organizedContent.pilgrim_prayer.content.main_prayer}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-semibold text-green-800 mb-2">Oración de viaje:</h5>
                      <p className="text-sm text-green-700">
                        {organizedContent.pilgrim_prayer.content.travel_prayer}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-semibold text-green-800 mb-2">Oración por la unidad del grupo:</h5>
                      <p className="text-sm text-green-700">
                        {organizedContent.pilgrim_prayer.content.unity_prayer}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-semibold text-green-800 mb-2">Oración en lugares santos:</h5>
                      <p className="text-sm text-green-700">
                        {organizedContent.pilgrim_prayer.content.holy_places_prayer}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h5 className="font-semibold text-green-800 mb-2">Oración de agradecimiento:</h5>
                      <p className="text-sm text-green-700">
                        {organizedContent.pilgrim_prayer.content.thanksgiving_prayer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiritualSection;
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