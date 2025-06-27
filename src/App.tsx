import React, { useState } from 'react';
import Header from './components/Header';
import LiveMetrics from './components/LiveMetrics';
import InteractiveMap from './components/InteractiveMap';
import InteractiveChart from './components/InteractiveChart';
import DataSources from './components/DataSources';
import InteractiveValidation from './components/InteractiveValidation';
import { useAirQualityData } from './hooks/useAirQualityData';

function App() {
  const {
    stations,
    selectedStation,
    setSelectedStation,
    chartData,
    metrics,
    isLoading
  } = useAirQualityData();

  const [selectedMetric, setSelectedMetric] = useState('pm25');
  const [selectedLayer, setSelectedLayer] = useState('pm25');

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
  };

  const handleLayerChange = (layer: string) => {
    setSelectedLayer(layer);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Metrics */}
        <div className="mb-8">
          <LiveMetrics metrics={metrics} isLoading={isLoading} />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Interactive Map - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <InteractiveMap 
              stations={stations}
              selectedStation={selectedStation}
              onStationSelect={handleStationSelect}
              onLayerChange={handleLayerChange}
            />
          </div>
          
          {/* Data Sources - Takes 1 column */}
          <div>
            <DataSources />
          </div>
        </div>
        
        {/* Charts and Validation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveChart 
            data={chartData}
            selectedMetric={selectedMetric}
            onMetricChange={handleMetricChange}
          />
          <InteractiveValidation 
            stations={stations}
            selectedStation={selectedStation}
            onStationSelect={handleStationSelect}
          />
        </div>
      </main>
    </div>
  );
}

export default App;