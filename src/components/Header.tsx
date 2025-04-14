
import React from 'react';
import { MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-terrain-green py-4 shadow-md">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Terrain Mapper GEO</h1>
        </div>
        <div className="text-white text-sm">
          Detect and convert terrain areas to geographic coordinates
        </div>
      </div>
    </header>
  );
};

export default Header;
