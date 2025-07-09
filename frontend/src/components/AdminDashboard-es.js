import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  BookOpen
} from 'lucide-react';
import { mockPilgrimageGroups, mockItineraries } from '../mock-es';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [pilgrims, setPilgrims] = useState(mockPilgrimageGroups);
  const [itineraries, setItineraries] = useState(mockItineraries);

  const handleCreateGroup = () => {
    // Funcionalidad simulada - en la app real abriría un modal/formulario
    alert('Funcionalidad Crear Grupo - se implementará con backend');
  };

  const handleEditItinerary = (groupId) => {
    // Funcionalidad simulada - en la app real abriría un editor detallado
    alert(`Editar Itinerario para ${groupId} - se implementará con backend`);
  };

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
                <h1 className="text-2xl font-bold text-gray-800">Administrador Camino Sagrado</h1>
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
                {Object.values(pilgrims).reduce((total, group) => total + group.pilgrims.length, 0)}
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
              <CardTitle className="text-sm font-medium text-gray-600">Próximos Viajes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(pilgrims).filter(group => group.status === 'próximo').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm">
            <TabsTrigger value="resumen" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Resumen de Grupos
            </TabsTrigger>
            <TabsTrigger value="itinerarios" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Gestionar Itinerarios
            </TabsTrigger>
            <TabsTrigger value="peregrinos" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Peregrinos
            </TabsTrigger>
          </TabsList>

          {/* Groups Overview */}
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
                {Object.values(pilgrims).map((group) => (
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
                          {group.pilgrims.length} peregrinos
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditItinerary(group.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Manage Itineraries */}
          <TabsContent value="itinerarios" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestionar Itinerarios</h2>
              
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
                          <p>Ida: {itinerary.flights.departure.from} → {itinerary.flights.departure.to}</p>
                          <p>Regreso: {itinerary.flights.return.from} → {itinerary.flights.return.to}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Programa
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.dailySchedule.length} días planificados</p>
                          <p>{itinerary.dailySchedule[0].date} - {itinerary.dailySchedule[itinerary.dailySchedule.length - 1].date}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Inclusiones
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.included.length} elementos incluidos</p>
                          <p>{itinerary.notIncluded.length} elementos excluidos</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pilgrims */}
          <TabsContent value="peregrinos" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Peregrinos</h2>
              
              {Object.values(pilgrims).map((group) => (
                <Card key={group.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {group.destination} • {group.pilgrims.length} peregrinos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.pilgrims.map((pilgrim) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;