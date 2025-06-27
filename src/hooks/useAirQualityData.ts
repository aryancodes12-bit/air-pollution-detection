import { useState, useEffect } from 'react';

export interface AirQualityStation {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  pm25: number;
  pm10: number;
  aod: number;
  status: 'good' | 'moderate' | 'unhealthy' | 'severe';
  lastUpdate: string;
  predicted: number;
  accuracy: number;
}

export interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  color: string;
}

export interface ChartDataPoint {
  time: string;
  actual: number;
  predicted: number;
  timestamp: number;
}

export const useAirQualityData = () => {
  const [stations, setStations] = useState<AirQualityStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const generateStations = (): AirQualityStation[] => {
      const cities = [
        { name: 'Delhi', city: 'Delhi', lat: 28.6139, lng: 77.2090 },
        { name: 'Mumbai', city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { name: 'Bangalore', city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        { name: 'Chennai', city: 'Chennai', lat: 13.0827, lng: 80.2707 },
        { name: 'Kolkata', city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
        { name: 'Hyderabad', city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
        { name: 'Pune', city: 'Pune', lat: 18.5204, lng: 73.8567 },
        { name: 'Ahmedabad', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
        { name: 'Jaipur', city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
        { name: 'Lucknow', city: 'Lucknow', lat: 26.8467, lng: 80.9462 }
      ];

      return cities.map((city, index) => {
        const basePM25 = 30 + Math.random() * 120;
        const pm25 = Math.round(basePM25 + Math.sin(Date.now() / 100000 + index) * 20);
        const predicted = Math.round(pm25 + (Math.random() - 0.5) * 20);
        const accuracy = Math.round(85 + Math.random() * 12);
        
        let status: 'good' | 'moderate' | 'unhealthy' | 'severe';
        if (pm25 <= 30) status = 'good';
        else if (pm25 <= 60) status = 'moderate';
        else if (pm25 <= 120) status = 'unhealthy';
        else status = 'severe';

        return {
          id: `station-${index}`,
          name: `${city.name} - Station ${index + 1}`,
          city: city.city,
          lat: city.lat,
          lng: city.lng,
          pm25,
          pm10: Math.round(pm25 * 1.4),
          aod: Math.round((pm25 / 100) * 100) / 100,
          status,
          lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          predicted,
          accuracy
        };
      });
    };

    const generateChartData = (): ChartDataPoint[] => {
      const data: ChartDataPoint[] = [];
      const now = Date.now();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = now - (i * 3600000); // hourly data
        const hour = new Date(timestamp).getHours();
        const baseValue = 60 + Math.sin(hour / 24 * Math.PI * 2) * 30;
        const actual = Math.round(baseValue + (Math.random() - 0.5) * 20);
        const predicted = Math.round(actual + (Math.random() - 0.5) * 15);
        
        data.push({
          time: new Date(timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          actual,
          predicted,
          timestamp
        });
      }
      
      return data;
    };

    const generateMetrics = (stationsData: AirQualityStation[]): MetricData[] => {
      const avgAccuracy = stationsData.reduce((sum, s) => sum + s.accuracy, 0) / stationsData.length;
      const severeCount = stationsData.filter(s => s.status === 'severe').length;
      const coverage = 3280000 + Math.round(Math.random() * 50000);
      const availability = 95 + Math.random() * 5;

      return [
        {
          title: 'Model Accuracy',
          value: `${avgAccuracy.toFixed(1)}%`,
          change: `+${(Math.random() * 3).toFixed(1)}%`,
          trend: 'up',
          description: 'R² Score vs Ground Truth',
          color: 'green'
        },
        {
          title: 'Coverage Area',
          value: `${(coverage / 1000000).toFixed(2)}M`,
          change: `+${Math.round(Math.random() * 20)}K`,
          trend: 'up',
          description: 'km² Daily Coverage',
          color: 'blue'
        },
        {
          title: 'High Pollution Areas',
          value: severeCount.toString(),
          change: `${Math.random() > 0.5 ? '+' : '-'}${Math.round(Math.random() * 5)}`,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          description: 'Cities >100 μg/m³',
          color: 'red'
        },
        {
          title: 'Data Availability',
          value: `${availability.toFixed(1)}%`,
          change: `+${(Math.random() * 2).toFixed(1)}%`,
          trend: 'up',
          description: 'Satellite Coverage',
          color: 'green'
        }
      ];
    };

    const updateData = () => {
      const newStations = generateStations();
      const newChartData = generateChartData();
      const newMetrics = generateMetrics(newStations);
      
      setStations(newStations);
      setChartData(newChartData);
      setMetrics(newMetrics);
      
      if (!selectedStation && newStations.length > 0) {
        setSelectedStation(newStations[0].id);
      }
      
      setIsLoading(false);
    };

    // Initial load
    updateData();

    // Update every 30 seconds
    const interval = setInterval(updateData, 30000);

    return () => clearInterval(interval);
  }, [selectedStation]);

  const getSelectedStationData = () => {
    return stations.find(s => s.id === selectedStation) || stations[0];
  };

  return {
    stations,
    selectedStation,
    setSelectedStation,
    chartData,
    metrics,
    isLoading,
    getSelectedStationData
  };
};