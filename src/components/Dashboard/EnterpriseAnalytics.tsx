import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Activity, Users, DollarSign, 
  AlertTriangle, CheckCircle, Clock, Zap, Shield, Brain,
  Database, Cloud, Cpu, Network, Eye, Target
} from 'lucide-react';

interface AnalyticsData {
  performance: any[];
  usage: any[];
  revenue: any[];
  alerts: any[];
  predictions: any[];
  integrations: any[];
}

export const EnterpriseAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
    
    if (realTimeEnabled) {
      const interval = setInterval(loadAnalyticsData, 30000);
      return () => clearInterval(interval);
    }
  }, [timeRange, realTimeEnabled]);

  const loadAnalyticsData = async () => {
    // Simulate loading enterprise analytics data
    const mockData: AnalyticsData = {
      performance: generatePerformanceData(),
      usage: generateUsageData(),
      revenue: generateRevenueData(),
      alerts: generateAlertsData(),
      predictions: generatePredictionsData(),
      integrations: generateIntegrationsData()
    };
    
    setData(mockData);
  };

  const generatePerformanceData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      responseTime: Math.random() * 500 + 100,
      throughput: Math.random() * 1000 + 500,
      errorRate: Math.random() * 5,
      cpuUsage: Math.random() * 80 + 10,
      memoryUsage: Math.random() * 70 + 20
    }));
  };

  const generateUsageData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      sessions: Math.floor(Math.random() * 2000) + 1000,
      pageViews: Math.floor(Math.random() * 10000) + 5000,
      apiCalls: Math.floor(Math.random() * 50000) + 25000
    }));
  };

  const generateRevenueData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      revenue: Math.floor(Math.random() * 100000) + 50000,
      costs: Math.floor(Math.random() * 30000) + 15000,
      profit: 0
    })).map(item => ({
      ...item,
      profit: item.revenue - item.costs
    }));
  };

  const generateAlertsData = () => {
    return [
      { type: 'critical', count: Math.floor(Math.random() * 5) },
      { type: 'warning', count: Math.floor(Math.random() * 15) + 5 },
      { type: 'info', count: Math.floor(Math.random() * 25) + 10 }
    ];
  };

  const generatePredictionsData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      predicted: Math.random() * 1000 + 500,
      actual: i < 20 ? Math.random() * 1000 + 500 : null,
      confidence: Math.random() * 0.3 + 0.7
    }));
  };

  const generateIntegrationsData = () => {
    return [
      { name: 'SAP ERP', status: 'healthy', uptime: 99.9, responseTime: 245 },
      { name: 'Salesforce', status: 'healthy', uptime: 99.8, responseTime: 180 },
      { name: 'Microsoft 365', status: 'warning', uptime: 98.5, responseTime: 320 },
      { name: 'Oracle DB', status: 'healthy', uptime: 99.95, responseTime: 95 },
      { name: 'RabbitMQ', status: 'healthy', uptime: 99.7, responseTime: 25 }
    ];
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '15.2K',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Response Time',
      value: '185ms',
      change: '-15ms',
      trend: 'down',
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  const alertColors = {
    critical: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button
            onClick={() => setRealTimeEnabled(!realTimeEnabled)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              realTimeEnabled
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            }`}
          >
            {realTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-lg">
                Response Time
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">
                Throughput
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Alerts</h3>
          
          <div className="space-y-4">
            {data.alerts.map((alert, index) => (
              <div key={alert.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: alertColors[alert.type] }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {alert.type}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {alert.count}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={data.alerts}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  dataKey="count"
                >
                  {data.alerts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={alertColors[entry.type]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.usage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activeUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.revenue.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Predictions</h3>
          </div>
          <span className="text-sm text-gray-500">30-day forecast</span>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Actual"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Integration Health */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Network className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Integration Health</h3>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {data.integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  integration.status === 'healthy' ? 'bg-green-500' :
                  integration.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{integration.name}</p>
                  <p className="text-sm text-gray-500">
                    {integration.uptime}% uptime • {integration.responseTime}ms avg
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {integration.status === 'healthy' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : integration.status === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {integration.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};