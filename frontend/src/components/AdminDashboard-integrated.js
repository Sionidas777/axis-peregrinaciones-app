import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
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
  Search,
  Loader2
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { groupsAPI, itinerariesAPI, destinationsAPI, spiritualAPI, authAPI, usersAPI, handleAPIError } from '../services/api';
import EditGroupModal from './EditGroupModal';
import EditItineraryModal from './EditItineraryModal';
import EditDestinationModal from './EditDestinationModal';
import EditPilgrimModal from './EditPilgrimModal';
import Footer from './Footer';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [groups, setGroups] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [spiritualContent, setSpiritualContent] = useState([]);
  const [pilgrims, setPilgrims] = useState([]);

  // Modal states
  const [editGroupModal, setEditGroupModal] = useState({ isOpen: false, group: null });
  const [editItineraryModal, setEditItineraryModal] = useState({ isOpen: false, itinerary: null });
  const [editDestinationModal, setEditDestinationModal] = useState({ isOpen: false, destination: null });
  const [editPilgrimModal, setEditPilgrimModal] = useState({ isOpen: false, pilgrim: null });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load all data
      const [groupsData, itinerariesData, destinationsData, spiritualData, pilgrimsData] = await Promise.all([
        groupsAPI.getAll(),
        itinerariesAPI.getAll(),
        destinationsAPI.getAll(),
        spiritualAPI.getAll(),
        usersAPI.getAll()
      ]);

      setGroups(groupsData);
      setItineraries(itinerariesData);
      setDestinations(destinationsData);
      setSpiritualContent(spiritualData);
      setPilgrims(pilgrimsData.filter(user => user.role === 'pilgrim'));

    } catch (error) {
      console.error('Error loading admin data:', error);
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

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
        const updatedGroup = await groupsAPI.update(editGroupModal.group.id, groupData);
        setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
      } else {
        // Create new group
        const newGroup = await groupsAPI.create(groupData);
        setGroups([...groups, newGroup]);
      }
      setEditGroupModal({ isOpen: false, group: null });
    } catch (error) {
      console.error('Error saving group:', error);
      setError(handleAPIError(error));
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      try {
        await groupsAPI.delete(groupId);
        setGroups(groups.filter(g => g.id !== groupId));
      } catch (error) {
        console.error('Error deleting group:', error);
        setError(handleAPIError(error));
      }
    }
  };

  // Itinerary operations
  const handleCreateItinerary = () => {
    setEditItineraryModal({ isOpen: true, itinerary: null });
  };

  const handleEditItinerary = (itinerary) => {
    setEditItineraryModal({ isOpen: true, itinerary: itinerary });
  };

  const handleSaveItinerary = async (itineraryData) => {
    try {
      if (editItineraryModal.itinerary) {
        // Update existing itinerary
        const updatedItinerary = await itinerariesAPI.update(editItineraryModal.itinerary.id, itineraryData);
        setItineraries(itineraries.map(i => i.id === updatedItinerary.id ? updatedItinerary : i));
      } else {
        // Create new itinerary
        const newItinerary = await itinerariesAPI.create(itineraryData);
        setItineraries([...itineraries, newItinerary]);
      }
      setEditItineraryModal({ isOpen: false, itinerary: null });
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setError(handleAPIError(error));
    }
  };

  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este itinerario?')) {
      try {
        await itinerariesAPI.delete(itineraryId);
        setItineraries(itineraries.filter(i => i.id !== itineraryId));
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        setError(handleAPIError(error));
      }
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
        const updatedDestination = await destinationsAPI.update(editDestinationModal.destination.id, destinationData);
        setDestinations(destinations.map(d => d.id === updatedDestination.id ? updatedDestination : d));
      } else {
        // Create new destination
        const newDestination = await destinationsAPI.create(destinationData);
        setDestinations([...destinations, newDestination]);
      }
      setEditDestinationModal({ isOpen: false, destination: null });
    } catch (error) {
      console.error('Error saving destination:', error);
      setError(handleAPIError(error));
    }
  };

  const handleDeleteDestination = async (destinationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este destino?')) {
      try {
        await destinationsAPI.delete(destinationId);
        setDestinations(destinations.filter(d => d.id !== destinationId));
      } catch (error) {
        console.error('Error deleting destination:', error);
        setError(handleAPIError(error));
      }
    }
  };

  // Pilgrim operations
  const handleCreatePilgrim = () => {
    setEditPilgrimModal({ isOpen: true, pilgrim: null });
  };

  const handleEditPilgrim = (pilgrim) => {
    setEditPilgrimModal({ isOpen: true, pilgrim: pilgrim });
  };

  const handleSavePilgrim = async (pilgrimData) => {
    try {
      if (editPilgrimModal.pilgrim) {
        // Update existing pilgrim - this would need a specific update endpoint
        // For now, we'll refresh the data
        await loadAdminData();
      } else {
        // Create new pilgrim using the register endpoint
        await authAPI.register(pilgrimData);
        // Refresh pilgrims data
        const pilgrimsData = await usersAPI.getAll();
        setPilgrims(pilgrimsData.filter(user => user.role === 'pilgrim'));
      }
      setEditPilgrimModal({ isOpen: false, pilgrim: null });
    } catch (error) {
      console.error('Error saving pilgrim:', error);
      setError(handleAPIError(error));
    }
  };

  const handleDeletePilgrim = async (pilgrimId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este peregrino?')) {
      try {
        // This would need a delete user endpoint
        // For now, we'll show an alert
        alert('Funcionalidad de eliminación de peregrinos pendiente de implementar');
      } catch (error) {
        console.error('Error deleting pilgrim:', error);
        setError(handleAPIError(error));
      }
    }
  };

  // Filter functions
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPilgrims = pilgrims.filter(pilgrim =>
    pilgrim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pilgrim.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
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
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Axis Peregrinaciones</h1>
                <p className="text-sm text-gray-600">Panel de Administración - {user.name}</p>
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

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Grupos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
              <p className="text-xs text-gray-500">Total de grupos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Itinerarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{itineraries.length}</div>
              <p className="text-xs text-gray-500">Programados</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Destinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{destinations.length}</div>
              <p className="text-xs text-gray-500">Disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Contenido Espiritual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{spiritualContent.length}</div>
              <p className="text-xs text-gray-500">Recursos</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur-sm">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="grupos">Grupos</TabsTrigger>
            <TabsTrigger value="itinerarios">Itinerarios</TabsTrigger>
            <TabsTrigger value="destinos">Destinos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <CardTitle>Resumen del Sistema</CardTitle>
                <CardDescription>
                  Vista general de la actividad del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Grupos Recientes</h4>
                      {groups.slice(0, 3).map(group => (
                        <div key={group.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{group.name}</span>
                          <Badge variant="outline">{group.status}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Destinos Populares</h4>
                      {destinations.slice(0, 3).map(destination => (
                        <div key={destination.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{destination.name}</span>
                          <span className="text-xs text-gray-500">{destination.country}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grupos" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Grupos</CardTitle>
                  <Button onClick={handleCreateGroup} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Grupo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar grupos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredGroups.map(group => (
                    <div key={group.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-gray-600">{group.destination}</p>
                        <p className="text-xs text-gray-500">{group.start_date} - {group.end_date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{group.status}</Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditGroup(group)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="itinerarios" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Itinerarios</CardTitle>
                  <Button onClick={handleCreateItinerary} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Itinerario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {itineraries.map(itinerary => (
                    <div key={itinerary.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{itinerary.group_name}</h4>
                        <p className="text-sm text-gray-600">{itinerary.daily_schedule?.length || 0} días</p>
                        <p className="text-xs text-gray-500">Grupo: {itinerary.group_id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditItinerary(itinerary)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinos" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gestión de Destinos</CardTitle>
                  <Button onClick={handleCreateDestination} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Destino
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar destinos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredDestinations.map(destination => (
                    <div key={destination.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{destination.name}</h4>
                        <p className="text-sm text-gray-600">{destination.country}</p>
                        <p className="text-xs text-gray-500">{destination.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditDestination(destination)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDestination(destination.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* Modals */}
      <EditGroupModal 
        isOpen={editGroupModal.isOpen}
        group={editGroupModal.group}
        onClose={() => setEditGroupModal({ isOpen: false, group: null })}
        onSave={handleSaveGroup}
      />
      
      <EditItineraryModal 
        isOpen={editItineraryModal.isOpen}
        itinerary={editItineraryModal.itinerary}
        groups={groups}
        onClose={() => setEditItineraryModal({ isOpen: false, itinerary: null })}
        onSave={handleSaveItinerary}
      />
      
      <EditDestinationModal 
        isOpen={editDestinationModal.isOpen}
        destination={editDestinationModal.destination}
        onClose={() => setEditDestinationModal({ isOpen: false, destination: null })}
        onSave={handleSaveDestination}
      />
    </div>
  );
};

export default AdminDashboard;