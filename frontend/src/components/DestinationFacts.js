import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Star, Book, Heart } from 'lucide-react';

const DestinationFacts = ({ destinations }) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8 text-blue-600" />
          Sacred Destinations
        </h2>
        <p className="text-gray-600">Discover the rich history and spiritual significance of our pilgrimage sites</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(destinations).map((destination) => (
          <Card key={destination.id} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
            <div className="relative">
              <div 
                className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-t-lg"
                style={{
                  backgroundImage: `url(${destination.imageUrl})`,
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
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Spiritual Significance
                </h4>
                <p className="text-sm text-gray-600">
                  {destination.spiritualSignificance}
                </p>
              </div>

              {/* Interesting Facts */}
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Interesting Facts
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinationFacts;