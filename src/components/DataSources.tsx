import React from 'react';
import { Satellite, Globe, Database, Brain } from 'lucide-react';

const DataSources: React.FC = () => {
  const sources = [
    {
      icon: Satellite,
      name: 'INSAT-3D/3DR/3DS',
      type: 'Satellite AOD Data',
      status: 'active',
      lastUpdate: '2024-01-15 14:30 UTC',
      coverage: 'India & Surrounding Regions',
      resolution: '4km x 4km'
    },
    {
      icon: Database,
      name: 'CPCB Stations',
      type: 'Ground-Based PM Data',
      status: 'active',
      lastUpdate: '2024-01-15 14:25 UTC',
      coverage: '340+ Monitoring Stations',
      resolution: 'Hourly Measurements'
    },
    {
      icon: Globe,
      name: 'MERRA-2 Reanalysis',
      type: 'Meteorological Data',
      status: 'active',
      lastUpdate: '2024-01-15 12:00 UTC',
      coverage: 'Global Coverage',
      resolution: '0.5° x 0.625°'
    },
    {
      icon: Brain,
      name: 'Random Forest ML',
      type: 'Prediction Model',
      status: 'trained',
      lastUpdate: '2024-01-14 09:15 UTC',
      coverage: 'India-wide Predictions',
      resolution: 'R² = 0.847'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trained': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trained': return 'bg-blue-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Data Sources</h2>
        <p className="text-sm text-gray-600 mt-1">Multi-source integration for comprehensive analysis</p>
      </div>
      
      <div className="p-4 space-y-4">
        {sources.map((source, index) => {
          const IconComponent = source.icon;
          return (
            <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-lg">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{source.name}</h3>
                      <div className={`w-2 h-2 ${getStatusDot(source.status)} rounded-full`}></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{source.type}</p>
                    <div className="grid grid-cols-2 gap-x-4 mt-2 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Coverage:</span> {source.coverage}
                      </div>
                      <div>
                        <span className="font-medium">Resolution:</span> {source.resolution}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(source.status)}`}>
                    {source.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">{source.lastUpdate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataSources;