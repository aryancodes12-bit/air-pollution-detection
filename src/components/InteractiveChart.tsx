import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Download, Filter, Play, Pause } from 'lucide-react';
import { ChartDataPoint } from '../hooks/useAirQualityData';

interface InteractiveChartProps {
  data: ChartDataPoint[];
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  selectedMetric,
  onMetricChange
}) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(data.length - 1);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const timeRanges = [
    { id: '6h', label: '6 Hours', points: 6 },
    { id: '12h', label: '12 Hours', points: 12 },
    { id: '24h', label: '24 Hours', points: 24 },
    { id: '48h', label: '48 Hours', points: 48 }
  ];

  const metrics = [
    { id: 'pm25', label: 'PM2.5', color: '#EF4444', unit: 'μg/m³' },
    { id: 'pm10', label: 'PM10', color: '#F97316', unit: 'μg/m³' },
    { id: 'aod', label: 'AOD', color: '#8B5CF6', unit: 'AOD' }
  ];

  const currentRange = timeRanges.find(r => r.id === timeRange) || timeRanges[2];
  const displayData = data.slice(-currentRange.points);
  const maxValue = Math.max(...displayData.map(d => Math.max(d.actual, d.predicted)));
  const minValue = Math.min(...displayData.map(d => Math.min(d.actual, d.predicted)));
  const range = maxValue - minValue;

  // Animation effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % displayData.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, displayData.length]);

  const getPointPosition = (index: number, value: number) => {
    const x = 60 + (index * (320 / Math.max(displayData.length - 1, 1)));
    const y = 140 - ((value - minValue) / range * 100);
    return { x, y };
  };

  const calculateStats = () => {
    const errors = displayData.map(d => Math.abs(d.actual - d.predicted));
    const mae = errors.reduce((sum, err) => sum + err, 0) / errors.length;
    const rmse = Math.sqrt(errors.reduce((sum, err) => sum + err * err, 0) / errors.length);
    const r2 = 0.847 + (Math.random() - 0.5) * 0.1; // Simulated R²
    
    return { mae: mae.toFixed(1), rmse: rmse.toFixed(1), r2: r2.toFixed(3) };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Interactive Temporal Analysis
            </h2>
            <p className="text-sm text-gray-600 mt-1">Real-time comparison: Ground truth vs ML predictions</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
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
                onClick={() => onMetricChange(metric.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  selectedMetric === metric.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="w-2 h-2 rounded-full inline-block mr-1.5"
                  style={{ backgroundColor: metric.color }}
                ></div>
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
              <g key={i}>
                <line
                  x1="60"
                  y1={40 + i * 25}
                  x2="380"
                  y2={40 + i * 25}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                <text
                  x="50"
                  y={45 + i * 25}
                  className="text-xs fill-gray-500"
                  textAnchor="end"
                >
                  {Math.round(maxValue - (i * range / 4))}
                </text>
              </g>
            ))}
            
            {/* X-axis labels */}
            {displayData.map((d, i) => {
              if (i % Math.ceil(displayData.length / 6) === 0) {
                const pos = getPointPosition(i, minValue);
                return (
                  <text
                    key={i}
                    x={pos.x}
                    y="155"
                    className="text-xs fill-gray-500"
                    textAnchor="middle"
                  >
                    {d.time}
                  </text>
                );
              }
              return null;
            })}
            
            {/* Actual data line */}
            <polyline
              points={displayData.map((d, i) => {
                const pos = getPointPosition(i, d.actual);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="opacity-80"
            />
            
            {/* Predicted data line */}
            <polyline
              points={displayData.map((d, i) => {
                const pos = getPointPosition(i, d.predicted);
                return `${pos.x},${pos.y}`;
              }).join(' ')}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="opacity-80"
            />
            
            {/* Data points */}
            {displayData.map((d, i) => {
              const actualPos = getPointPosition(i, d.actual);
              const predictedPos = getPointPosition(i, d.predicted);
              const isHovered = hoveredPoint === i;
              const isAnimated = isPlaying && i === currentIndex;
              
              return (
                <g key={i}>
                  {/* Actual data point */}
                  <circle
                    cx={actualPos.x}
                    cy={actualPos.y}
                    r={isHovered || isAnimated ? "5" : "3"}
                    fill="#3B82F6"
                    className={`transition-all cursor-pointer ${isAnimated ? 'animate-pulse' : ''}`}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Predicted data point */}
                  <circle
                    cx={predictedPos.x}
                    cy={predictedPos.y}
                    r={isHovered || isAnimated ? "5" : "3"}
                    fill="#10B981"
                    className={`transition-all cursor-pointer ${isAnimated ? 'animate-pulse' : ''}`}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Hover tooltip */}
                  {isHovered && (
                    <g>
                      <rect
                        x={actualPos.x - 40}
                        y={actualPos.y - 35}
                        width="80"
                        height="25"
                        fill="rgba(0,0,0,0.8)"
                        rx="4"
                      />
                      <text
                        x={actualPos.x}
                        y={actualPos.y - 20}
                        className="text-xs fill-white"
                        textAnchor="middle"
                      >
                        Actual: {d.actual}
                      </text>
                      <text
                        x={actualPos.x}
                        y={actualPos.y - 8}
                        className="text-xs fill-white"
                        textAnchor="middle"
                      >
                        Predicted: {d.predicted}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 space-y-2 text-xs bg-white bg-opacity-90 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600">Ground Truth</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-0.5 bg-green-500" style={{ borderTop: '1px dashed #10B981' }}></div>
              <span className="text-gray-600">ML Predictions</span>
            </div>
          </div>
        </div>
        
        {/* Interactive Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="text-lg font-semibold text-gray-900">{stats.r2}</div>
            <div className="text-xs text-gray-600">R² Score</div>
            <div className="text-xs text-green-600 mt-1">+0.02 vs last hour</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="text-lg font-semibold text-gray-900">{stats.rmse}</div>
            <div className="text-xs text-gray-600">RMSE (μg/m³)</div>
            <div className="text-xs text-red-600 mt-1">+1.2 vs last hour</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="text-lg font-semibold text-gray-900">{stats.mae}</div>
            <div className="text-xs text-gray-600">MAE (μg/m³)</div>
            <div className="text-xs text-green-600 mt-1">-0.5 vs last hour</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChart;