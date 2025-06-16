import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Navigation, Clock, DollarSign, Car, 
  Zap, Shield, Accessibility, Star, Filter
} from 'lucide-react';

interface ParkingSpace {
  id: string;
  location: string;
  address: string;
  coordinates: [number, number];
  type: 'street' | 'garage' | 'lot';
  status: 'available' | 'occupied' | 'reserved' | 'disabled';
  rate: number;
  timeLimit: number;
  amenities: string[];
  distance?: number;
}

interface ParkingMapProps {
  spaces: ParkingSpace[];
  userLocation: [number, number] | null;
  selectedSpace: ParkingSpace | null;
  onSpaceSelect: (space: ParkingSpace | null) => void;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  spaces,
  userLocation,
  selectedSpace,
  onSpaceSelect
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-80.0533, 26.7153]);
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSpaces = spaces.filter(space => {
    if (filterType === 'all') return true;
    if (filterType === 'available') return space.status === 'available';
    if (filterType === 'garage') return space.type === 'garage';
    if (filterType === 'street') return space.type === 'street';
    if (filterType === 'lot') return space.type === 'lot';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      case 'disabled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'garage': return '🏢';
      case 'lot': return '🅿️';
      case 'street': return '🛣️';
      default: return '📍';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'ev-charging': return <Zap className="h-3 w-3" />;
      case 'security': return <Shield className="h-3 w-3" />;
      case 'handicap-accessible': return <Accessibility className="h-3 w-3" />;
      case 'covered': return '🏠';
      default: return '•';
    }
  };

  return (
    <div className="relative h-full bg-gradient-to-br from-blue-100 to-green-100">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-green-100 to-blue-100 overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-gray-300/30"></div>
            ))}
          </div>
        </div>

        {/* Street Lines */}
        <svg className="absolute inset-0 w-full h-full">
          <line x1="20%" y1="30%" x2="80%" y2="30%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
          <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
          <line x1="20%" y1="70%" x2="80%" y2="70%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
          <line x1="30%" y1="20%" x2="30%" y2="80%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
          <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
          <line x1="70%" y1="20%" x2="70%" y2="80%" stroke="#4B5563" strokeWidth="3" opacity="0.6" />
        </svg>

        {/* User Location */}
        {userLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>
          </motion.div>
        )}

        {/* Parking Spaces */}
        {filteredSpaces.map((space, index) => {
          const x = 25 + (index % 3) * 25;
          const y = 25 + Math.floor(index / 3) * 20;
          
          return (
            <motion.div
              key={space.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onSpaceSelect(space)}
            >
              <div className={`w-6 h-6 rounded-full ${getStatusColor(space.status)} border-2 border-white shadow-lg flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">
                  {getTypeIcon(space.type)}
                </span>
              </div>
              
              {selectedSpace?.id === space.id && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl p-4 w-64 z-30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{space.location}</h3>
                      <p className="text-sm text-gray-600">{space.address}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      space.status === 'available' ? 'bg-green-100 text-green-800' :
                      space.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {space.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${space.rate}/hr
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {space.timeLimit}min max
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Navigation className="h-4 w-4 mr-1" />
                      {space.distance}mi away
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-1" />
                      {space.type}
                    </div>
                  </div>
                  
                  {space.amenities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {space.amenities.map((amenity, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {getAmenityIcon(amenity)}
                            <span className="ml-1">{amenity.replace('-', ' ')}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Reserve Now
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Directions
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 space-y-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition-colors"
        >
          <Filter className="h-5 w-5 text-gray-700" />
        </button>
        
        <button className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition-colors">
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 z-30"
        >
          <h3 className="font-semibold text-gray-900 mb-3">Filter Spaces</h3>
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Spaces' },
              { id: 'available', label: 'Available Only' },
              { id: 'garage', label: 'Garages' },
              { id: 'street', label: 'Street Parking' },
              { id: 'lot', label: 'Parking Lots' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterType === filter.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 z-30">
        <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};