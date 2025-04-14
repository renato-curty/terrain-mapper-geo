
import React, { useEffect, useRef } from 'react';

interface MapPreviewProps {
  coordinates: Array<[number, number]>;
}

const MapPreview: React.FC<MapPreviewProps> = ({ coordinates }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real implementation, this would use a mapping library like Leaflet or Mapbox GL JS
    // For now, we'll create a simple SVG representation
    if (!mapContainerRef.current || coordinates.length < 3) return;

    const container = mapContainerRef.current;
    container.innerHTML = '';

    // Find bounds
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    coordinates.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    // Add padding
    const padding = 0.005;
    minLat -= padding;
    maxLat += padding;
    minLng -= padding;
    maxLng += padding;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", `${width}px`);
    svg.setAttribute("height", `${height}px`);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    
    // Scale points to fit the SVG
    const scaleX = width / (maxLng - minLng);
    const scaleY = height / (maxLat - minLat);

    // Create polygon points string
    const points = coordinates.map(([lng, lat]) => {
      const x = (lng - minLng) * scaleX;
      const y = height - (lat - minLat) * scaleY;  // SVG y is from top, lat from bottom
      return `${x},${y}`;
    }).join(' ');
    
    // Create the polygon
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "#4CAF50");
    polygon.setAttribute("stroke", "#2E7D32");
    polygon.setAttribute("stroke-width", "2");
    
    // Add grid lines
    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gridGroup.setAttribute("stroke", "#ccc");
    gridGroup.setAttribute("stroke-width", "0.5");
    
    // Add grid lines
    const gridStep = 0.01;
    for (let lat = Math.ceil(minLat / gridStep) * gridStep; lat <= maxLat; lat += gridStep) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const y = height - (lat - minLat) * scaleY;
      line.setAttribute("x1", "0");
      line.setAttribute("y1", `${y}`);
      line.setAttribute("x2", `${width}`);
      line.setAttribute("y2", `${y}`);
      gridGroup.appendChild(line);
    }
    
    for (let lng = Math.ceil(minLng / gridStep) * gridStep; lng <= maxLng; lng += gridStep) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const x = (lng - minLng) * scaleX;
      line.setAttribute("x1", `${x}`);
      line.setAttribute("y1", "0");
      line.setAttribute("x2", `${x}`);
      line.setAttribute("y2", `${height}`);
      gridGroup.appendChild(line);
    }
    
    svg.appendChild(gridGroup);
    svg.appendChild(polygon);
    container.appendChild(svg);
    
    // Add legend
    const legend = document.createElement("div");
    legend.className = "absolute bottom-2 left-2 bg-white/80 p-2 rounded text-xs";
    legend.innerHTML = `
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-terrain-green"></div>
        <span>Detected Area</span>
      </div>
      <div class="text-xs text-muted-foreground mt-1">
        Center: ${((minLat + maxLat) / 2).toFixed(6)}, ${((minLng + maxLng) / 2).toFixed(6)}
      </div>
    `;
    container.appendChild(legend);

  }, [coordinates]);

  return (
    <div className="relative aspect-video w-full bg-gray-100">
      <div ref={mapContainerRef} className="w-full h-full"></div>
    </div>
  );
};

export default MapPreview;
