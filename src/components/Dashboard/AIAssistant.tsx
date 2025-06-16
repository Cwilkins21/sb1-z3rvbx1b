import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Mic, MicOff, Brain, Sparkles, 
  TrendingUp, AlertTriangle, FileText, Search, Zap,
  BarChart3, Users, DollarSign, Clock, Target
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
  charts?: any[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
  color: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState<'chat' | 'analysis' | 'insights'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'performance',
      title: 'System Performance',
      description: 'Analyze current system performance metrics',
      icon: TrendingUp,
      action: 'analyze system performance',
      color: 'bg-blue-500'
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      description: 'Review and prioritize current alerts',
      icon: AlertTriangle,
      action: 'show active alerts and recommendations',
      color: 'bg-red-500'
    },
    {
      id: 'revenue',
      title: 'Revenue Analysis',
      description: 'Generate revenue insights and forecasts',
      icon: DollarSign,
      action: 'analyze revenue trends and predictions',
      color: 'bg-green-500'
    },
    {
      id: 'users',
      title: 'User Behavior',
      description: 'Analyze user engagement patterns',
      icon: Users,
      action: 'analyze user behavior and engagement',
      color: 'bg-purple-500'
    },
    {
      id: 'optimization',
      title: 'Optimization',
      description: 'Find optimization opportunities',
      icon: Zap,
      action: 'suggest system optimizations',
      color: 'bg-orange-500'
    },
    {
      id: 'forecast',
      title: 'Predictive Analysis',
      description: 'Generate predictive insights',
      icon: Target,
      action: 'create predictive analysis for next 30 days',
      color: 'bg-indigo-500'
    }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "Hello! I'm your AI assistant. I can help you analyze data, generate insights, answer questions about your municipal systems, and provide recommendations. What would you like to explore today?",
        timestamp: new Date(),
        suggestions: [
          "Show me today's performance metrics",
          "What are the current system alerts?",
          "Analyze citation trends",
          "Predict next month's revenue"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(async () => {
      const response = await generateAIResponse(messageContent);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (userInput: string): Promise<Message> => {
    // Simulate AI analysis based on input
    const input = userInput.toLowerCase();
    
    let content = '';
    let suggestions: string[] = [];
    let data: any = null;
    let charts: any[] = [];

    if (input.includes('performance') || input.includes('metrics')) {
      content = "I've analyzed your system performance over the last 24 hours. Here are the key insights:\n\n• Average response time: 185ms (15% improvement)\n• System uptime: 99.9% (excellent)\n• CPU usage: 65% average (normal)\n• Memory usage: 78% average (monitor closely)\n• Error rate: 0.02% (very low)\n\nRecommendation: Consider scaling memory resources during peak hours to maintain optimal performance.";
      suggestions = [
        "Show detailed performance breakdown",
        "Compare with last week",
        "Set up performance alerts",
        "Optimize memory usage"
      ];
      charts = [
        {
          type: 'line',
          title: 'Response Time Trend',
          data: generateMockChartData('performance')
        }
      ];
    } else if (input.includes('alert') || input.includes('issue')) {
      content = "Current system alerts analysis:\n\n🔴 Critical: 2 alerts\n• Database connection pool at 95% capacity\n• API rate limit approaching threshold\n\n🟡 Warning: 8 alerts\n• High memory usage on server-02\n• Slow query detected in citations table\n\n🔵 Info: 15 alerts\n• Scheduled maintenance reminders\n• Certificate expiration notices\n\nImmediate action required for critical alerts. I can help you create an action plan.";
      suggestions = [
        "Create action plan for critical alerts",
        "Show alert history",
        "Set up alert automation",
        "Analyze alert patterns"
      ];
    } else if (input.includes('revenue') || input.includes('financial')) {
      content = "Revenue analysis for the current period:\n\n📈 Total Revenue: $2.4M (+12.5% vs last period)\n💰 Citation Revenue: $1.8M (75% of total)\n🚗 Towing Revenue: $480K (20% of total)\n📋 Permit Revenue: $120K (5% of total)\n\n🔮 30-day forecast: $850K (+8% projected growth)\n\nKey drivers: Increased citation efficiency (+15%), new digital payment options (+22% adoption), reduced processing costs (-8%).";
      suggestions = [
        "Show revenue breakdown by category",
        "Analyze payment method trends",
        "Forecast next quarter",
        "Compare with city budget"
      ];
      charts = [
        {
          type: 'bar',
          title: 'Revenue by Source',
          data: generateMockChartData('revenue')
        }
      ];
    } else if (input.includes('user') || input.includes('engagement')) {
      content = "User behavior analysis:\n\n👥 Active Users: 15.2K (+8.3% growth)\n📱 Mobile Usage: 68% (increasing trend)\n⏱️ Average Session: 12.5 minutes\n🔄 Return Rate: 78% (excellent retention)\n\nTop user actions:\n1. Citation lookup (45%)\n2. Payment processing (32%)\n3. Permit applications (15%)\n4. Account management (8%)\n\nInsight: Mobile-first approach is driving engagement. Consider optimizing desktop experience for power users.";
      suggestions = [
        "Analyze user journey",
        "Show mobile vs desktop usage",
        "Identify drop-off points",
        "Segment user behavior"
      ];
    } else if (input.includes('optimization') || input.includes('improve')) {
      content = "System optimization opportunities identified:\n\n🚀 High Impact:\n• Enable database query caching (Est. 25% performance boost)\n• Implement CDN for static assets (Est. 40% faster load times)\n• Optimize image compression (Est. 30% bandwidth savings)\n\n⚡ Medium Impact:\n• Upgrade to HTTP/3 protocol\n• Implement lazy loading for tables\n• Add database indexing for frequent queries\n\n💡 Low Impact:\n• Minify CSS/JS bundles\n• Enable gzip compression\n• Optimize font loading\n\nEstimated total improvement: 35% faster response times, 25% cost reduction.";
      suggestions = [
        "Implement high-impact optimizations",
        "Create optimization roadmap",
        "Estimate cost savings",
        "Monitor optimization results"
      ];
    } else if (input.includes('predict') || input.includes('forecast')) {
      content = "Predictive analysis for the next 30 days:\n\n📊 Citation Volume: 12,500 citations (±5% confidence)\n💵 Revenue Forecast: $850K (+8% growth)\n👥 User Growth: +1,200 new users\n⚠️ Potential Issues: 2 system bottlenecks predicted\n\n🎯 Key Predictions:\n• Peak citation day: Friday, 3rd week (weather-dependent)\n• Payment processing surge: Month-end (+40%)\n• Server load spike: Tuesday mornings (court sessions)\n\nRecommendations: Scale resources proactively, prepare for payment surge, optimize court session workflows.";
      suggestions = [
        "Show detailed forecasting model",
        "Adjust prediction parameters",
        "Set up predictive alerts",
        "Export forecast report"
      ];
      charts = [
        {
          type: 'line',
          title: 'Predicted vs Actual Trends',
          data: generateMockChartData('predictions')
        }
      ];
    } else {
      content = "I understand you're looking for insights about your municipal systems. I can help you with:\n\n• Performance monitoring and optimization\n• Revenue analysis and forecasting\n• User behavior and engagement metrics\n• System alerts and issue resolution\n• Predictive analytics and trends\n• Data visualization and reporting\n\nWhat specific area would you like to explore? I can provide detailed analysis, actionable recommendations, and help you make data-driven decisions.";
      suggestions = [
        "Analyze system performance",
        "Show revenue trends",
        "Review active alerts",
        "Generate predictive insights"
      ];
    }

    return {
      id: crypto.randomUUID(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      suggestions,
      data,
      charts
    };
  };

  const generateMockChartData = (type: string) => {
    switch (type) {
      case 'performance':
        return Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          responseTime: Math.random() * 200 + 100,
          throughput: Math.random() * 500 + 300
        }));
      case 'revenue':
        return [
          { category: 'Citations', amount: 1800000 },
          { category: 'Towing', amount: 480000 },
          { category: 'Permits', amount: 120000 }
        ];
      case 'predictions':
        return Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          predicted: Math.random() * 1000 + 500,
          actual: i < 20 ? Math.random() * 1000 + 500 : null
        }));
      default:
        return [];
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputValue("Show me today's performance metrics");
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Brain className="h-6 w-6" />
      </motion.button>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-6 w-6 mr-2" />
                  <div>
                    <h3 className="font-semibold">AI Assistant</h3>
                    <p className="text-sm opacity-90">Municipal Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-1 rounded"
                >
                  ×
                </button>
              </div>

              {/* Mode Selector */}
              <div className="flex mt-3 bg-white/20 rounded-lg p-1">
                {['chat', 'analysis', 'insights'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCurrentMode(mode as any)}
                    className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                      currentMode === mode
                        ? 'bg-white text-blue-600'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      onClick={() => handleQuickAction(action.action)}
                      className="p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-900">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    
                    {/* Charts */}
                    {message.charts && message.charts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.charts.map((chart, index) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            <p className="text-xs font-medium text-gray-600 mb-1">{chart.title}</p>
                            <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                              <BarChart3 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 p-2 rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your data..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {isListening && (
                    <div className="absolute right-2 top-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by Advanced AI
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};