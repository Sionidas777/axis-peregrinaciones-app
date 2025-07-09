import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { X, Plus, Minus } from 'lucide-react';

const EditItineraryModal = ({ itinerary, groups, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    group_id: '',
    group_name: '',
    included: [''],
    not_included: [''],
    daily_schedule: [{
      day: 1,
      date: '',
      title: '',
      activities: [''],
      biblical_quote: '',
      accommodation: ''
    }]
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itinerary) {
      setFormData({
        group_id: itinerary.group_id || '',
        group_name: itinerary.group_name || '',
        included: itinerary.included || [''],
        not_included: itinerary.not_included || [''],
        daily_schedule: itinerary.daily_schedule || [{
          day: 1,
          date: '',
          title: '',
          activities: [''],
          biblical_quote: '',
          accommodation: ''
        }]
      });
    } else {
      setFormData({
        group_id: '',
        group_name: '',
        included: [''],
        not_included: [''],
        daily_schedule: [{
          day: 1,
          date: '',
          title: '',
          activities: [''],
          biblical_quote: '',
          accommodation: ''
        }]
      });
    }
    setError('');
  }, [itinerary, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIncludedChange = (index, value) => {
    const newIncluded = [...formData.included];
    newIncluded[index] = value;
    setFormData(prev => ({
      ...prev,
      included: newIncluded
    }));
  };

  const addIncluded = () => {
    setFormData(prev => ({
      ...prev,
      included: [...prev.included, '']
    }));
  };

  const removeIncluded = (index) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index)
    }));
  };

  const handleNotIncludedChange = (index, value) => {
    const newNotIncluded = [...formData.not_included];
    newNotIncluded[index] = value;
    setFormData(prev => ({
      ...prev,
      not_included: newNotIncluded
    }));
  };

  const addNotIncluded = () => {
    setFormData(prev => ({
      ...prev,
      not_included: [...prev.not_included, '']
    }));
  };

  const removeNotIncluded = (index) => {
    setFormData(prev => ({
      ...prev,
      not_included: prev.not_included.filter((_, i) => i !== index)
    }));
  };

  const handleDayChange = (dayIndex, field, value) => {
    const newSchedule = [...formData.daily_schedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      daily_schedule: newSchedule
    }));
  };

  const handleActivityChange = (dayIndex, activityIndex, value) => {
    const newSchedule = [...formData.daily_schedule];
    const newActivities = [...newSchedule[dayIndex].activities];
    newActivities[activityIndex] = value;
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      activities: newActivities
    };
    setFormData(prev => ({
      ...prev,
      daily_schedule: newSchedule
    }));
  };

  const addActivity = (dayIndex) => {
    const newSchedule = [...formData.daily_schedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      activities: [...newSchedule[dayIndex].activities, '']
    };
    setFormData(prev => ({
      ...prev,
      daily_schedule: newSchedule
    }));
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const newSchedule = [...formData.daily_schedule];
    newSchedule[dayIndex] = {
      ...newSchedule[dayIndex],
      activities: newSchedule[dayIndex].activities.filter((_, i) => i !== activityIndex)
    };
    setFormData(prev => ({
      ...prev,
      daily_schedule: newSchedule
    }));
  };

  const addDay = () => {
    const nextDay = formData.daily_schedule.length + 1;
    setFormData(prev => ({
      ...prev,
      daily_schedule: [...prev.daily_schedule, {
        day: nextDay,
        date: '',
        title: '',
        activities: [''],
        biblical_quote: '',
        accommodation: ''
      }]
    }));
  };

  const removeDay = (dayIndex) => {
    if (formData.daily_schedule.length > 1) {
      setFormData(prev => ({
        ...prev,
        daily_schedule: prev.daily_schedule.filter((_, i) => i !== dayIndex)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Clean data before sending
      const cleanedData = {
        ...formData,
        included: formData.included.filter(item => item.trim() !== ''),
        not_included: formData.not_included.filter(item => item.trim() !== ''),
        daily_schedule: formData.daily_schedule.map(day => ({
          ...day,
          activities: day.activities.filter(activity => activity.trim() !== '')
        }))
      };
      
      await onSave(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      setError('Error al guardar el itinerario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      group_id: '',
      group_name: '',
      included: [''],
      not_included: [''],
      daily_schedule: [{
        day: 1,
        date: '',
        title: '',
        activities: [''],
        biblical_quote: '',
        accommodation: ''
      }]
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {itinerary ? 'Editar Itinerario' : 'Crear Nuevo Itinerario'}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {itinerary ? 'Modifica los detalles del itinerario.' : 'Crea un nuevo itinerario de peregrinación.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="group_id">Grupo</Label>
              <Select value={formData.group_id} onValueChange={(value) => {
                handleInputChange('group_id', value);
                const selectedGroup = groups?.find(g => g.id === value);
                handleInputChange('group_name', selectedGroup?.name || '');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group_name">Nombre del Grupo</Label>
              <Input
                id="group_name"
                value={formData.group_name}
                onChange={(e) => handleInputChange('group_name', e.target.value)}
                placeholder="Nombre del grupo"
                required
              />
            </div>
          </div>

          {/* Included Items */}
          <div className="space-y-2">
            <Label>Incluye</Label>
            {formData.included.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleIncludedChange(index, e.target.value)}
                  placeholder="¿Qué está incluido?"
                />
                {formData.included.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIncluded(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addIncluded}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Inclusión
            </Button>
          </div>

          {/* Not Included Items */}
          <div className="space-y-2">
            <Label>No Incluye</Label>
            {formData.not_included.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleNotIncludedChange(index, e.target.value)}
                  placeholder="¿Qué no está incluido?"
                />
                {formData.not_included.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeNotIncluded(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addNotIncluded}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Exclusión
            </Button>
          </div>

          {/* Daily Schedule */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Cronograma Diario</Label>
              <Button
                type="button"
                variant="outline"
                onClick={addDay}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Día
              </Button>
            </div>
            
            {formData.daily_schedule.map((day, dayIndex) => (
              <div key={dayIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Día {day.day}</h4>
                  {formData.daily_schedule.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDay(dayIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input
                      value={day.date}
                      onChange={(e) => handleDayChange(dayIndex, 'date', e.target.value)}
                      placeholder="ej. 15 de marzo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={day.title}
                      onChange={(e) => handleDayChange(dayIndex, 'title', e.target.value)}
                      placeholder="ej. Llegada a Tierra Santa"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Actividades</Label>
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex gap-2">
                      <Input
                        value={activity}
                        onChange={(e) => handleActivityChange(dayIndex, activityIndex, e.target.value)}
                        placeholder="Actividad del día"
                      />
                      {day.activities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeActivity(dayIndex, activityIndex)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addActivity(dayIndex)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Actividad
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Cita Bíblica</Label>
                  <Textarea
                    value={day.biblical_quote}
                    onChange={(e) => handleDayChange(dayIndex, 'biblical_quote', e.target.value)}
                    placeholder="Cita bíblica para reflexionar"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Alojamiento</Label>
                  <Input
                    value={day.accommodation}
                    onChange={(e) => handleDayChange(dayIndex, 'accommodation', e.target.value)}
                    placeholder="Hotel o lugar de alojamiento"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (itinerary ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItineraryModal;

const EditItineraryModal = ({ itinerary, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    group_name: itinerary?.groupName || '',
    flights: itinerary?.flights || {
      departure: { from: '', to: '', date: '', time: '', airline: '', flight_number: '' },
      return: { from: '', to: '', date: '', time: '', airline: '', flight_number: '' }
    },
    included: itinerary?.included || [],
    not_included: itinerary?.notIncluded || [],
    daily_schedule: itinerary?.dailySchedule || []
  });

  const [newIncluded, setNewIncluded] = useState('');
  const [newNotIncluded, setNewNotIncluded] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFlightChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      flights: {
        ...prev.flights,
        [type]: {
          ...prev.flights[type],
          [field]: value
        }
      }
    }));
  };

  const addIncludedItem = () => {
    if (newIncluded.trim()) {
      setFormData(prev => ({
        ...prev,
        included: [...prev.included, newIncluded.trim()]
      }));
      setNewIncluded('');
    }
  };

  const removeIncludedItem = (index) => {
    setFormData(prev => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== index)
    }));
  };

  const addNotIncludedItem = () => {
    if (newNotIncluded.trim()) {
      setFormData(prev => ({
        ...prev,
        not_included: [...prev.not_included, newNotIncluded.trim()]
      }));
      setNewNotIncluded('');
    }
  };

  const removeNotIncludedItem = (index) => {
    setFormData(prev => ({
      ...prev,
      not_included: prev.not_included.filter((_, i) => i !== index)
    }));
  };

  const addDay = () => {
    const newDay = {
      day: formData.daily_schedule.length + 1,
      date: '',
      title: '',
      activities: [],
      biblical_quote: '',
      accommodation: ''
    };
    setFormData(prev => ({
      ...prev,
      daily_schedule: [...prev.daily_schedule, newDay]
    }));
  };

  const removeDay = (index) => {
    setFormData(prev => ({
      ...prev,
      daily_schedule: prev.daily_schedule.filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const updateDay = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      daily_schedule: prev.daily_schedule.map((day, i) => 
        i === index ? { ...day, [field]: value } : day
      )
    }));
  };

  const addActivity = (dayIndex) => {
    setFormData(prev => ({
      ...prev,
      daily_schedule: prev.daily_schedule.map((day, i) => 
        i === dayIndex ? { ...day, activities: [...day.activities, ''] } : day
      )
    }));
  };

  const updateActivity = (dayIndex, activityIndex, value) => {
    setFormData(prev => ({
      ...prev,
      daily_schedule: prev.daily_schedule.map((day, i) => 
        i === dayIndex ? {
          ...day,
          activities: day.activities.map((activity, j) => 
            j === activityIndex ? value : activity
          )
        } : day
      )
    }));
  };

  const removeActivity = (dayIndex, activityIndex) => {
    setFormData(prev => ({
      ...prev,
      daily_schedule: prev.daily_schedule.map((day, i) => 
        i === dayIndex ? {
          ...day,
          activities: day.activities.filter((_, j) => j !== activityIndex)
        } : day
      )
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(formData);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar itinerario:', error);
      alert('Error al guardar el itinerario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {itinerary ? 'Editar Itinerario' : 'Crear Nuevo Itinerario'}
          </DialogTitle>
          <DialogDescription>
            {itinerary ? 'Modifica los detalles del itinerario' : 'Crea un nuevo itinerario para el grupo'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="flights">Vuelos</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusiones</TabsTrigger>
            <TabsTrigger value="schedule">Programa</TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto">
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="group_name">Nombre del Grupo</Label>
                    <Input
                      id="group_name"
                      value={formData.group_name}
                      onChange={(e) => handleInputChange('group_name', e.target.value)}
                      placeholder="Nombre del grupo de peregrinación"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Departure Flight */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="w-5 h-5" />
                      Vuelo de Ida
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Desde</Label>
                        <Input
                          value={formData.flights.departure.from}
                          onChange={(e) => handleFlightChange('departure', 'from', e.target.value)}
                          placeholder="Ciudad origen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hasta</Label>
                        <Input
                          value={formData.flights.departure.to}
                          onChange={(e) => handleFlightChange('departure', 'to', e.target.value)}
                          placeholder="Ciudad destino"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Input
                          type="date"
                          value={formData.flights.departure.date}
                          onChange={(e) => handleFlightChange('departure', 'date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input
                          value={formData.flights.departure.time}
                          onChange={(e) => handleFlightChange('departure', 'time', e.target.value)}
                          placeholder="HH:MM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Aerolínea</Label>
                        <Input
                          value={formData.flights.departure.airline}
                          onChange={(e) => handleFlightChange('departure', 'airline', e.target.value)}
                          placeholder="Nombre aerolínea"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Número de Vuelo</Label>
                        <Input
                          value={formData.flights.departure.flight_number}
                          onChange={(e) => handleFlightChange('departure', 'flight_number', e.target.value)}
                          placeholder="Ej: IB1234"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Return Flight */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plane className="w-5 h-5 transform rotate-180" />
                      Vuelo de Regreso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Desde</Label>
                        <Input
                          value={formData.flights.return.from}
                          onChange={(e) => handleFlightChange('return', 'from', e.target.value)}
                          placeholder="Ciudad origen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hasta</Label>
                        <Input
                          value={formData.flights.return.to}
                          onChange={(e) => handleFlightChange('return', 'to', e.target.value)}
                          placeholder="Ciudad destino"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha</Label>
                        <Input
                          type="date"
                          value={formData.flights.return.date}
                          onChange={(e) => handleFlightChange('return', 'date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hora</Label>
                        <Input
                          value={formData.flights.return.time}
                          onChange={(e) => handleFlightChange('return', 'time', e.target.value)}
                          placeholder="HH:MM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Aerolínea</Label>
                        <Input
                          value={formData.flights.return.airline}
                          onChange={(e) => handleFlightChange('return', 'airline', e.target.value)}
                          placeholder="Nombre aerolínea"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Número de Vuelo</Label>
                        <Input
                          value={formData.flights.return.flight_number}
                          onChange={(e) => handleFlightChange('return', 'flight_number', e.target.value)}
                          placeholder="Ej: IB1234"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inclusions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Included */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">Qué Incluye</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newIncluded}
                        onChange={(e) => setNewIncluded(e.target.value)}
                        placeholder="Agregar elemento incluido"
                        onKeyPress={(e) => e.key === 'Enter' && addIncludedItem()}
                      />
                      <Button onClick={addIncludedItem}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.included.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">{item}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIncludedItem(index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Not Included */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-700">Qué No Incluye</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newNotIncluded}
                        onChange={(e) => setNewNotIncluded(e.target.value)}
                        placeholder="Agregar elemento no incluido"
                        onKeyPress={(e) => e.key === 'Enter' && addNotIncludedItem()}
                      />
                      <Button onClick={addNotIncludedItem}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.not_included.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <span className="text-sm">{item}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotIncludedItem(index)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Programa Diario</h3>
                <Button onClick={addDay} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Día
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {formData.daily_schedule.map((day, dayIndex) => (
                  <Card key={dayIndex}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">Día {day.day}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDay(dayIndex)}
                          className="text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Fecha</Label>
                          <Input
                            type="date"
                            value={day.date}
                            onChange={(e) => updateDay(dayIndex, 'date', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Título</Label>
                          <Input
                            value={day.title}
                            onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                            placeholder="Título del día"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Actividades</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addActivity(dayIndex)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="flex gap-2">
                            <Input
                              value={activity}
                              onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                              placeholder="Descripción de la actividad"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeActivity(dayIndex, activityIndex)}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Cita Bíblica</Label>
                        <Textarea
                          value={day.biblical_quote}
                          onChange={(e) => updateDay(dayIndex, 'biblical_quote', e.target.value)}
                          placeholder="Cita bíblica para el día"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Alojamiento</Label>
                        <Input
                          value={day.accommodation}
                          onChange={(e) => updateDay(dayIndex, 'accommodation', e.target.value)}
                          placeholder="Hotel o lugar de alojamiento"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {formData.daily_schedule.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay días programados. Haz clic en "Agregar Día" para comenzar.
                  </div>
                )}
              </div>
            </TabsContent>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : (itinerary ? 'Guardar Cambios' : 'Crear Itinerario')}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditItineraryModal;