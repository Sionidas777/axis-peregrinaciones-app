import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Star, Book, Heart } from 'lucide-react';

const DestinationFacts = ({ destinations }) => {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            Destinos Sagrados
          </h2>
          <p className="text-gray-600">Descubre la rica historia y significado espiritual de nuestros sitios de peregrinación</p>
        </div>
        
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Sin Destinos Disponibles
            </h3>
            <p className="text-gray-600">
              Los destinos aún no están disponibles. Por favor, contacta a tu organizador.
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
          <MapPin className="w-8 h-8 text-blue-600" />
          Destinos Sagrados
        </h2>
        <p className="text-gray-600">Descubre la rica historia y significado espiritual de nuestros sitios de peregrinación</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <Card key={destination.id} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">
              <div 
                className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-t-lg"
                style={{
                  backgroundImage: `url(${destination.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {destination.country}
                  </Badge>
                </div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">{destination.name}</CardTitle>
              <CardDescription className="text-gray-600">
                {destination.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Spiritual Significance */}
              {destination.spiritual_significance && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Significado Espiritual
                  </h4>
                  <p className="text-sm text-gray-600">
                    {destination.spiritual_significance}
                  </p>
                </div>
              )}

              {/* Interesting Facts */}
              {destination.facts && destination.facts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Datos Interesantes
                  </h4>
                  <ul className="space-y-1">
                    {destination.facts.map((fact, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinationFacts;