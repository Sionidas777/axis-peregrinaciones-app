import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Heart,
  Plane,
  BookOpen,
  Search
} from 'lucide-react';
import { mockPilgrimageGroups, mockItineraries, mockDestinations } from '../mock-es';
import EditGroupModal from './EditGroupModal';
import EditItineraryModal from './EditItineraryModal';
import EditDestinationModal from './EditDestinationModal';
import Footer from './Footer';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [pilgrims, setPilgrims] = useState(mockPilgrimageGroups);
  const [itineraries, setItineraries] = useState(mockItineraries);
  const [destinations, setDestinations] = useState(mockDestinations);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [editGroupModal, setEditGroupModal] = useState({ isOpen: false, group: null });
  const [editItineraryModal, setEditItineraryModal] = useState({ isOpen: false, itinerary: null });
  const [editDestinationModal, setEditDestinationModal] = useState({ isOpen: false, destination: null });

  // Group operations
  const handleCreateGroup = () => {
    setEditGroupModal({ isOpen: true, group: null });
  };

  const handleEditGroup = (group) => {
    setEditGroupModal({ isOpen: true, group: group });
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (editGroupModal.group) {
        // Update existing group
        setPilgrims(prev => ({
          ...prev,
          [editGroupModal.group.id]: {
            ...editGroupModal.group,
            ...groupData,
            id: editGroupModal.group.id
          }
        }));
        console.log('Grupo actualizado:', groupData);
      } else {
        // Create new group
        const newGroupId = `group_${Date.now()}`;
        const newGroup = {
          ...groupData,
          id: newGroupId,
          startDate: groupData.start_date,
          endDate: groupData.end_date
        };
        setPilgrims(prev => ({
          ...prev,
          [newGroupId]: newGroup
        }));
        console.log('Nuevo grupo creado:', newGroup);
      }
      setEditGroupModal({ isOpen: false, group: null });
    } catch (error) {
      console.error('Error guardando grupo:', error);
      throw error;
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      setPilgrims(prev => {
        const newState = { ...prev };
        delete newState[groupId];
        return newState;
      });
      // Also remove associated itinerary
      setItineraries(prev => {
        const newState = { ...prev };
        delete newState[groupId];
        return newState;
      });
    }
  };

  // Itinerary operations
  const handleEditItinerary = (groupId) => {
    const itinerary = itineraries[groupId];
    setEditItineraryModal({ isOpen: true, itinerary: itinerary });
  };

  const handleCreateItinerary = () => {
    setEditItineraryModal({ isOpen: true, itinerary: null });
  };

  const handleSaveItinerary = async (itineraryData) => {
    try {
      if (editItineraryModal.itinerary) {
        // Update existing itinerary
        const groupId = editItineraryModal.itinerary.id;
        setItineraries(prev => ({
          ...prev,
          [groupId]: {
            ...editItineraryModal.itinerary,
            ...itineraryData,
            groupName: itineraryData.group_name,
            dailySchedule: itineraryData.daily_schedule,
            included: itineraryData.included,
            notIncluded: itineraryData.not_included
          }
        }));
        console.log('Itinerario actualizado:', itineraryData);
      } else {
        // Create new itinerary - would need group selection in real app
        const newItineraryId = `itinerary_${Date.now()}`;
        setItineraries(prev => ({
          ...prev,
          [newItineraryId]: {
            ...itineraryData,
            id: newItineraryId,
            groupName: itineraryData.group_name,
            dailySchedule: itineraryData.daily_schedule,
            included: itineraryData.included,
            notIncluded: itineraryData.not_included
          }
        }));
        console.log('Nuevo itinerario creado:', itineraryData);
      }
      setEditItineraryModal({ isOpen: false, itinerary: null });
    } catch (error) {
      console.error('Error guardando itinerario:', error);
      throw error;
    }
  };

  // Destination operations
  const handleCreateDestination = () => {
    setEditDestinationModal({ isOpen: true, destination: null });
  };

  const handleEditDestination = (destination) => {
    setEditDestinationModal({ isOpen: true, destination: destination });
  };

  const handleSaveDestination = async (destinationData) => {
    try {
      if (editDestinationModal.destination) {
        // Update existing destination
        const destinationId = editDestinationModal.destination.id;
        setDestinations(prev => ({
          ...prev,
          [destinationId]: {
            ...editDestinationModal.destination,
            ...destinationData,
            spiritualSignificance: destinationData.spiritual_significance,
            imageUrl: destinationData.image_url
          }
        }));
        console.log('Destino actualizado:', destinationData);
      } else {
        // Create new destination
        const newDestinationId = `destination_${Date.now()}`;
        setDestinations(prev => ({
          ...prev,
          [newDestinationId]: {
            ...destinationData,
            id: newDestinationId,
            spiritualSignificance: destinationData.spiritual_significance,
            imageUrl: destinationData.image_url
          }
        }));
        console.log('Nuevo destino creado:', destinationData);
      }
      setEditDestinationModal({ isOpen: false, destination: null });
    } catch (error) {
      console.error('Error guardando destino:', error);
      throw error;
    }
  };

  const handleDeleteDestination = (destinationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este destino?')) {
      setDestinations(prev => {
        const newState = { ...prev };
        delete newState[destinationId];
        return newState;
      });
    }
  };

  // Filter functions
  const filteredGroups = Object.values(pilgrims).filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDestinations = Object.values(destinations).filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Axis Peregrinaciones - Administración</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Grupos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(pilgrims).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Peregrinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(pilgrims).reduce((total, group) => total + (group.pilgrims?.length || 0), 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Itinerarios Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(itineraries).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Destinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(destinations).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar grupos, destinos..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur-sm">
            <TabsTrigger value="resumen" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Grupos
            </TabsTrigger>
            <TabsTrigger value="itinerarios" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Itinerarios
            </TabsTrigger>
            <TabsTrigger value="destinos" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destinos
            </TabsTrigger>
            <TabsTrigger value="peregrinos" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Peregrinos
            </TabsTrigger>
          </TabsList>

          {/* Groups Tab */}
          <TabsContent value="resumen" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Grupos de Peregrinación</h2>
                <Button 
                  onClick={handleCreateGroup}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Grupo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGroups.map((group) => (
                  <Card key={group.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{group.name}</span>
                        <Badge variant={group.status === 'próximo' ? 'default' : 'secondary'}>
                          {group.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {group.destination}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {group.startDate} - {group.endDate}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {group.pilgrims?.length || 0} peregrinos
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredGroups.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron grupos que coincidan con la búsqueda.' : 'No hay grupos creados aún.'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Itineraries Tab */}
          <TabsContent value="itinerarios" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Gestionar Itinerarios</h2>
                <Button 
                  onClick={handleCreateItinerary}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Itinerario
                </Button>
              </div>
              
              {Object.values(itineraries).map((itinerary) => (
                <Card key={itinerary.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{itinerary.groupName}</span>
                      <Button 
                        size="sm"
                        onClick={() => handleEditItinerary(itinerary.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Itinerario
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          Detalles de Vuelo
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Ida: {itinerary.flights?.departure?.from} → {itinerary.flights?.departure?.to}</p>
                          <p>Regreso: {itinerary.flights?.return?.from} → {itinerary.flights?.return?.to}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Programa
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.dailySchedule?.length || 0} días planificados</p>
                          <p>{itinerary.dailySchedule?.[0]?.date} - {itinerary.dailySchedule?.[itinerary.dailySchedule?.length - 1]?.date}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Inclusiones
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.included?.length || 0} elementos incluidos</p>
                          <p>{itinerary.notIncluded?.length || 0} elementos excluidos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {Object.keys(itineraries).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay itinerarios creados aún.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinos" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Gestionar Destinos</h2>
                <Button 
                  onClick={handleCreateDestination}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Destino
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((destination) => (
                  <Card key={destination.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                    <div className="relative">
                      <div 
                        className="h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-t-lg"
                        style={{
                          backgroundImage: `url(${destination.imageUrl || destination.image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800">
                            {destination.country}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{destination.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {destination.description?.substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditDestination(destination)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDeleteDestination(destination.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredDestinations.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron destinos que coincidan con la búsqueda.' : 'No hay destinos creados aún.'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Pilgrims Tab */}
          <TabsContent value="peregrinos" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Peregrinos</h2>
              
              {Object.values(pilgrims).map((group) => (
                <Card key={group.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {group.destination} • {group.pilgrims?.length || 0} peregrinos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.pilgrims?.map((pilgrim) => (
                        <Card key={pilgrim.id} className="border">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{pilgrim.name}</h4>
                              <p className="text-sm text-gray-600">{pilgrim.email}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Editar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )) || (
                        <div className="col-span-3 text-center py-4 text-gray-500">
                          No hay peregrinos en este grupo
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Modals */}
      <EditGroupModal
        group={editGroupModal.group}
        isOpen={editGroupModal.isOpen}
        onSave={handleSaveGroup}
        onClose={() => setEditGroupModal({ isOpen: false, group: null })}
      />

      <EditItineraryModal
        itinerary={editItineraryModal.itinerary}
        isOpen={editItineraryModal.isOpen}
        onSave={handleSaveItinerary}
        onClose={() => setEditItineraryModal({ isOpen: false, itinerary: null })}
      />

      <EditDestinationModal
        destination={editDestinationModal.destination}
        isOpen={editDestinationModal.isOpen}
        onSave={handleSaveDestination}
        onClose={() => setEditDestinationModal({ isOpen: false, destination: null })}
      />
    </div>
  );
};

export default AdminDashboard;