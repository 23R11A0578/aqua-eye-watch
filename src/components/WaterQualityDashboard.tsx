import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Eye, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterQualityData {
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  timestamp: string;
}

interface ParameterCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'danger';
  min: number;
  max: number;
}

const ParameterCard: React.FC<ParameterCardProps> = ({ title, value, unit, icon, status, min, max }) => {
  const statusColors = {
    good: 'bg-status-good text-white',
    warning: 'bg-status-warning text-white',
    danger: 'bg-status-danger text-white'
  };

  const statusText = {
    good: 'Normal',
    warning: 'Warning',
    danger: 'Critical'
  };

  return (
    <Card className="h-full animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Range: {min} - {max} {unit}
            </div>
          </div>
          <Badge className={`${statusColors[status]} animate-pulse-glow`}>
            {statusText[status]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const WaterQualityDashboard: React.FC = () => {
  const [currentData, setCurrentData] = useState<WaterQualityData>({
    pH: 7.2,
    turbidity: 1.5,
    temperature: 22.3,
    dissolvedOxygen: 8.5,
    timestamp: new Date().toISOString()
  });

  const [historicalData, setHistoricalData] = useState<WaterQualityData[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: WaterQualityData = {
        pH: 6.5 + Math.random() * 2,
        turbidity: 0.5 + Math.random() * 3,
        temperature: 20 + Math.random() * 8,
        dissolvedOxygen: 6 + Math.random() * 4,
        timestamp: new Date().toISOString()
      };

      setCurrentData(newData);
      
      setHistoricalData(prev => {
        const updated = [...prev, newData];
        // Keep only last 20 data points
        return updated.slice(-20);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Initialize with some historical data
  useEffect(() => {
    const initialData: WaterQualityData[] = [];
    for (let i = 0; i < 10; i++) {
      initialData.push({
        pH: 6.5 + Math.random() * 2,
        turbidity: 0.5 + Math.random() * 3,
        temperature: 20 + Math.random() * 8,
        dissolvedOxygen: 6 + Math.random() * 4,
        timestamp: new Date(Date.now() - (10 - i) * 3000).toISOString()
      });
    }
    setHistoricalData(initialData);
  }, []);

  const getStatus = (value: number, min: number, max: number, optimal: [number, number]): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value >= optimal[0] && value <= optimal[1]) return 'good';
    return 'warning';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const chartData = historicalData.map(data => ({
    time: formatTime(data.timestamp),
    pH: data.pH,
    turbidity: data.turbidity,
    temperature: data.temperature,
    dissolvedOxygen: data.dissolvedOxygen
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900">Water Quality Monitor</h1>
          <p className="text-lg text-gray-600">Real-time water quality monitoring system</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live monitoring active
          </div>
        </div>

        {/* Parameter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ParameterCard
            title="pH Level"
            value={currentData.pH}
            unit="pH"
            icon={<Droplets className="w-4 h-4 text-aqua-600" />}
            status={getStatus(currentData.pH, 6.0, 8.5, [6.5, 7.5])}
            min={6.0}
            max={8.5}
          />
          
          <ParameterCard
            title="Turbidity"
            value={currentData.turbidity}
            unit="NTU"
            icon={<Eye className="w-4 h-4 text-blue-600" />}
            status={getStatus(currentData.turbidity, 0, 4, [0, 1])}
            min={0}
            max={4}
          />
          
          <ParameterCard
            title="Temperature"
            value={currentData.temperature}
            unit="°C"
            icon={<Thermometer className="w-4 h-4 text-red-500" />}
            status={getStatus(currentData.temperature, 0, 35, [15, 25])}
            min={0}
            max={35}
          />
          
          <ParameterCard
            title="Dissolved Oxygen"
            value={currentData.dissolvedOxygen}
            unit="mg/L"
            icon={<Activity className="w-4 h-4 text-green-600" />}
            status={getStatus(currentData.dissolvedOxygen, 5, 15, [7, 12])}
            min={5}
            max={15}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">pH & Temperature Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="pH" 
                    stroke="#14b8a6" 
                    strokeWidth={2}
                    name="pH Level"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Turbidity & Oxygen Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="turbidity" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Turbidity (NTU)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="dissolvedOxygen" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Dissolved Oxygen (mg/L)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Summary */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Last Update:</span>
                <span className="font-medium">{formatTime(currentData.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Monitoring Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Data Points:</span>
                <span className="font-medium">{historicalData.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>Update Interval:</span>
                <span className="font-medium">3 seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterQualityDashboard;
