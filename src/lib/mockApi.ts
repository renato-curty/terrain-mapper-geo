
import { GeographicCoordinates, ProcessingResult } from '@/pages/Index';

// This is a mock API that simulates the behavior of a Python backend
// In a real application, this would be replaced by calls to a Python API

export const processTerrain = async (
  image: File | string,
  coordinates: GeographicCoordinates
): Promise<ProcessingResult> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In a real implementation, we would send the image and coordinates to a Python backend
  // For demo purposes, we'll return mock data based on the example image
  
  // Create a basic polygon around the provided coordinates
  // In reality, this would be the result of image processing with OpenCV
  const polygonCoordinates: Array<[number, number]> = [
    [coordinates.longitude - 0.002, coordinates.latitude - 0.001],
    [coordinates.longitude + 0.002, coordinates.latitude - 0.001],
    [coordinates.longitude + 0.002, coordinates.latitude + 0.001],
    [coordinates.longitude - 0.001, coordinates.latitude + 0.002],
    [coordinates.longitude - 0.002, coordinates.latitude + 0.0005],
    [coordinates.longitude - 0.002, coordinates.latitude - 0.001]
  ];

  // Create GeoJSON data
  const geojsonData = JSON.stringify({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Detected Terrain Area",
          timestamp: new Date().toISOString()
        },
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoordinates]
        }
      }
    ]
  });

  // Generate a URL for geojson.io
  const encodedGeoJSON = encodeURIComponent(geojsonData);
  const geojsonUrl = `https://geojson.io/#data=data:application/json,${encodedGeoJSON}`;

  return {
    polygonCoordinates,
    geojsonUrl,
    geojsonData
  };
};
