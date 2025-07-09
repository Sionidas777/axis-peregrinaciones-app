import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Calendar, MapPin, Clock, Plane, Users, Book, Heart, Loader2 } from 'lucide-react';
import { groupsAPI, itinerariesAPI, destinationsAPI, spiritualAPI, handleAPIError } from '../services/api';
import ItineraryView from './ItineraryView-integrated';
import DestinationFacts from './DestinationFacts-integrated';
import SpiritualSection from './SpiritualSection-integrated';
import Footer from './Footer';

const PilgrimDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('itinerario');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Data states
  const [group, setGroup] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [spiritualContent, setSpiritualContent] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load user's group
      if (user?.group_id) {
        const groupData = await groupsAPI.getById(user.group_id);
        setGroup(groupData);

        // Load group's itinerary
        try {
          const itineraryData = await itinerariesAPI.getByGroupId(user.group_id);
          setItinerary(itineraryData);
        } catch (error) {
          // It's okay if there's no itinerary yet
          console.log('No itinerary found for group:', user.group_id);
        }
      }

      // Load destinations (public data)
      const destinationsData = await destinationsAPI.getAll();
      setDestinations(destinationsData);

      // Load spiritual content (public data)
      const spiritualData = await spiritualAPI.getAll();
      setSpiritualContent(spiritualData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando tu peregrinación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={loadDashboardData} className="w-full mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-800">Axis Peregrinaciones</h1>
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
        {group && (
          <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                {group.name}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {group.destination} • {group.start_date} - {group.end_date}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {itinerary?.daily_schedule?.length || 0} días
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {group.pilgrims?.length || 0} peregrinos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-sm">
                    {group.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            {itinerary ? (
              <ItineraryView itinerary={itinerary} />
            ) : (
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No hay itinerario disponible</h3>
                  <p className="text-gray-600">
                    El itinerario para tu grupo se publicará próximamente.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="destinos" className="mt-6">
            <DestinationFacts destinations={destinations} />
          </TabsContent>

          <TabsContent value="espiritual" className="mt-6">
            <SpiritualSection spiritualContent={spiritualContent} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PilgrimDashboard;