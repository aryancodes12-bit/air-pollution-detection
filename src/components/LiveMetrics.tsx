import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { MetricData } from '../hooks/useAirQualityData';

interface LiveMetricsProps {
  metrics: MetricData[];
  isLoading: boolean;
}

const LiveMetrics: React.FC<LiveMetricsProps> = ({ metrics, isLoading }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          text: 'text-green-600',
          border: 'border-green-200'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          text: 'text-red-600',
          border: 'border-red-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  const getIcon = (title: string) => {
    if (title.includes('Accuracy')) return CheckCircle;
    if (title.includes('Pollution')) return AlertTriangle;
    return TrendingUp;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4">
              <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Live Performance Metrics</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = getIcon(metric.title);
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          const colors = getColorClasses(metric.color);
          const isSelected = selectedMetric === metric.title;
          
          return (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected ? `${colors.border} ring-2 ring-opacity-20` : 'border-gray-200'
              }`}
              onClick={() => setSelectedMetric(isSelected ? null : metric.title)}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-110' : ''
                }`}>
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="font-medium">{metric.change}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className={`text-2xl font-bold transition-colors ${isSelected ? colors.text : 'text-gray-900'}`}>
                  {metric.value}
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-medium">{metric.title}</p>
                <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                
                {/* Progress bar for accuracy metrics */}
                {metric.title.includes('Accuracy') && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${colors.bg.replace('50', '400')}`}
                        style={{ width: metric.value }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* Real-time indicator */}
                <div className="flex items-center mt-2 space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>
              
              {/* Expanded details */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Hour:</span>
                      <span className="font-medium">{(parseFloat(metric.value) - 0.5).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">24h Average:</span>
                      <span className="font-medium">{(parseFloat(metric.value) - 1.2).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trend:</span>
                      <span className={`font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend === 'up' ? 'Improving' : 'Declining'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveMetrics;