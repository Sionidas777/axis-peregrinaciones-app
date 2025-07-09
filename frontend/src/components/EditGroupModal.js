import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { X } from 'lucide-react';

const EditGroupModal = ({ group, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    start_date: '',
    end_date: '',
    status: 'upcoming'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        destination: group.destination || '',
        start_date: group.start_date || '',
        end_date: group.end_date || '',
        status: group.status || 'upcoming'
      });
    } else {
      setFormData({
        name: '',
        destination: '',
        start_date: '',
        end_date: '',
        status: 'upcoming'
      });
    }
    setError('');
  }, [group, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving group:', error);
      setError('Error al guardar el grupo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      destination: '',
      start_date: '',
      end_date: '',
      status: 'upcoming'
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {group ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {group ? 'Modifica los detalles del grupo de peregrinación.' : 'Crea un nuevo grupo de peregrinación.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Grupo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="ej. Peregrinación Tierra Santa 2025"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="ej. Jerusalén & Belén"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Próximo</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (group ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupModal;

  const addPilgrim = () => {
    if (newPilgrim.name && newPilgrim.email) {
      setPilgrims(prev => [...prev, {
        id: `p_${Date.now()}`,
        name: newPilgrim.name,
        email: newPilgrim.email
      }]);
      setNewPilgrim({ name: '', email: '' });
    }
  };

  const removePilgrim = (pilgrimId) => {
    setPilgrims(prev => prev.filter(p => p.id !== pilgrimId));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const groupData = {
        ...formData,
        pilgrims: pilgrims
      };
      
      if (onSave) {
        await onSave(groupData);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      alert('Error al guardar el grupo. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'próximo', label: 'Próximo' },
    { value: 'activo', label: 'Activo' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {triggerButton && (
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            {group ? 'Editar Grupo de Peregrinación' : 'Crear Nuevo Grupo'}
          </DialogTitle>
          <DialogDescription>
            {group ? 'Modifica los detalles del grupo de peregrinación' : 'Crea un nuevo grupo de peregrinación'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Grupo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Peregrinación a Tierra Santa 2025"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="Ej: Jerusalén y Belén"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha de Inicio</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha de Fin</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pilgrims Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestión de Peregrinos ({pilgrims.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new pilgrim */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Nombre completo"
                  value={newPilgrim.name}
                  onChange={(e) => setNewPilgrim(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Correo electrónico"
                  value={newPilgrim.email}
                  onChange={(e) => setNewPilgrim(prev => ({ ...prev, email: e.target.value }))}
                />
                <Button onClick={addPilgrim} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar
                </Button>
              </div>

              {/* Pilgrims list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {pilgrims.map((pilgrim) => (
                  <div key={pilgrim.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div>
                      <div className="font-medium">{pilgrim.name}</div>
                      <div className="text-sm text-gray-600">{pilgrim.email}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePilgrim(pilgrim.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {pilgrims.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay peregrinos agregados aún
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : (group ? 'Guardar Cambios' : 'Crear Grupo')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGroupModal;