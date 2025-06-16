import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, CreditCard, MapPin, Clock, Star, 
  Plus, Download, Smartphone, Car, Building,
  CheckCircle, AlertTriangle, Filter, Search
} from 'lucide-react';

interface Permit {
  id: string;
  type: 'residential' | 'business' | 'visitor' | 'handicap' | 'monthly';
  zone: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  vehiclePlate: string;
  benefits: string[];
}

interface PermitManagementProps {
  permits: Permit[];
  onPurchasePermit: (type: string) => void;
}

export const PermitManagement: React.FC<PermitManagementProps> = ({
  permits,
  onPurchasePermit
}) => {
  const [activeTab, setActiveTab] = useState<'my-permits' | 'available'>('my-permits');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock permits for demo
  const mockPermits: Permit[] = [
    {
      id: 'PM-2024-001',
      type: 'residential',
      zone: 'Downtown Residential Zone A',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      cost: 120.00,
      status: 'active',
      vehiclePlate: 'ABC123FL',
      benefits: ['24/7 parking', 'No time limits', 'Towing protection']
    }
  ];

  const allPermits = permits.length > 0 ? permits : mockPermits;

  const availablePermits = [
    {
      type: 'residential',
      name: 'Residential Parking Permit',
      description: 'Annual permit for residents in designated zones',
      zones: ['Zone A', 'Zone B', 'Zone C', 'Zone D'],
      cost: 120.00,
      duration: '12 months',
      benefits: ['24/7 parking in residential zones', 'No time restrictions', 'Towing protection', 'Guest parking privileges'],
      icon: '🏠',
      popular: true
    },
    {
      type: 'business',
      name: 'Business Parking Permit',
      description: 'For business owners and employees',
      zones: ['Business District', 'Commercial Zone'],
      cost: 200.00,
      duration: '12 months',
      benefits: ['Weekday parking 7AM-6PM', 'Multiple vehicle registration', 'Priority parking spaces'],
      icon: '🏢',
      popular: false
    },
    {
      type: 'monthly',
      name: 'Monthly Parking Pass',
      description: 'Flexible monthly parking solution',
      zones: ['Downtown', 'Waterfront', 'Arts District'],
      cost: 25.00,
      duration: '1 month',
      benefits: ['Flexible monthly terms', 'Multiple zone access', 'Online management'],
      icon: '📅',
      popular: false
    },
    {
      type: 'visitor',
      name: 'Visitor Parking Pass',
      description: 'Temporary passes for guests',
      zones: ['All residential zones'],
      cost: 5.00,
      duration: '1 day',
      benefits: ['Daily visitor access', 'Easy online purchase', 'Instant activation'],
      icon: '👥',
      popular: false
    },
    {
      type: 'handicap',
      name: 'Handicap Parking Permit',
      description: 'Accessible parking for qualified individuals',
      zones: ['All zones with accessible spaces'],
      cost: 0.00,
      duration: '24 months',
      benefits: ['Free accessible parking', 'Extended time limits', 'Priority placement'],
      icon: '♿',
      popular: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'suspended': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const renderMyPermits = () => (
    <div className="space-y-4">
      {allPermits.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Permits</h3>
          <p className="text-gray-600 mb-4">You don't have any parking permits yet.</p>
          <button
            onClick={() => setActiveTab('available')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Permits
          </button>
        </div>
      ) : (
        allPermits.map((permit, index) => (
          <motion.div
            key={permit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-900 mr-3">{permit.id}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(permit.status)}`}>
                    {getStatusIcon(permit.status)}
                    <span className="ml-1 capitalize">{permit.status}</span>
                  </span>
                </div>
                <p className="text-lg font-medium text-blue-600 mb-1 capitalize">
                  {permit.type.replace('-', ' ')} Parking Permit
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{permit.zone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Car className="h-4 w-4 mr-1" />
                  <span>{permit.vehiclePlate}</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${permit.cost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">
                  {getDaysRemaining(permit.endDate)} days left
                </p>
              </div>
            </div>
            
            {/* Permit Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Valid From</p>
                <p className="text-sm text-gray-900">{permit.startDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expires</p>
                <p className="text-sm text-gray-900">{permit.endDate.toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Benefits:</p>
              <div className="flex flex-wrap gap-2">
                {permit.benefits.map((benefit, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download Permit
              </button>
              
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Smartphone className="h-4 w-4 mr-2" />
                Add to Wallet
              </button>
              
              {permit.status === 'active' && getDaysRemaining(permit.endDate) < 30 && (
                <button className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                  <Calendar className="h-4 w-4 mr-2" />
                  Renew Permit
                </button>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderAvailablePermits = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availablePermits.map((permit, index) => (
          <motion.div
            key={permit.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all ${
              permit.popular ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
            }`}
          >
            {permit.popular && (
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Most Popular
                </span>
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
            )}
            
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4">{permit.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{permit.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{permit.description}</p>
                
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Duration: {permit.duration}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Zones: {permit.zones.join(', ')}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {permit.cost === 0 ? 'Free' : `$${permit.cost.toFixed(2)}`}
                </p>
                <p className="text-sm text-gray-500">per {permit.duration}</p>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">What's included:</p>
              <ul className="space-y-1">
                {permit.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Purchase Button */}
            <button
              onClick={() => onPurchasePermit(permit.type)}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                permit.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {permit.cost === 0 ? 'Apply Now' : 'Purchase Permit'}
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help Choosing?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">Residents:</p>
            <p>Choose the Residential Parking Permit for unlimited parking in your zone.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Business Owners:</p>
            <p>Business permits offer weekday parking with multiple vehicle options.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Visitors:</p>
            <p>Daily visitor passes are perfect for short-term parking needs.</p>
          </div>
          <div>
            <p className="font-medium mb-1">Questions?</p>
            <p>Contact our parking office at (561) 822-1900 for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Parking Permits</h2>
            <p className="text-sm text-gray-600">Manage your parking permits and explore available options</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-permits')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'my-permits'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Permits ({allPermits.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Permits
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'my-permits' ? renderMyPermits() : renderAvailablePermits()}
        </motion.div>
      </div>
    </div>
  );
};