import React, { useState } from 'react';
import { Target, AlertCircle, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { AirQualityStation } from '../hooks/useAirQualityData';

interface InteractiveValidationProps {
  stations: AirQualityStation[];
  selectedStation: string;
  onStationSelect: (stationId: string) => void;
}

const InteractiveValidation: React.FC<InteractiveValidationProps> = ({
  stations,
  selectedStation,
  onStationSelect
}) => {
  const [sortBy, setSortBy] = useState<'accuracy' | 'error' | 'name'>('accuracy');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'moderate':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getErrorColor = (error: number) => {
    const absError = Math.abs(error);
    if (absError <= 5) return 'text-green-600';
    if (absError <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy >= 95) return 'good';
    if (accuracy >= 85) return 'moderate';
    return 'poor';
  };

  const calculateError = (station: AirQualityStation) => {
    return station.predicted - station.pm25;
  };

  const sortedStations = [...stations].sort((a, b) => {
    switch (sortBy) {
      case 'accuracy':
        return b.accuracy - a.accuracy;
      case 'error':
        return Math.abs(calculateError(a)) - Math.abs(calculateError(b));
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const filteredStations = sortedStations.filter(station => {
    if (filterStatus === 'all') return true;
    return getAccuracyStatus(station.accuracy) === filterStatus;
  });

  const selectedStationData = stations.find(s => s.id === selectedStation);
  const overallStats = {
    avgAccuracy: stations.reduce((sum, s) => sum + s.accuracy, 0) / stations.length,
    avgError: stations.reduce((sum, s) => sum + Math.abs(calculateError(s)), 0) / stations.length,
    totalStations: stations.length
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Interactive Model Validation
        </h2>
        <p className="text-sm text-gray-600 mt-1">Real-time comparison with CPCB ground truth measurements</p>
      </div>
      
      <div className="p-4">
        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'accuracy' | 'error' | 'name')}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="accuracy">Accuracy</option>
                <option value="error">Error</option>
                <option value="name">Name</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stations</option>
                <option value="good">High Accuracy (≥95%)</option>
                <option value="moderate">Moderate (85-94%)</option>
                <option value="poor">Low Accuracy (&lt;85%)</option>
              </select>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">Showing {filteredStations.length} of {stations.length} stations</div>
          </div>
        </div>
        
        {/* Selected Station Details */}
        {selectedStationData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{selectedStationData.name}</h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(getAccuracyStatus(selectedStationData.accuracy))}
                <span className="text-sm text-gray-600">
                  {new Date(selectedStationData.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-gray-600">Ground Truth</div>
                <div className="text-2xl font-bold text-gray-900">{selectedStationData.pm25}</div>
                <div className="text-xs text-gray-500">μg/m³ PM2.5</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm text-gray-600">ML Prediction</div>
                <div className="text-2xl font-bold text-blue-600">{selectedStationData.predicted}</div>
                <div className="text-xs text-gray-500">μg/m³ PM2.5</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <span className="text-gray-600">Error:</span>
                <div className={`font-medium ${getErrorColor(calculateError(selectedStationData))}`}>
                  {calculateError(selectedStationData) > 0 ? '+' : ''}{calculateError(selectedStationData)} μg/m³
                </div>
              </div>
              <div className="text-center">
                <span className="text-gray-600">Accuracy:</span>
                <div className="font-medium text-green-600">{selectedStationData.accuracy}%</div>
              </div>
              <div className="text-center">
                <span className="text-gray-600">Status:</span>
                <div className="font-medium capitalize">{selectedStationData.status}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stations List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredStations.map((station) => {
            const error = calculateError(station);
            const isSelected = selectedStation === station.id;
            
            return (
              <div 
                key={station.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => onStationSelect(station.id)}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(getAccuracyStatus(station.accuracy))}
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{station.city}</div>
                    <div className="text-xs text-gray-600">{station.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{station.accuracy}%</div>
                    <div className={`text-xs ${getErrorColor(error)}`}>
                      {error > 0 ? '+' : ''}{error} μg/m³
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {Math.abs(error) <= 5 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Overall Statistics */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{overallStats.avgAccuracy.toFixed(1)}%</div>
              <div className="text-xs text-green-600">Average Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">
                {overallStats.avgAccuracy > 90 ? '↗ Excellent' : '↘ Needs Improvement'}
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-semibold text-yellow-700">{overallStats.avgError.toFixed(1)}</div>
              <div className="text-xs text-yellow-600">Avg Error (μg/m³)</div>
              <div className="text-xs text-gray-500 mt-1">
                {overallStats.avgError < 10 ? '↗ Good' : '↘ High'}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{overallStats.totalStations}</div>
              <div className="text-xs text-blue-600">Active Stations</div>
              <div className="text-xs text-gray-500 mt-1">↗ Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveValidation;