import React, { useState } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Download } from 'lucide-react';

const MapPanel: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState('pm25');
  const [zoomLevel, setZoomLevel] = useState(5);

  const layerOptions = [
    { id: 'pm25', name: 'PM2.5 Concentration', color: 'bg-red-500' },
    { id: 'pm10', name: 'PM10 Concentration', color: 'bg-orange-500' },
    { id: 'aod', name: 'Aerosol Optical Depth', color: 'bg-purple-500' },
    { id: 'stations', name: 'CPCB Stations', color: 'bg-green-500' }
  ];

  const cities = [
    { name: 'Delhi', pm25: 145, lat: 28.6, lng: 77.2, status: 'severe' },
    { name: 'Mumbai', pm25: 89, lat: 19.0, lng: 72.8, status: 'moderate' },
    { name: 'Bangalore', pm25: 67, lat: 12.9, lng: 77.6, status: 'moderate' },
    { name: 'Chennai', pm25: 73, lat: 13.0, lng: 80.2, status: 'moderate' },
    { name: 'Kolkata', pm25: 112, lat: 22.5, lng: 88.3, status: 'unhealthy' },
    { name: 'Hyderabad', pm25: 78, lat: 17.4, lng: 78.5, status: 'moderate' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Spatial Distribution Map
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 10))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-3">
          <Layers className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-2">
            {layerOptions.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(layer.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  selectedLayer === layer.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 ${layer.color} rounded-full inline-block mr-1.5`}></div>
                {layer.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Simulated India Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <path
              d="M80 50 L120 40 L160 60 L200 45 L250 70 L280 90 L300 120 L290 160 L270 200 L240 220 L200 240 L160 230 L120 210 L90 180 L70 140 L80 100 Z"
              fill="#3B82F6"
              className="opacity-30"
            />
          </svg>
        </div>
        
        {/* City Data Points */}
        {cities.map((city, index) => (
          <div
            key={city.name}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(city.status)} rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
            style={{
              left: `${20 + (index % 3) * 25 + Math.random() * 20}%`,
              top: `${30 + Math.floor(index / 3) * 30 + Math.random() * 20}%`,
              width: `${Math.max(12, city.pm25 / 10)}px`,
              height: `${Math.max(12, city.pm25 / 10)}px`
            }}
            title={`${city.name}: ${city.pm25} μg/m³`}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
              {city.name}: {city.pm25} μg/m³
            </div>
          </div>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-xs">
          <div className="font-medium text-gray-900 mb-2">PM2.5 Levels (μg/m³)</div>
          <div className="space-y-1">
            <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>Good (0-30)</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>Moderate (31-60)</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>Unhealthy (61-120)</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>Severe (121+)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;