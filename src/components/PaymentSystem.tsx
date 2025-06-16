import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Clock, MapPin, DollarSign, Plus, 
  CheckCircle, AlertCircle, Smartphone, QrCode,
  Calendar, Receipt, Star, Shield
} from 'lucide-react';

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

interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentMethods: PaymentMethod[];
  activeParking?: ActiveParking;
}

interface PaymentSystemProps {
  user: UserSession | null;
  activeParking?: ActiveParking;
  onPayment: (amount: number) => void;
}

export const PaymentSystem: React.FC<PaymentSystemProps> = ({
  user,
  activeParking,
  onPayment
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [extendTime, setExtendTime] = useState(60);
  const [showAddCard, setShowAddCard] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(5.00);

  const timeOptions = [
    { minutes: 30, price: 1.25 },
    { minutes: 60, price: 2.50 },
    { minutes: 120, price: 5.00 },
    { minutes: 240, price: 10.00 }
  ];

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    onPayment(paymentAmount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes > 0 ? `${minutes} min remaining` : 'Expired';
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Active Parking Session */}
        {activeParking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <div>
                  <h3 className="font-bold text-lg">Currently Parked</h3>
                  <p className="opacity-90">{activeParking.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${activeParking.cost}</p>
                <p className="text-sm opacity-90">Total Cost</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm opacity-75">Started</p>
                <p className="font-semibold">{formatTime(activeParking.startTime)}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Expires</p>
                <p className="font-semibold">{formatTime(activeParking.endTime)}</p>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3">
              <p className="text-center font-medium">
                {getTimeRemaining(activeParking.endTime)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {activeParking ? 'Extend Parking Time' : 'Start Parking Session'}
          </h3>
          
          {/* Time Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Select Duration</p>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => {
                    setExtendTime(option.minutes);
                    setPaymentAmount(option.price);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    extendTime === option.minutes
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">
                      {option.minutes < 60 ? `${option.minutes}m` : `${option.minutes / 60}h`}
                    </p>
                    <p className="text-sm text-gray-600">${option.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Payment Method</p>
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Card
              </button>
            </div>
            
            <div className="space-y-3">
              {user?.paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{method.type}</p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">
                {extendTime < 60 ? `${extendTime} minutes` : `${extendTime / 60} hour${extendTime > 60 ? 's' : ''}`}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Rate</span>
              <span className="font-medium">$2.50/hour</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-green-600">${paymentAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {activeParking ? 'Extend Parking' : 'Start Parking'} - ${paymentAmount.toFixed(2)}
          </button>
        </motion.div>

        {/* Alternative Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Payment Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <QrCode className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Scan QR Code</p>
                <p className="text-sm text-gray-600">Pay at meter directly</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Smartphone className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Mobile Wallet</p>
                <p className="text-sm text-gray-600">Apple Pay, Google Pay</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div className="space-y-3">
            {[
              { date: 'Today, 2:30 PM', location: 'Clematis Street', amount: 5.00, duration: '2 hours' },
              { date: 'Yesterday, 10:15 AM', location: 'CityPlace Garage', amount: 7.50, duration: '3 hours' },
              { date: 'Dec 15, 4:45 PM', location: 'Flagler Drive Lot', amount: 3.00, duration: '1 hour' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Receipt className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{transaction.location}</p>
                    <p className="text-sm text-gray-600">{transaction.date} • {transaction.duration}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};