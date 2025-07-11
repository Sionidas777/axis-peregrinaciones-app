import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Book, 
  Sun, 
  Moon, 
  Star, 
  ChevronDown,
  Sparkles,
  Cross,
  MapPin
} from 'lucide-react';

const SpiritualSection = ({ spiritualContent }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const formatContent = (contentText) => {
    if (!contentText) return null;
    
    return contentText
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return <h3 key={index} className="text-lg font-semibold text-blue-800 mt-4 mb-2">{line.replace('## ', '')}</h3>;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold text-gray-800 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
        } else if (line.startsWith('*') && line.endsWith('*')) {
          return <p key={index} className="italic text-gray-600 text-center my-2">{line.replace(/\*/g, '')}</p>;
        } else if (line.trim().match(/^\d+\./)) {
          return <p key={index} className="ml-4 my-1 text-gray-700">{line}</p>;
        } else if (line.startsWith('V.') || line.startsWith('R.')) {
          return <p key={index} className="my-1 text-gray-800">{line}</p>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="my-1 text-gray-700 leading-relaxed">{line}</p>;
        }
      });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'devotion':
        return <Star className="w-5 h-5 text-blue-600" />;
      case 'daily':
        return <Sun className="w-5 h-5 text-yellow-600" />;
      case 'pilgrimage':
        return <MapPin className="w-5 h-5 text-green-600" />;
      default:
        return <Cross className="w-5 h-5 text-purple-600" />;
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'devotion':
        return 'Oraciones Devocionales';
      case 'daily':
        return 'Oraciones Diarias';
      case 'pilgrimage':
        return 'Oraciones del Peregrino';
      default:
        return 'Otras Oraciones';
    }
  };

  // Organize content by category
  const organizedContent = {
    devotion: spiritualContent?.filter(item => item.category === 'devotion') || [],
    daily: spiritualContent?.filter(item => item.category === 'daily') || [],
    pilgrimage: spiritualContent?.filter(item => item.category === 'pilgrimage') || []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sección Espiritual</h1>
          <p className="text-gray-600">Oraciones y recursos para tu peregrinación</p>
        </div>

        <Tabs defaultValue="devotion" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="devotion" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Devocionales
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              Diarias
            </TabsTrigger>
            <TabsTrigger value="pilgrimage" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Peregrino
            </TabsTrigger>
          </TabsList>

          {Object.entries(organizedContent).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </CardTitle>
                  <CardDescription>
                    {items.length > 0 
                      ? `${items.length} oración${items.length > 1 ? 'es' : ''} disponible${items.length > 1 ? 's' : ''}`
                      : 'No hay oraciones disponibles en esta categoría'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <Collapsible key={item.id || index}>
                        <CollapsibleTrigger 
                          className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => toggleSection(`${category}-${index}`)}
                        >
                          <div className="flex items-center gap-3">
                            <Cross className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-gray-800">{item.title}</span>
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-500 transition-transform ${
                              openSections[`${category}-${index}`] ? 'rotate-180' : ''
                            }`} 
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-white border border-gray-200 rounded-b-lg">
                          <div className="prose prose-sm max-w-none">
                            {formatContent(item.content)}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                    
                    {items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Cross className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay contenido espiritual disponible en esta categoría.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default SpiritualSection;