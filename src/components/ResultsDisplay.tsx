
import React from 'react';
import { ProcessingResult } from '@/pages/Index';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Download, ExternalLink, Loader2, MapPin } from 'lucide-react';
import MapPreview from './MapPreview';

interface ResultsDisplayProps {
  result: ProcessingResult | null;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-12 w-12 text-terrain-green animate-spin mb-4" />
        <h3 className="text-xl font-semibold mb-2">Processing Your Image</h3>
        <p className="text-muted-foreground max-w-md">
          We're detecting the green area and converting it to geographic coordinates...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MapPin className="h-12 w-12 text-terrain-brown/60 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
        <p className="text-muted-foreground max-w-md">
          Upload an aerial image and enter coordinates to analyze terrain and convert the highlighted area to geographic coordinates.
        </p>
      </div>
    );
  }

  const downloadGeoJSON = () => {
    const blob = new Blob([result.geojsonData], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terrain_polygon.geojson';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="map">
        <TabsList className="w-full">
          <TabsTrigger value="map" className="w-1/2">Map View</TabsTrigger>
          <TabsTrigger value="data" className="w-1/2">Coordinate Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="pt-4">
          <div className="bg-terrain-field/30 rounded-md border overflow-hidden">
            <MapPreview coordinates={result.polygonCoordinates} />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="pt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Polygon Coordinates (WGS84)</h3>
              <div className="bg-muted p-3 rounded-md overflow-auto max-h-80">
                <pre className="text-xs font-mono">
                  {JSON.stringify(result.polygonCoordinates, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      
      <div className="flex flex-col md:flex-row gap-4">
        <Button 
          onClick={downloadGeoJSON}
          className="bg-terrain-brown hover:bg-terrain-brown/90 flex-1"
        >
          <Download className="mr-2 h-4 w-4" />
          Download GeoJSON
        </Button>
        
        <Button 
          onClick={() => window.open(result.geojsonUrl, '_blank')}
          variant="outline" 
          className="flex-1"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View in GeoJSON.io
        </Button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
