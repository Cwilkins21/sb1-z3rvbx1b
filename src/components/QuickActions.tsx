import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, CreditCard, QrCode, Clock, MapPin, 
  Zap, Car, Navigation, Smartphone
} from 'lucide-react';

interface QuickActionsProps {
  onFindParking: () => void;
  onPayParking: () => void;
  onScanQR: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onFindParking,
  onPayParking,
  onScanQR
}) => {
  const actions = [
    {
      id: 'find',
      label: 'Find Parking',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      action: onFindParking
    },
    {
      id: 'pay',
      label: 'Pay Meter',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      action: onPayParking
    },
    {
      id: 'scan',
      label: 'Scan QR',
      icon: QrCode,
      color: 'from-purple-500 to-purple-600',
      action: onScanQR
    },
    {
      id: 'extend',
      label: 'Extend Time',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Extend time')
    }
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4"
      >
        <div className="flex space-x-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 min-w-[80px]`}
            >
              <action.icon className="h-6 w-6 mb-2" />
              <span className="text-xs font-medium text-center leading-tight">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>12 spaces nearby</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>$2.50/hr avg</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};