import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, MapPin, Clock, Plane, Users, Book, Heart, Star, Quote } from 'lucide-react';
import { mockItineraries, mockDestinations, mockPrayers } from '../mock-es';
import ItineraryView from './ItineraryView-es';
import DestinationFacts from './DestinationFacts-es';
import SpiritualSection from './SpiritualSection-es';

const PilgrimDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('itinerario');
  const itinerary = mockItineraries[user.groupId];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Camino Sagrado</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Pilgrimage Info Card */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {itinerary.groupName}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {itinerary.dailySchedule[0].date} - {itinerary.dailySchedule[itinerary.dailySchedule.length - 1].date}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {itinerary.dailySchedule.length} días
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {itinerary.flights.departure.from} ✈ {itinerary.flights.departure.to}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  Peregrinación grupal
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm">
            <TabsTrigger value="itinerario" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Itinerario
            </TabsTrigger>
            <TabsTrigger value="destinos" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destinos
            </TabsTrigger>
            <TabsTrigger value="espiritual" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Espiritual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerario" className="mt-6">
            <ItineraryView itinerary={itinerary} />
          </TabsContent>

          <TabsContent value="destinos" className="mt-6">
            <DestinationFacts destinations={mockDestinations} />
          </TabsContent>

          <TabsContent value="espiritual" className="mt-6">
            <SpiritualSection prayers={mockPrayers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PilgrimDashboard;