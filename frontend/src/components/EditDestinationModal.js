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
    name: destination?.name || '',
    country: destination?.country || '',
    description: destination?.description || '',
    facts: destination?.facts || [],
    spiritual_significance: destination?.spiritualSignificance || destination?.spiritual_significance || '',
    image_url: destination?.imageUrl || destination?.image_url || ''
  });

  const [newFact, setNewFact] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFact = () => {
    if (newFact.trim()) {
      setFormData(prev => ({
        ...prev,
        facts: [...prev.facts, newFact.trim()]
      }));
      setNewFact('');
    }
  };

  const removeFact = (index) => {
    setFormData(prev => ({
      ...prev,
      facts: prev.facts.filter((_, i) => i !== index)
    }));
  };

  const updateFact = (index, value) => {
    setFormData(prev => ({
      ...prev,
      facts: prev.facts.map((fact, i) => i === index ? value : fact)
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
      console.error('Error al guardar destino:', error);
      alert('Error al guardar el destino. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {destination ? 'Editar Destino' : 'Crear Nuevo Destino'}
          </DialogTitle>
          <DialogDescription>
            {destination ? 'Modifica la información del destino' : 'Agrega un nuevo destino sagrado'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Destino</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Jerusalén"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Ej: Israel"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción breve del destino"
                  rows={3}
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
                {formData.image_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.image_url} 
                      alt="Vista previa" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Spiritual Significance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Significado Espiritual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="spiritual_significance">Importancia Espiritual</Label>
                <Textarea
                  id="spiritual_significance"
                  value={formData.spiritual_significance}
                  onChange={(e) => handleInputChange('spiritual_significance', e.target.value)}
                  placeholder="Explica la importancia espiritual y religiosa de este destino"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Interesting Facts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Datos Interesantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new fact */}
              <div className="flex gap-2">
                <Input
                  value={newFact}
                  onChange={(e) => setNewFact(e.target.value)}
                  placeholder="Agregar nuevo dato interesante"
                  onKeyPress={(e) => e.key === 'Enter' && addFact()}
                />
                <Button onClick={addFact} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar
                </Button>
              </div>

              {/* Facts list */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {formData.facts.map((fact, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        value={fact}
                        onChange={(e) => updateFact(index, e.target.value)}
                        placeholder="Dato interesante"
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFact(index)}
                      className="text-red-600 hover:text-red-800 mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                {formData.facts.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                    No hay datos interesantes agregados.
                    <br />
                    Usa el campo de arriba para agregar algunos.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Guardando...' : (destination ? 'Guardar Cambios' : 'Crear Destino')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDestinationModal;