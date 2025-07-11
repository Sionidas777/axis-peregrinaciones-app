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
    // Convert markdown-style formatting to JSX
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

  // Organize content by category
  const organizedContent = {
    devotion: spiritualContent?.filter(item => item.category === 'devotion') || [],
    daily: spiritualContent?.filter(item => item.category === 'daily') || [],
    pilgrimage: spiritualContent?.filter(item => item.category === 'pilgrimage') || []
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
};

export default SpiritualSection;