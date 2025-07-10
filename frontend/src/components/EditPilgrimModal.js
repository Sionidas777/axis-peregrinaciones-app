import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Eye, EyeOff } from 'lucide-react';
import { handleAPIError } from '../services/api';

const EditPilgrimModal = ({ pilgrim, onSave, onClose, isOpen, groups }) => {
  const [formData, setFormData] = useState({
    name: pilgrim?.name || '',
    email: pilgrim?.email || '',
    password: '',
    group_id: pilgrim?.group_id || ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reinitialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: pilgrim?.name || '',
        email: pilgrim?.email || '',
        password: '',
        group_id: pilgrim?.group_id || ''
      });
      setError('');
      setShowPassword(false);
    }
  }, [pilgrim, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      setIsLoading(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setError('El email es requerido');
      setIsLoading(false);
      return;
    }
    
    if (!formData.group_id) {
      setError('Debe asignar un grupo al peregrino');
      setIsLoading(false);
      return;
    }
    
    if (!pilgrim && !formData.password.trim()) {
      setError('La contraseña es requerida para nuevos peregrinos');
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'pilgrim'
      };
      
      // Only include password for new users or if password is provided
      if (!pilgrim || formData.password.trim()) {
        submitData.password = formData.password;
      }
      
      // Include group_id if selected
      if (formData.group_id) {
        submitData.group_id = formData.group_id;
      }
      
      if (onSave) {
        await onSave(submitData);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar peregrino:', error);
      const errorMessage = handleAPIError(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {pilgrim ? 'Editar Peregrino' : 'Registrar Nuevo Peregrino'}
          </DialogTitle>
          <DialogDescription>
            {pilgrim ? 'Modifica los datos del peregrino' : 'Registra un nuevo peregrino en el sistema'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información del Peregrino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre completo del peregrino"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {pilgrim ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={pilgrim ? 'Dejar vacío para mantener actual' : 'Contraseña'}
                  required={!pilgrim}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_id">Grupo (opcional)</Label>
              <select
                id="group_id"
                value={formData.group_id}
                onChange={(e) => handleInputChange('group_id', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sin asignar</option>
                {groups?.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Guardando...' : (pilgrim ? 'Actualizar' : 'Registrar Peregrino')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPilgrimModal;