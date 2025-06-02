
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, Droplets, Eye, Activity, Monitor, FileInput, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ManualWaterQualityInput from './ManualWaterQualityInput';

interface WaterQualityData {
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  timestamp: string;
}

interface WaterBody {
  id: string;
  name: string;
  location: string;
  type: 'lake' | 'river' | 'reservoir' | 'groundwater';
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
  const [activeTab, setActiveTab] = useState<'realtime' | 'manual'>('realtime');
  const [selectedWaterBody, setSelectedWaterBody] = useState<string>('hussain-sagar');
  
  const waterBodies: WaterBody[] = [
    { id: 'hussain-sagar', name: 'Hussain Sagar Lake', location: 'Central Hyderabad', type: 'lake' },
    { id: 'musi-river', name: 'Musi River', location: 'Old City', type: 'river' },
    { id: 'himayat-sagar', name: 'Himayat Sagar', location: 'Rangareddy', type: 'reservoir' },
    { id: 'osman-sagar', name: 'Osman Sagar', location: 'Gandipet', type: 'reservoir' },
    { id: 'durgam-cheruvu', name: 'Durgam Cheruvu', location: 'Hi-Tech City', type: 'lake' },
    { id: 'groundwater-1', name: 'Groundwater - Jubilee Hills', location: 'Jubilee Hills', type: 'groundwater' }
  ];

  const [currentData, setCurrentData] = useState<Record<string, WaterQualityData>>({});
  const [historicalData, setHistoricalData] = useState<Record<string, WaterQualityData[]>>({});
  const [manualReadings, setManualReadings] = useState<any[]>([]);

  // Generate different baseline values for each water body
  const getWaterBodyBaseline = (waterBodyId: string) => {
    const baselines = {
      'hussain-sagar': { pH: 7.8, turbidity: 2.5, temperature: 24, dissolvedOxygen: 6.5 },
      'musi-river': { pH: 6.8, turbidity: 4.0, temperature: 26, dissolvedOxygen: 5.5 },
      'himayat-sagar': { pH: 7.2, turbidity: 1.2, temperature: 22, dissolvedOxygen: 8.0 },
      'osman-sagar': { pH: 7.1, turbidity: 1.0, temperature: 21, dissolvedOxygen: 8.5 },
      'durgam-cheruvu': { pH: 7.5, turbidity: 1.8, temperature: 23, dissolvedOxygen: 7.2 },
      'groundwater-1': { pH: 6.9, turbidity: 0.5, temperature: 25, dissolvedOxygen: 7.8 }
    };
    return baselines[waterBodyId] || baselines['hussain-sagar'];
  };

  // Generate realistic data variations for each water body
  const generateWaterBodyData = (waterBodyId: string): WaterQualityData => {
    const baseline = getWaterBodyBaseline(waterBodyId);
    return {
      pH: baseline.pH + (Math.random() - 0.5) * 1.0,
      turbidity: Math.max(0.1, baseline.turbidity + (Math.random() - 0.5) * 1.5),
      temperature: baseline.temperature + (Math.random() - 0.5) * 3.0,
      dissolvedOxygen: Math.max(3, baseline.dissolvedOxygen + (Math.random() - 0.5) * 2.0),
      timestamp: new Date().toISOString()
    };
  };

  // Initialize data for all water bodies
  useEffect(() => {
    const initData: Record<string, WaterQualityData> = {};
    const initHistorical: Record<string, WaterQualityData[]> = {};

    waterBodies.forEach(waterBody => {
      // Current data
      initData[waterBody.id] = generateWaterBodyData(waterBody.id);
      
      // Historical data
      const historical: WaterQualityData[] = [];
      for (let i = 0; i < 10; i++) {
        historical.push({
          ...generateWaterBodyData(waterBody.id),
          timestamp: new Date(Date.now() - (10 - i) * 3000).toISOString()
        });
      }
      initHistorical[waterBody.id] = historical;
    });

    setCurrentData(initData);
    setHistoricalData(initHistorical);
  }, []);

  // Real-time updates for all water bodies
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => {
        const updated = { ...prev };
        waterBodies.forEach(waterBody => {
          updated[waterBody.id] = generateWaterBodyData(waterBody.id);
        });
        return updated;
      });
      
      setHistoricalData(prev => {
        const updated = { ...prev };
        waterBodies.forEach(waterBody => {
          const newData = generateWaterBodyData(waterBody.id);
          updated[waterBody.id] = [...(prev[waterBody.id] || []), newData].slice(-20);
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = (value: number, min: number, max: number, optimal: [number, number]): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value >= optimal[0] && value <= optimal[1]) return 'good';
    return 'warning';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const selectedWaterBodyData = currentData[selectedWaterBody];
  const selectedHistoricalData = historicalData[selectedWaterBody] || [];
  const selectedWaterBodyInfo = waterBodies.find(wb => wb.id === selectedWaterBody);

  const chartData = selectedHistoricalData.map(data => ({
    time: formatTime(data.timestamp),
    pH: data.pH,
    turbidity: data.turbidity,
    temperature: data.temperature,
    dissolvedOxygen: data.dissolvedOxygen
  }));

  const handleManualReading = (reading: any) => {
    setManualReadings(prev => [reading, ...prev]);
  };

  const getWaterBodyTypeColor = (type: string) => {
    const colors = {
      lake: 'text-blue-600',
      river: 'text-green-600',
      reservoir: 'text-purple-600',
      groundwater: 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900">Water Quality Monitor</h1>
          <p className="text-lg text-gray-600">Hyderabad Water Quality Monitoring System</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4">
          <Button
            variant={activeTab === 'realtime' ? 'default' : 'outline'}
            onClick={() => setActiveTab('realtime')}
            className="flex items-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Real-time Monitoring
          </Button>
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            className="flex items-center gap-2"
          >
            <FileInput className="w-4 h-4" />
            Manual Testing
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'realtime' ? (
          <>
            {/* Water Body Selection */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Select Water Body
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedWaterBody} onValueChange={setSelectedWaterBody}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a water body to monitor" />
                  </SelectTrigger>
                  <SelectContent>
                    {waterBodies.map((waterBody) => (
                      <SelectItem key={waterBody.id} value={waterBody.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{waterBody.name}</span>
                          <div className="flex items-center gap-2 ml-4">
                            <span className="text-sm text-gray-500">{waterBody.location}</span>
                            <Badge variant="outline" className={getWaterBodyTypeColor(waterBody.type)}>
                              {waterBody.type}
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedWaterBodyInfo && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg">{selectedWaterBodyInfo.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>📍 {selectedWaterBodyInfo.location}</span>
                      <Badge variant="outline" className={getWaterBodyTypeColor(selectedWaterBodyInfo.type)}>
                        {selectedWaterBodyInfo.type}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live monitoring active - {selectedWaterBodyInfo?.name}
            </div>

            {/* Parameter Cards */}
            {selectedWaterBodyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ParameterCard
                  title="pH Level"
                  value={selectedWaterBodyData.pH}
                  unit="pH"
                  icon={<Droplets className="w-4 h-4 text-aqua-600" />}
                  status={getStatus(selectedWaterBodyData.pH, 6.0, 8.5, [6.5, 7.5])}
                  min={6.0}
                  max={8.5}
                />
                
                <ParameterCard
                  title="Turbidity"
                  value={selectedWaterBodyData.turbidity}
                  unit="NTU"
                  icon={<Eye className="w-4 h-4 text-blue-600" />}
                  status={getStatus(selectedWaterBodyData.turbidity, 0, 4, [0, 1])}
                  min={0}
                  max={4}
                />
                
                <ParameterCard
                  title="Temperature"
                  value={selectedWaterBodyData.temperature}
                  unit="°C"
                  icon={<Thermometer className="w-4 h-4 text-red-500" />}
                  status={getStatus(selectedWaterBodyData.temperature, 0, 35, [15, 25])}
                  min={0}
                  max={35}
                />
                
                <ParameterCard
                  title="Dissolved Oxygen"
                  value={selectedWaterBodyData.dissolvedOxygen}
                  unit="mg/L"
                  icon={<Activity className="w-4 h-4 text-green-600" />}
                  status={getStatus(selectedWaterBodyData.dissolvedOxygen, 5, 15, [7, 12])}
                  min={5}
                  max={15}
                />
              </div>
            )}

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
                    <span className="font-medium">
                      {selectedWaterBodyData ? formatTime(selectedWaterBodyData.timestamp) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Monitoring Status:</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Water Bodies:</span>
                    <span className="font-medium">{waterBodies.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Update Interval:</span>
                    <span className="font-medium">3 seconds</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Water Bodies Overview */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">All Water Bodies Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {waterBodies.map((waterBody) => {
                    const data = currentData[waterBody.id];
                    if (!data) return null;
                    
                    return (
                      <div 
                        key={waterBody.id} 
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedWaterBody === waterBody.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedWaterBody(waterBody.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{waterBody.name}</h4>
                          <Badge variant="outline" className={getWaterBodyTypeColor(waterBody.type)}>
                            {waterBody.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{waterBody.location}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>pH: <span className="font-medium">{data.pH.toFixed(1)}</span></div>
                          <div>Temp: <span className="font-medium">{data.temperature.toFixed(1)}°C</span></div>
                          <div>Turbidity: <span className="font-medium">{data.turbidity.toFixed(1)} NTU</span></div>
                          <div>DO: <span className="font-medium">{data.dissolvedOxygen.toFixed(1)} mg/L</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <ManualWaterQualityInput onSubmit={handleManualReading} />
        )}
      </div>
    </div>
  );
};

export default WaterQualityDashboard;
