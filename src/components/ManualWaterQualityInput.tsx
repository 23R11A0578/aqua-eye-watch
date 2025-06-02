
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Eye, Activity, MapPin } from 'lucide-react';

interface ManualReadingData {
  pH: number;
  turbidity: number;
  temperature: number;
  dissolvedOxygen: number;
  timestamp: string;
  location: string;
}

interface ManualInputProps {
  onSubmit: (data: ManualReadingData) => void;
}

const ManualWaterQualityInput: React.FC<ManualInputProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    pH: '',
    turbidity: '',
    temperature: '',
    dissolvedOxygen: ''
  });

  const [lastReading, setLastReading] = useState<ManualReadingData | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatus = (value: number, min: number, max: number, optimal: [number, number]): 'good' | 'warning' | 'danger' => {
    if (value < min || value > max) return 'danger';
    if (value >= optimal[0] && value <= optimal[1]) return 'good';
    return 'warning';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reading: ManualReadingData = {
      pH: parseFloat(formData.pH),
      turbidity: parseFloat(formData.turbidity),
      temperature: parseFloat(formData.temperature),
      dissolvedOxygen: parseFloat(formData.dissolvedOxygen),
      timestamp: new Date().toISOString(),
      location: 'Hyderabad'
    };

    setLastReading(reading);
    onSubmit(reading);
  };

  const isFormValid = formData.pH && formData.turbidity && formData.temperature && formData.dissolvedOxygen;

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Manual Water Quality Testing - Hyderabad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pH" className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-aqua-600" />
                  pH Level
                </Label>
                <Input
                  id="pH"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="6.0 - 8.5"
                  value={formData.pH}
                  onChange={(e) => handleInputChange('pH', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turbidity" className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  Turbidity (NTU)
                </Label>
                <Input
                  id="turbidity"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0 - 4"
                  value={formData.turbidity}
                  onChange={(e) => handleInputChange('turbidity', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Temperature (°C)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="15 - 35"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dissolvedOxygen" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  Dissolved Oxygen (mg/L)
                </Label>
                <Input
                  id="dissolvedOxygen"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="5 - 15"
                  value={formData.dissolvedOxygen}
                  onChange={(e) => handleInputChange('dissolvedOxygen', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={!isFormValid}
              className="w-full bg-aqua-600 hover:bg-aqua-700"
            >
              Analyze Water Quality
            </Button>
          </form>
        </CardContent>
      </Card>

      {lastReading && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Water Quality Analysis Results - Hyderabad</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tested on: {new Date(lastReading.timestamp).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-aqua-600" />
                    <span className="text-sm font-medium">pH Level</span>
                  </div>
                  <Badge className={statusColors[getStatus(lastReading.pH, 6.0, 8.5, [6.5, 7.5])]}>
                    {statusText[getStatus(lastReading.pH, 6.0, 8.5, [6.5, 7.5])]}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{lastReading.pH.toFixed(1)} pH</div>
                <div className="text-xs text-muted-foreground">Normal: 6.5 - 7.5 pH</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Turbidity</span>
                  </div>
                  <Badge className={statusColors[getStatus(lastReading.turbidity, 0, 4, [0, 1])]}>
                    {statusText[getStatus(lastReading.turbidity, 0, 4, [0, 1])]}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{lastReading.turbidity.toFixed(1)} NTU</div>
                <div className="text-xs text-muted-foreground">Normal: 0 - 1 NTU</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Temperature</span>
                  </div>
                  <Badge className={statusColors[getStatus(lastReading.temperature, 0, 35, [15, 25])]}>
                    {statusText[getStatus(lastReading.temperature, 0, 35, [15, 25])]}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{lastReading.temperature.toFixed(1)} °C</div>
                <div className="text-xs text-muted-foreground">Normal: 15 - 25 °C</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Dissolved Oxygen</span>
                  </div>
                  <Badge className={statusColors[getStatus(lastReading.dissolvedOxygen, 5, 15, [7, 12])]}>
                    {statusText[getStatus(lastReading.dissolvedOxygen, 5, 15, [7, 12])]}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{lastReading.dissolvedOxygen.toFixed(1)} mg/L</div>
                <div className="text-xs text-muted-foreground">Normal: 7 - 12 mg/L</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManualWaterQualityInput;
