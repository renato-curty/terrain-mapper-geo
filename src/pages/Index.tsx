
import React, { useState } from 'react';
import Header from '@/components/Header';
import ImageUploader from '@/components/ImageUploader';
import CoordinateInput from '@/components/CoordinateInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { processTerrain } from '@/lib/mockApi';

export type GeographicCoordinates = {
  latitude: number;
  longitude: number;
};

export type ProcessingResult = {
  polygonCoordinates: Array<[number, number]>;
  geojsonUrl: string;
  geojsonData: string;
};

const Index = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | string | null>(null);
  const [coordinates, setCoordinates] = useState<GeographicCoordinates>({
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  const handleImageChange = (imageFile: File | string | null) => {
    setImage(imageFile);
    setResult(null);
  };

  const handleCoordinateChange = (coords: GeographicCoordinates) => {
    setCoordinates(coords);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      toast({
        title: "Image Required",
        description: "Please upload an image or provide a URL.",
        variant: "destructive"
      });
      return;
    }

    if (coordinates.latitude === 0 && coordinates.longitude === 0) {
      toast({
        title: "Coordinates Required",
        description: "Please enter the geographic coordinates of the image center.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real application, this would be an API call to a Python backend
      const result = await processTerrain(image, coordinates);
      setResult(result);
      toast({
        title: "Processing Complete",
        description: "The terrain analysis has been successfully completed.",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terrain-field/30">
      <Header />
      <main className="container py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Input Data</h2>
              <div className="space-y-6">
                <ImageUploader onChange={handleImageChange} />
                <CoordinateInput value={coordinates} onChange={handleCoordinateChange} />
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !image} 
                  className="w-full bg-terrain-green hover:bg-terrain-green/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Process Terrain
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              <ResultsDisplay result={result} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex justify-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Terrain Mapper GEO - All rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Index;
