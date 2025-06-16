import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Calendar, DollarSign, MapPin, 
  Clock, CreditCard, FileText, Camera, Phone,
  CheckCircle, XCircle, Filter, Search
} from 'lucide-react';

interface Citation {
  id: string;
  violationType: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  location: string;
  licensePlate: string;
  status: 'unpaid' | 'paid' | 'contested' | 'overdue';
  officerBadge?: string;
  photos?: string[];
}

interface CitationCenterProps {
  citations: Citation[];
  onPayCitation: (citationId: string) => void;
}

export const CitationCenter: React.FC<CitationCenterProps> = ({
  citations,
  onPayCitation
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // Mock citations for demo
  const mockCitations: Citation[] = [
    {
      id: 'CT-2024-001234',
      violationType: 'Expired Meter',
      amount: 25.00,
      issueDate: new Date('2024-01-15T14:30:00'),
      dueDate: new Date('2024-02-15T23:59:59'),
      location: 'Clematis Street, Block 100',
      licensePlate: 'ABC123FL',
      status: 'unpaid',
      officerBadge: 'Badge #4521'
    },
    {
      id: 'CT-2024-001189',
      violationType: 'No Parking Zone',
      amount: 50.00,
      issueDate: new Date('2024-01-10T09:15:00'),
      dueDate: new Date('2024-02-10T23:59:59'),
      location: 'Flagler Drive, Near Marina',
      licensePlate: 'ABC123FL',
      status: 'paid',
      officerBadge: 'Badge #3892'
    }
  ];

  const allCitations = citations.length > 0 ? citations : mockCitations;

  const filteredCitations = allCitations.filter(citation => {
    const matchesStatus = filterStatus === 'all' || citation.status === filterStatus;
    const matchesSearch = citation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.violationType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid': return 'text-red-600 bg-red-50 border-red-200';
      case 'paid': return 'text-green-600 bg-green-50 border-green-200';
      case 'contested': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'overdue': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'unpaid': return <AlertTriangle className="h-4 w-4" />;
      case 'contested': return <FileText className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const totalUnpaid = filteredCitations
    .filter(c => c.status === 'unpaid' || c.status === 'overdue')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Citation Center</h2>
            <p className="text-sm text-gray-600">
              {filteredCitations.length} citation{filteredCitations.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {totalUnpaid > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-800">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">${totalUnpaid.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by citation ID, violation type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Citations</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="contested">Contested</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Citations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredCitations.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Citations Found</h3>
            <p className="text-gray-600">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You have no parking citations at this time.'}
            </p>
          </div>
        ) : (
          filteredCitations.map((citation, index) => (
            <motion.div
              key={citation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-900 mr-3">{citation.id}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(citation.status)}`}>
                      {getStatusIcon(citation.status)}
                      <span className="ml-1 capitalize">{citation.status}</span>
                    </span>
                  </div>
                  <p className="text-lg font-medium text-red-600 mb-1">{citation.violationType}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{citation.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Issued: {citation.issueDate.toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Due: {citation.dueDate.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${citation.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{citation.licensePlate}</p>
                </div>
              </div>
              
              {/* Citation Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Officer</p>
                  <p className="text-sm text-gray-900">{citation.officerBadge}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue Time</p>
                  <p className="text-sm text-gray-900">{citation.issueDate.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Days Remaining</p>
                  <p className="text-sm text-gray-900">
                    {Math.max(0, Math.ceil((citation.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {(citation.status === 'unpaid' || citation.status === 'overdue') && (
                  <button
                    onClick={() => onPayCitation(citation.id)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedCitation(citation)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </button>
                
                {citation.status === 'unpaid' && (
                  <button className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Contest Citation
                  </button>
                )}
                
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {totalUnpaid > 0 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Outstanding</p>
              <p className="text-xl font-bold text-red-600">${totalUnpaid.toFixed(2)}</p>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Pay All Citations
            </button>
          </div>
        </div>
      )}
    </div>
  );
};