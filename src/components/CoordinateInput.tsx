
import React from 'react';
import { GeographicCoordinates } from '@/pages/Index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CoordinateInputProps {
  value: GeographicCoordinates;
  onChange: (coords: GeographicCoordinates) => void;
}

const CoordinateInput: React.FC<CoordinateInputProps> = ({ value, onChange }) => {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    onChange({
      ...value,
      latitude: isNaN(lat) ? 0 : Math.max(-90, Math.min(90, lat)),
    });
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    onChange({
      ...value,
      longitude: isNaN(lng) ? 0 : Math.max(-180, Math.min(180, lng)),
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-terrain-green" />
          <h3 className="font-medium">Image Center Coordinates</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="latitude" className="mb-1 block text-sm">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              placeholder="43.651070"
              value={value.latitude || ''}
              onChange={handleLatitudeChange}
            />
          </div>
          
          <div>
            <Label htmlFor="longitude" className="mb-1 block text-sm">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              placeholder="-79.347015"
              value={value.longitude || ''}
              onChange={handleLongitudeChange}
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Enter the geographic coordinates of the center point of your uploaded image.
        </p>
      </CardContent>
    </Card>
  );
};

export default CoordinateInput;
