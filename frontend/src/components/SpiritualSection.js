import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Book, 
  Heart, 
  Sun, 
  Moon, 
  Star, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';

const SpiritualSection = ({ prayers }) => {
  const [expandedPrayer, setExpandedPrayer] = useState(null);
  const [activeRosaryMystery, setActiveRosaryMystery] = useState('joyful');

  const togglePrayer = (prayerId) => {
    setExpandedPrayer(expandedPrayer === prayerId ? null : prayerId);
  };

  const getCurrentDayMystery = () => {
    const today = new Date().getDay();
    const mysteryMap = {
      0: 'glorious', // Sunday
      1: 'joyful',   // Monday
      2: 'sorrowful', // Tuesday
      3: 'glorious',  // Wednesday
      4: 'luminous',  // Thursday
      5: 'sorrowful', // Friday
      6: 'joyful'     // Saturday
    };
    return mysteryMap[today] || 'joyful';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Book className="w-8 h-8 text-purple-600" />
          Spiritual Companion
        </h2>
        <p className="text-gray-600">Nourish your soul with traditional Catholic prayers and devotions</p>
      </div>

      <Tabs defaultValue="liturgy" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-sm">
          <TabsTrigger value="liturgy" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Liturgy of Hours
          </TabsTrigger>
          <TabsTrigger value="rosary" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Holy Rosary
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Daily Prayers
          </TabsTrigger>
        </TabsList>

        {/* Liturgy of Hours */}
        <TabsContent value="liturgy" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Liturgy of the Hours
              </CardTitle>
              <CardDescription className="text-purple-100">
                The official prayer of the Catholic Church
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {Object.entries(prayers.liturgy_of_hours.prayers).map(([key, prayer]) => (
                <Card key={key} className="border shadow-md">
                  <CollapsibleTrigger asChild>
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => togglePrayer(key)}
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                          {key === 'lauds' && <Sun className="w-5 h-5 text-yellow-600" />}
                          {key === 'vespers' && <Moon className="w-5 h-5 text-blue-600" />}
                          {key === 'compline' && <Star className="w-5 h-5 text-purple-600" />}
                          {prayer.title}
                        </div>
                        {expandedPrayer === key ? 
                          <ChevronUp className="w-5 h-5" /> : 
                          <ChevronDown className="w-5 h-5" />
                        }
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <Collapsible open={expandedPrayer === key}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif">
                            {prayer.content}
                          </pre>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holy Rosary */}
        <TabsContent value="rosary" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                The Holy Rosary
              </CardTitle>
              <CardDescription className="text-pink-100">
                A traditional Catholic prayer focused on the life of Jesus and Mary
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Mystery Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Mysteries of the Rosary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(prayers.rosary.mysteries).map(([key, mystery]) => (
                    <Button
                      key={key}
                      variant={activeRosaryMystery === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveRosaryMystery(key)}
                      className="text-xs"
                    >
                      {mystery.title}
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Today's Mystery: {prayers.rosary.mysteries[getCurrentDayMystery()].title}
                  </Badge>
                </div>
              </div>

              {/* Selected Mystery */}
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {prayers.rosary.mysteries[activeRosaryMystery].title}
                  </CardTitle>
                  <CardDescription>
                    Prayed on: {prayers.rosary.mysteries[activeRosaryMystery].days}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {prayers.rosary.mysteries[activeRosaryMystery].mysteries.map((mystery, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{mystery}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Rosary Prayers */}
              <Card className="border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Rosary Prayers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(prayers.rosary.prayers).map(([key, prayer]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-700 capitalize mb-2">
                        {key.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-600 font-serif">
                        {prayer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Prayers */}
        <TabsContent value="daily" className="space-y-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Daily Prayers
              </CardTitle>
              <CardDescription className="text-green-100">
                Essential prayers for daily devotion
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {prayers.daily_prayers.prayers.map((prayer, index) => (
                <Card key={index} className="border shadow-md">
                  <CollapsibleTrigger asChild>
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => togglePrayer(`daily_${index}`)}
                    >
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span>{prayer.title}</span>
                        {expandedPrayer === `daily_${index}` ? 
                          <ChevronUp className="w-5 h-5" /> : 
                          <ChevronDown className="w-5 h-5" />
                        }
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <Collapsible open={expandedPrayer === `daily_${index}`}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-serif">
                            {prayer.content}
                          </pre>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prayer Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1612799403932-29fdf8686a56" 
            alt="Rosary prayer" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Rosary Prayer</p>
          </div>
        </div>
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1594856707526-4611f168c116" 
            alt="Prayer book" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Prayer Book</p>
          </div>
        </div>
        <div className="relative h-32 rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1562701903-c2095e99251f" 
            alt="Crucifix" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-semibold">Crucifix</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualSection;