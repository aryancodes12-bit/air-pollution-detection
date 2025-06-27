import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

const MetricsCards: React.FC = () => {
  const metrics = [
    {
      title: 'Model Accuracy',
      value: '84.7%',
      change: '+2.1%',
      trend: 'up',
      description: 'R² Score vs Ground Truth',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Coverage Area',
      value: '3.28M',
      change: '+15K',
      trend: 'up',
      description: 'km² Daily Coverage',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'High Pollution Areas',
      value: '23',
      change: '-3',
      trend: 'down',
      description: 'Cities >100 μg/m³',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Data Availability',
      value: '98.2%',
      change: '+0.8%',
      trend: 'up',
      description: 'Satellite Coverage',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          text: 'text-green-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          text: 'text-blue-600'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          text: 'text-red-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          text: 'text-gray-600'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        const colors = getColorClasses(metric.color);
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendIcon className="w-4 h-4" />
                <span className="font-medium">{metric.change}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;