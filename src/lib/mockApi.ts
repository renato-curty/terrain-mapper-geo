
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
  // and use OpenCV to detect the green areas in the image
  
  // Create a rectangular polygon (4 sides) with a smaller area
  // Using a smaller offset to create a polygon more similar to the agricultural field in the image
  const offset = 0.0005; // Reduced offset by about 4x from previous value
  
  const polygonCoordinates: Array<[number, number]> = [
    [coordinates.longitude - offset, coordinates.latitude - offset], // Bottom left
    [coordinates.longitude + offset, coordinates.latitude - offset], // Bottom right
    [coordinates.longitude + offset, coordinates.latitude + offset], // Top right
    [coordinates.longitude - offset, coordinates.latitude + offset], // Top left
    [coordinates.longitude - offset, coordinates.latitude - offset]  // Back to first point to close the polygon
  ];

  // Create GeoJSON data
  const geojsonData = JSON.stringify({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Agricultural Field",
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
