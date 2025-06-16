import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, DollarSign, Navigation, Star, 
  Filter, SortAsc, Car, Zap, Shield, Accessibility
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

interface ParkingSpacesProps {
  spaces: ParkingSpace[];
  userLocation: [number, number] | null;
  onSpaceSelect: (space: ParkingSpace) => void;
  onReserve: (spaceId: string) => void;
}

export const ParkingSpaces: React.FC<ParkingSpacesProps> = ({
  spaces,
  userLocation,
  onSpaceSelect,
  onReserve
}) => {
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available'>('available');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedSpaces = spaces
    .filter(space => filterStatus === 'all' || space.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'price':
          return a.rate - b.rate;
        case 'rating':
          return 0; // Mock rating sort
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'occupied': return 'text-red-600 bg-red-50';
      case 'reserved': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
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
      default: return null;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Available Parking</h2>
            <p className="text-sm text-gray-600">
              {filteredAndSortedSpaces.length} spaces found
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Spaces
              </button>
              <button
                onClick={() => setFilterStatus('available')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === 'available'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Available Only
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Spaces List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredAndSortedSpaces.map((space, index) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSpaceSelect(space)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{getTypeIcon(space.type)}</span>
                  <h3 className="font-semibold text-gray-900">{space.location}</h3>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(space.status)}`}>
                    {space.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{space.address}</p>
                
                {/* Amenities */}
                {space.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {space.amenities.map((amenity, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity.replace('-', ' ')}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-lg font-bold text-green-600 mb-1">
                  <DollarSign className="h-4 w-4" />
                  {space.rate}
                  <span className="text-sm text-gray-500 ml-1">/hr</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                  4.5
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Navigation className="h-4 w-4 mr-2" />
                <span>{space.distance} mi</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{space.timeLimit} min max</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Car className="h-4 w-4 mr-2" />
                <span className="capitalize">{space.type}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserve(space.id);
                }}
                disabled={space.status !== 'available'}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  space.status === 'available'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {space.status === 'available' ? 'Reserve Now' : 'Unavailable'}
              </button>
              
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Directions
              </button>
              
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};