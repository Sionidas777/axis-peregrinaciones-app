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
import { mockPilgrimageGroups, mockItineraries } from '../mock';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pilgrims, setPilgrims] = useState(mockPilgrimageGroups);
  const [itineraries, setItineraries] = useState(mockItineraries);

  const handleCreateGroup = () => {
    // Mock functionality - in real app would open modal/form
    alert('Create Group functionality - will be implemented with backend');
  };

  const handleEditItinerary = (groupId) => {
    // Mock functionality - in real app would open detailed editor
    alert(`Edit Itinerary for ${groupId} - will be implemented with backend`);
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
                <h1 className="text-2xl font-bold text-gray-800">Sacred Journey Admin</h1>
                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Sign Out
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(pilgrims).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pilgrims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(pilgrims).reduce((total, group) => total + group.pilgrims.length, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Itineraries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(itineraries).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(pilgrims).filter(group => group.status === 'upcoming').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Groups Overview
            </TabsTrigger>
            <TabsTrigger value="itineraries" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Manage Itineraries
            </TabsTrigger>
            <TabsTrigger value="pilgrims" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Pilgrims
            </TabsTrigger>
          </TabsList>

          {/* Groups Overview */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Pilgrimage Groups</h2>
                <Button 
                  onClick={handleCreateGroup}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Group
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(pilgrims).map((group) => (
                  <Card key={group.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{group.name}</span>
                        <Badge variant={group.status === 'upcoming' ? 'default' : 'secondary'}>
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
                          {group.pilgrims.length} pilgrims
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditItinerary(group.id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Manage Itineraries */}
          <TabsContent value="itineraries" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Manage Itineraries</h2>
              
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
                        Edit Itinerary
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Plane className="w-4 h-4" />
                          Flight Details
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Departure: {itinerary.flights.departure.from} → {itinerary.flights.departure.to}</p>
                          <p>Return: {itinerary.flights.return.from} → {itinerary.flights.return.to}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Schedule
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.dailySchedule.length} days planned</p>
                          <p>{itinerary.dailySchedule[0].date} - {itinerary.dailySchedule[itinerary.dailySchedule.length - 1].date}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Inclusions
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{itinerary.included.length} items included</p>
                          <p>{itinerary.notIncluded.length} items excluded</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pilgrims */}
          <TabsContent value="pilgrims" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Pilgrims Management</h2>
              
              {Object.values(pilgrims).map((group) => (
                <Card key={group.id} className="bg-white/95 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {group.destination} • {group.pilgrims.length} pilgrims
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
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600">
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Remove
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