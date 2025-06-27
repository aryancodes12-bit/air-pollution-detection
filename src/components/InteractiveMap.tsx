import React, { useState, useEffect } from 'react';
import { MapPin, Layers, ZoomIn, ZoomOut, Download, RefreshCw } from 'lucide-react';
import { AirQualityStation } from '../hooks/useAirQualityData';

interface InteractiveMapProps {
  stations: AirQualityStation[];
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
  onLayerChange: (layer: string) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stations,
  selectedStation,
  onStationSelect,
  onLayerChange
}) => {
  const [selectedLayer, setSelectedLayer] = useState('pm25');
  const [zoomLevel, setZoomLevel] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const layerOptions = [
    { id: 'pm25', name: 'PM2.5 Concentration', color: 'bg-red-500' },
    { id: 'pm10', name: 'PM10 Concentration', color: 'bg-orange-500' },
    { id: 'aod', name: 'Aerosol Optical Depth', color: 'bg-purple-500' },
    { id: 'stations', name: 'CPCB Stations', color: 'bg-green-500' }
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

  const getStationSize = (pm25: number, isSelected: boolean, isHovered: boolean) => {
    const baseSize = Math.max(8, Math.min(24, pm25 / 6));
    const multiplier = isSelected ? 1.5 : isHovered ? 1.3 : 1;
    return baseSize * multiplier;
  };

  const handleLayerChange = (layerId: string) => {
    setSelectedLayer(layerId);
    onLayerChange(layerId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleStationClick = (station: AirQualityStation) => {
    onStationSelect(station.id);
  };

  const getDisplayValue = (station: AirQualityStation) => {
    switch (selectedLayer) {
      case 'pm25': return station.pm25;
      case 'pm10': return station.pm10;
      case 'aod': return station.aod;
      default: return station.pm25;
    }
  };

  const getDisplayUnit = () => {
    switch (selectedLayer) {
      case 'pm25':
      case 'pm10': return 'μg/m³';
      case 'aod': return 'AOD';
      default: return 'μg/m³';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Interactive Spatial Map
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 10))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 1))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRefresh}
              className={`p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
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
                onClick={() => handleLayerChange(layer.id)}
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
      
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {/* India Map Outline */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <path
              d="M80 50 L120 40 L160 60 L200 45 L250 70 L280 90 L300 120 L290 160 L270 200 L240 220 L200 240 L160 230 L120 210 L90 180 L70 140 L80 100 Z"
              fill="#3B82F6"
              className="opacity-30"
            />
          </svg>
        </div>
        
        {/* Station Data Points */}
        {stations.map((station, index) => {
          const isSelected = selectedStation === station.id;
          const isHovered = hoveredStation === station.id;
          const size = getStationSize(station.pm25, isSelected, isHovered);
          
          return (
            <div
              key={station.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(station.status)} rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ${
                isSelected ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
              }`}
              style={{
                left: `${15 + (index % 4) * 20 + Math.sin(index) * 15}%`,
                top: `${25 + Math.floor(index / 4) * 25 + Math.cos(index) * 15}%`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: isSelected ? 20 : isHovered ? 15 : 10
              }}
              onClick={() => handleStationClick(station)}
              onMouseEnter={() => setHoveredStation(station.id)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              {/* Tooltip */}
              <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap transition-opacity duration-200 ${
                isHovered || isSelected ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="font-medium">{station.city}</div>
                <div>{getDisplayValue(station)} {getDisplayUnit()}</div>
                <div className="text-gray-300 text-xs">
                  {new Date(station.lastUpdate).toLocaleTimeString()}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
              
              {/* Pulse animation for selected station */}
              {isSelected && (
                <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></div>
              )}
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 text-xs shadow-lg">
          <div className="font-medium text-gray-900 mb-2">
            {selectedLayer === 'pm25' ? 'PM2.5' : selectedLayer === 'pm10' ? 'PM10' : 'AOD'} Levels
          </div>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Good (0-30)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Moderate (31-60)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Unhealthy (61-120)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Severe (121+)</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            Zoom: {zoomLevel}x | Stations: {stations.length}
          </div>
        </div>
        
        {/* Real-time indicator */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white bg-opacity-95 rounded-lg px-3 py-2 text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Live Data</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;