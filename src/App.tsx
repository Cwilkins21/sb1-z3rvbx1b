import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, CreditCard, Clock, Menu, X, 
  Navigation, Bell, User, Settings, 
  Calendar, DollarSign, AlertTriangle, CheckCircle,
  Camera, Shield, FileText
} from 'lucide-react';
import { PaymentSystem } from './components/PaymentSystem';
import { UserProfile } from './components/UserProfile';
import { CitationCenter } from './components/CitationCenter';
import { PermitManagement } from './components/PermitManagement';
import { CitizenReporting } from './components/CitizenReporting';

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
  paymentMethods: PaymentMethod[];
  activeParking?: ActiveParking;
  permits: Permit[];
  citations: Citation[];
}

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'digital';
  last4: string;
  brand: string;
  isDefault: boolean;
}

interface ActiveParking {
  spaceId: string;
  startTime: Date;
  endTime: Date;
  cost: number;
  location: string;
}

interface Permit {
  id: string;
  type: string;
  zone: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  status: string;
  vehiclePlate: string;
  benefits: string[];
}

interface Citation {
  id: string;
  violationType: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  location: string;
  licensePlate: string;
  status: string;
  officerBadge?: string;
}

function App() {
  const [currentView, setCurrentView] = useState('payment');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [notifications, setNotifications] = useState(2);

  useEffect(() => {
    // Mock user session
    setUser({
      id: 'user-001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(561) 555-0123',
      vehicles: [
        {
          id: 'vehicle-001',
          licensePlate: 'ABC123FL',
          make: 'Honda',
          model: 'Civic',
          color: 'Blue',
          isDefault: true
        }
      ],
      paymentMethods: [
        {
          id: 'card-001',
          type: 'credit',
          last4: '4242',
          brand: 'Visa',
          isDefault: true
        }
      ],
      permits: [],
      citations: []
    });
  }, []);

  const navigation = [
    { id: 'payment', label: 'Pay Parking', icon: CreditCard },
    { id: 'report', label: 'Report Violation', icon: Camera },
    { id: 'citations', label: 'Citations', icon: AlertTriangle },
    { id: 'permits', label: 'Permits', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'payment':
        return (
          <PaymentSystem 
            user={user}
            activeParking={user?.activeParking}
            onPayment={(amount) => console.log('Payment:', amount)}
          />
        );
      case 'report':
        return (
          <CitizenReporting 
            onSubmitReport={(report) => console.log('Report submitted:', report)}
          />
        );
      case 'citations':
        return (
          <CitationCenter 
            citations={user?.citations || []}
            onPayCitation={(id) => console.log('Pay citation:', id)}
          />
        );
      case 'permits':
        return (
          <PermitManagement 
            permits={user?.permits || []}
            onPurchasePermit={(type) => console.log('Purchase permit:', type)}
          />
        );
      case 'profile':
        return (
          <UserProfile 
            user={user}
            onUpdateProfile={(data) => console.log('Update profile:', data)}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">WPB Parking</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">West Palm Beach</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-white/95 backdrop-blur-sm shadow-xl border-r border-blue-100 flex flex-col absolute lg:relative z-30 h-full"
            >
              {/* Current Parking Status */}
              {user?.activeParking && (
                <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Currently Parked</span>
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm opacity-90">{user.activeParking.location}</p>
                  <p className="text-xs opacity-75">
                    Expires: {user.activeParking.endTime.toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      currentView === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Emergency Contact */}
              <div className="p-4 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">Emergency</span>
                  </div>
                  <p className="text-xs text-red-700">
                    Parking Enforcement: (561) 822-1900
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;