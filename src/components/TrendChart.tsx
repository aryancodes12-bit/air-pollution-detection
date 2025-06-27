import React, { useState } from 'react';
import { BarChart3, Calendar, Download, Filter } from 'lucide-react';

const TrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pm25');

  const timeRanges = [
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  const metrics = [
    { id: 'pm25', label: 'PM2.5', color: 'bg-red-500' },
    { id: 'pm10', label: 'PM10', color: 'bg-orange-500' },
    { id: 'aod', label: 'AOD', color: 'bg-purple-500' }
  ];

  // Simulated data for the chart
  const generateChartData = () => {
    const data = [];
    const days = timeRange === '24h' ? 24 : parseInt(timeRange);
    for (let i = 0; i < days; i++) {
      data.push({
        time: i,
        value: 50 + Math.sin(i / 3) * 30 + Math.random() * 20,
        predicted: 48 + Math.sin(i / 3) * 28 + Math.random() * 15
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const maxValue = Math.max(...chartData.map(d => Math.max(d.value, d.predicted)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Temporal Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-1">Ground truth vs ML predictions</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div className="flex space-x-1">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    timeRange === range.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-1">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  selectedMetric === metric.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-2 h-2 ${metric.color} rounded-full inline-block mr-1.5`}></div>
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="h-64 relative">
          <svg viewBox="0 0 400 160" className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40"
                y1={40 + i * 30}
                x2="380"
                y2={40 + i * 30}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => (
              <text
                key={i}
                x="30"
                y={45 + i * 30}
                className="text-xs fill-gray-500"
                textAnchor="end"
              >
                {Math.round(maxValue - (i * maxValue / 4))}
              </text>
            ))}
            
            {/* Actual data line */}
            <polyline
              points={chartData.map((d, i) => 
                `${40 + (i * 340 / chartData.length)},${160 - (d.value / maxValue * 120)}`
              ).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="opacity-80"
            />
            
            {/* Predicted data line */}
            <polyline
              points={chartData.map((d, i) => 
                `${40 + (i * 340 / chartData.length)},${160 - (d.predicted / maxValue * 120)}`
              ).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="opacity-80"
            />
            
            {/* Data points */}
            {chartData.map((d, i) => (
              <g key={i}>
                <circle
                  cx={40 + (i * 340 / chartData.length)}
                  cy={160 - (d.value / maxValue * 120)}
                  r="3"
                  fill="#3B82F6"
                  className="opacity-80 hover:opacity-100"
                />
                <circle
                  cx={40 + (i * 340 / chartData.length)}
                  cy={160 - (d.predicted / maxValue * 120)}
                  r="3"
                  fill="#10B981"
                  className="opacity-80 hover:opacity-100"
                />
              </g>
            ))}
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600">Ground Truth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-green-500 border-dashed border-t border-green-500"></div>
              <span className="text-gray-600">ML Predictions</span>
            </div>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">0.847</div>
            <div className="text-xs text-gray-600">R² Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">12.3</div>
            <div className="text-xs text-gray-600">RMSE (μg/m³)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">8.7</div>
            <div className="text-xs text-gray-600">MAE (μg/m³)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;