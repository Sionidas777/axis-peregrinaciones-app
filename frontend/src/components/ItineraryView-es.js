import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plane, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Quote,
  Hotel,
  Utensils
} from 'lucide-react';

const ItineraryView = ({ itinerary }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showFlights, setShowFlights] = useState(false);
  const [showInclusions, setShowInclusions] = useState(false);

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="space-y-6">
      {/* Flight Information */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
        <Collapsible open={showFlights}>
          <CollapsibleTrigger asChild>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowFlights(!showFlights)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  Información de Vuelos
                </div>
                {showFlights ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    Vuelo de Ida
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Desde:</span> {itinerary.flights.departure.from}</p>
                    <p><span className="font-medium">Hasta:</span> {itinerary.flights.departure.to}</p>
                    <p><span className="font-medium">Fecha:</span> {itinerary.flights.departure.date}</p>
                    <p><span className="font-medium">Hora:</span> {itinerary.flights.departure.time}</p>
                    <p><span className="font-medium">Aerolínea:</span> {itinerary.flights.departure.airline}</p>
                    <p><span className="font-medium">Vuelo:</span> {itinerary.flights.departure.flightNumber}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    <Plane className="w-4 h-4 transform rotate-180" />
                    Vuelo de Regreso
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Desde:</span> {itinerary.flights.return.from}</p>
                    <p><span className="font-medium">Hasta:</span> {itinerary.flights.return.to}</p>
                    <p><span className="font-medium">Fecha:</span> {itinerary.flights.return.date}</p>
                    <p><span className="font-medium">Hora:</span> {itinerary.flights.return.time}</p>
                    <p><span className="font-medium">Aerolínea:</span> {itinerary.flights.return.airline}</p>
                    <p><span className="font-medium">Vuelo:</span> {itinerary.flights.return.flightNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Inclusions & Exclusions */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
        <Collapsible open={showInclusions}>
          <CollapsibleTrigger asChild>
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setShowInclusions(!showInclusions)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-green-600" />
                  Qué Incluye y Qué No Incluye
                </div>
                {showInclusions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Incluido
                  </h4>
                  <ul className="space-y-2">
                    {itinerary.included.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-700 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    No Incluido
                  </h4>
                  <ul className="space-y-2">
                    {itinerary.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Daily Schedule */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Programa Diario
        </h3>
        
        {itinerary.dailySchedule.map((day) => (
          <Card key={day.day} className="bg-white/95 backdrop-blur-sm shadow-xl">
            <Collapsible open={expandedDay === day.day}>
              <CollapsibleTrigger asChild>
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleDay(day.day)}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Día {day.day}
                      </Badge>
                      <div>
                        <h4 className="text-lg font-semibold">{day.title}</h4>
                        <p className="text-sm text-gray-600">{day.date}</p>
                      </div>
                    </div>
                    {expandedDay === day.day ? 
                      <ChevronUp className="w-5 h-5" /> : 
                      <ChevronDown className="w-5 h-5" />
                    }
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Activities */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-gray-700">Actividades</h5>
                    <ul className="space-y-2">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Biblical Quote */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <div className="flex items-start gap-2">
                      <Quote className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm italic text-gray-700">
                          "{day.biblicalQuote}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hotel className="w-4 h-4" />
                    <span className="font-medium">Alojamiento:</span>
                    {day.accommodation}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;