import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { X, Plus, Minus } from 'lucide-react';

const EditDestinationModal = ({ destination, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    facts: [''],
    spiritual_significance: '',
    image_url: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name || '',
        country: destination.country || '',
        description: destination.description || '',
        facts: destination.facts || [''],
        spiritual_significance: destination.spiritual_significance || '',
        image_url: destination.image_url || ''
      });
    } else {
      setFormData({
        name: '',
        country: '',
        description: '',
        facts: [''],
        spiritual_significance: '',
        image_url: ''
      });
    }
    setError('');
  }, [destination, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFactChange = (index, value) => {
    const newFacts = [...formData.facts];
    newFacts[index] = value;
    setFormData(prev => ({
      ...prev,
      facts: newFacts
    }));
  };

  const addFact = () => {
    setFormData(prev => ({
      ...prev,
      facts: [...prev.facts, '']
    }));
  };

  const removeFact = (index) => {
    setFormData(prev => ({
      ...prev,
      facts: prev.facts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Filter out empty facts
      const cleanedData = {
        ...formData,
        facts: formData.facts.filter(fact => fact.trim() !== '')
      };
      
      await onSave(cleanedData);
      onClose();
    } catch (error) {
      console.error('Error saving destination:', error);
      setError('Error al guardar el destino. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      country: '',
      description: '',
      facts: [''],
      spiritual_significance: '',
      image_url: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {destination ? 'Editar Destino' : 'Crear Nuevo Destino'}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {destination ? 'Modifica los detalles del destino.' : 'Crea un nuevo destino de peregrinación.'}
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Destino</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ej. Jerusalén"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="ej. Israel"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el destino..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="spiritual_significance">Significado Espiritual</Label>
            <Textarea
              id="spiritual_significance"
              value={formData.spiritual_significance}
              onChange={(e) => handleInputChange('spiritual_significance', e.target.value)}
              placeholder="Explica la importancia espiritual del lugar..."
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image_url">URL de Imagen</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Datos Curiosos</Label>
            {formData.facts.map((fact, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={fact}
                  onChange={(e) => handleFactChange(index, e.target.value)}
                  placeholder={`Dato curioso ${index + 1}...`}
                />
                {formData.facts.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFact(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addFact}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Dato Curioso
            </Button>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (destination ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestinationModal;