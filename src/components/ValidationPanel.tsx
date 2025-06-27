import React, { useState } from 'react';
import { Target, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const ValidationPanel: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState('delhi-01');

  const validationData = [
    {
      id: 'delhi-01',
      station: 'Delhi - Anand Vihar',
      measured: 145,
      predicted: 138,
      error: -7,
      accuracy: 95.2,
      status: 'good'
    },
    {
      id: 'mumbai-02',
      station: 'Mumbai - Bandra',
      measured: 89,
      predicted: 96,
      error: 7,
      accuracy: 92.1,
      status: 'good'
    },
    {
      id: 'bangalore-03',
      station: 'Bangalore - BTM Layout',
      measured: 67,
      predicted: 71,
      error: 4,
      accuracy: 94.0,
      status: 'good'
    },
    {
      id: 'chennai-04',
      station: 'Chennai - T. Nagar',
      measured: 73,
      predicted: 65,
      error: -8,
      accuracy: 89.0,
      status: 'moderate'
    },
    {
      id: 'kolkata-05',
      station: 'Kolkata - Jadavpur',
      measured: 112,
      predicted: 125,
      error: 13,
      accuracy: 88.4,
      status: 'moderate'
    },
    {
      id: 'hyderabad-06',
      station: 'Hyderabad - Gachibowli',
      measured: 78,
      predicted: 74,
      error: -4,
      accuracy: 94.9,
      status: 'good'
    }
  ];

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

  const selectedData = validationData.find(d => d.id === selectedStation);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Model Validation
        </h2>
        <p className="text-sm text-gray-600 mt-1">Comparison with CPCB ground truth measurements</p>
      </div>
      
      <div className="p-4">
        {/* Station Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select CPCB Station</label>
          <select 
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {validationData.map((station) => (
              <option key={station.id} value={station.id}>
                {station.station}
              </option>
            ))}
          </select>
        </div>
        
        {/* Selected Station Details */}
        {selectedData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">{selectedData.station}</h3>
              {getStatusIcon(selectedData.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">Ground Truth</div>
                <div className="text-2xl font-bold text-gray-900">{selectedData.measured}</div>
                <div className="text-xs text-gray-500">μg/m³ PM2.5</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-600">ML Prediction</div>
                <div className="text-2xl font-bold text-blue-600">{selectedData.predicted}</div>
                <div className="text-xs text-gray-500">μg/m³ PM2.5</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Prediction Error:</span>
                <span className={`ml-2 font-medium ${getErrorColor(selectedData.error)}`}>
                  {selectedData.error > 0 ? '+' : ''}{selectedData.error} μg/m³
                </span>
              </div>
              <div>
                <span className="text-gray-600">Accuracy:</span>
                <span className="ml-2 font-medium text-green-600">{selectedData.accuracy}%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* All Stations Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">All Stations Summary</h4>
          {validationData.map((station) => (
            <div 
              key={station.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedStation === station.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedStation(station.id)}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(station.status)}
                <div>
                  <div className="font-medium text-gray-900 text-sm">{station.station.split(' - ')[1]}</div>
                  <div className="text-xs text-gray-600">{station.station.split(' - ')[0]}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{station.accuracy}%</div>
                <div className={`text-xs ${getErrorColor(station.error)}`}>
                  {station.error > 0 ? '+' : ''}{station.error} μg/m³
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Statistics */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">92.1%</div>
              <div className="text-xs text-gray-600">Avg Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">6.8</div>
              <div className="text-xs text-gray-600">Avg Error (μg/m³)</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">340</div>
              <div className="text-xs text-gray-600">Active Stations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;