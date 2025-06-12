import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Zap } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface SideHustleBuilderProps {
  onBack: () => void;
}

interface Business {
  id: string;
  name: string;
  icon: string;
  initialCost: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  description: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  impact: {
    revenue?: number;
    expenses?: number;
    oneTime?: number;
  };
  type: 'positive' | 'negative' | 'neutral';
}

const businesses: Business[] = [
  {
    id: 'chai-tapri',
    name: 'Chai Tapri',
    icon: '☕',
    initialCost: 25000,
    monthlyRevenue: 18000,
    monthlyExpenses: 12000,
    description: 'A small tea stall near office complex'
  },
  {
    id: 'meesho-store',
    name: 'Meesho Reselling',
    icon: '👗',
    initialCost: 5000,
    monthlyRevenue: 12000,
    monthlyExpenses: 8000,
    description: 'Online fashion reselling business'
  },
  {
    id: 'tuition-classes',
    name: 'Tuition Classes',
    icon: '📚',
    initialCost: 15000,
    monthlyRevenue: 25000,
    monthlyExpenses: 8000,
    description: 'Home-based coaching for students'
  }
];

const randomEvents: Event[] = [
  {
    id: 'festival-season',
    title: 'Festival Season Boom!',
    description: 'Diwali season brings extra customers',
    impact: { revenue: 5000 },
    type: 'positive'
  },
  {
    id: 'rent-increase',
    title: 'Rent Increased',
    description: 'Landlord increased monthly rent',
    impact: { expenses: 2000 },
    type: 'negative'
  },
  {
    id: 'bulk-order',
    title: 'Bulk Order!',
    description: 'Corporate client placed large order',
    impact: { oneTime: 8000 },
    type: 'positive'
  },
  {
    id: 'competition',
    title: 'New Competition',
    description: 'Another business opened nearby',
    impact: { revenue: -3000 },
    type: 'negative'
  },
  {
    id: 'social-media-viral',
    title: 'Social Media Viral!',
    description: 'Your post went viral, bringing new customers',
    impact: { revenue: 4000 },
    type: 'positive'
  },
  {
    id: 'supply-shortage',
    title: 'Supply Shortage',
    description: 'Raw material prices increased',
    impact: { expenses: 1500 },
    type: 'negative'
  }
];

function SideHustleBuilder({ onBack }: SideHustleBuilderProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [bankBalance, setBankBalance] = useState(50000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [businessStarted, setBusinessStarted] = useState(false);
  const [eventHistory, setEventHistory] = useState<Event[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);
  const { addReward } = useUser();

  const startBusiness = (business: Business) => {
    if (bankBalance >= business.initialCost) {
      setSelectedBusiness(business);
      setBankBalance(prev => prev - business.initialCost);
      setMonthlyRevenue(business.monthlyRevenue);
      setMonthlyExpenses(business.monthlyExpenses);
      setBusinessStarted(true);
    }
  };

  const nextMonth = () => {
    if (!selectedBusiness) return;

    let newBalance = bankBalance;
    let newRevenue = monthlyRevenue;
    let newExpenses = monthlyExpenses;
    
    // Random event (30% chance)
    if (Math.random() < 0.3) {
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setEventHistory(prev => [...prev, randomEvent]);
      
      if (randomEvent.impact.revenue) {
        newRevenue += randomEvent.impact.revenue;
        setMonthlyRevenue(newRevenue);
      }
      
      if (randomEvent.impact.expenses) {
        newExpenses += randomEvent.impact.expenses;
        setMonthlyExpenses(newExpenses);
      }
      
      if (randomEvent.impact.oneTime) {
        newBalance += randomEvent.impact.oneTime;
      }
    }
    
    // Monthly profit/loss
    const monthlyProfit = newRevenue - newExpenses;
    newBalance += monthlyProfit;
    setTotalProfit(prev => prev + monthlyProfit);
    setBankBalance(newBalance);
    setCurrentMonth(prev => prev + 1);
    
    // End game after 12 months
    if (currentMonth >= 12) {
      setShowResult(true);
      
      const finalProfit = totalProfit + monthlyProfit;
      const roi = ((finalProfit / selectedBusiness.initialCost) * 100);
      
      let badge = undefined;
      if (roi >= 100 && newBalance >= 80000) {
        badge = {
          id: 'side-hustler',
          name: 'Side Hustler',
          icon: '🚀',
          description: 'Business building expert',
          earned: true
        };
      }

      addReward({
        xp: Math.max(50, Math.min(100, roi)),
        cashback: Math.round(finalProfit / 100),
        badge
      });
    }
  };

  const resetGame = () => {
    setSelectedBusiness(null);
    setCurrentMonth(1);
    setBankBalance(50000);
    setMonthlyRevenue(0);
    setMonthlyExpenses(0);
    setBusinessStarted(false);
    setEventHistory([]);
    setShowResult(false);
    setTotalProfit(0);
  };

  if (showResult) {
    const roi = selectedBusiness ? ((totalProfit / selectedBusiness.initialCost) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Business Results</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Final Results */}
          <div className={`rounded-3xl p-6 shadow-xl text-center text-white ${
            roi >= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' :
            roi >= 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            roi >= 0 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
            'bg-gradient-to-r from-red-400 to-red-600'
          }`}>
            <div className="text-4xl mb-3">
              {roi >= 100 ? '🏆' : roi >= 50 ? '📈' : roi >= 0 ? '💼' : '📉'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {roi >= 100 ? 'Business Success!' :
               roi >= 50 ? 'Good Growth!' :
               roi >= 0 ? 'Steady Progress!' :
               'Learning Experience!'}
            </h2>
            <div className="text-3xl font-bold">₹{bankBalance.toLocaleString()}</div>
            <p className="text-white/90">Final Bank Balance</p>
          </div>

          {/* Business Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">{selectedBusiness?.icon}</span>
              {selectedBusiness?.name} - 12 Month Summary
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">₹{selectedBusiness?.initialCost.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Initial Investment</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">₹{totalProfit.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Profit</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{roi.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">ROI</div>
              </div>
              <div className="text-center bg-orange-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{eventHistory.length}</div>
                <div className="text-sm text-gray-600">Events Handled</div>
              </div>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Final Monthly Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Revenue</span>
                <span className="font-bold text-green-600">₹{monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Monthly Expenses</span>
                <span className="font-bold text-red-600">₹{monthlyExpenses.toLocaleString()}</span>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Monthly Profit</span>
                <span className={`font-bold text-xl ${
                  monthlyRevenue - monthlyExpenses > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{(monthlyRevenue - monthlyExpenses).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Event History */}
          {eventHistory.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Business Events</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {eventHistory.map((event, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    event.type === 'positive' ? 'bg-green-50 border-green-200' :
                    event.type === 'negative' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Lessons */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Key Business Lessons</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Start small with businesses you understand well</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Track your revenue and expenses carefully</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Customer satisfaction leads to repeat business</span>
              </li>
              <li className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <span>Reinvest profits to grow your business faster</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
            >
              Try Different Business
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
            >
              More Simulations
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!businessStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Side Hustle Builder</h1>
          </div>
          <p className="text-indigo-100">Choose your business and build an empire!</p>
          
          {/* Bank Balance */}
          <div className="mt-4 bg-white/20 rounded-lg p-3">
            <div className="text-sm opacity-90">Available Capital</div>
            <div className="text-2xl font-bold">₹{bankBalance.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Side Hustle</h2>
            <p className="text-gray-600">Pick a business that matches your budget and interests</p>
          </div>

          {/* Business Options */}
          <div className="space-y-4">
            {businesses.map(business => {
              const canAfford = bankBalance >= business.initialCost;
              const monthlyProfit = business.monthlyRevenue - business.monthlyExpenses;
              
              return (
                <div
                  key={business.id}
                  className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                    canAfford ? 'border-gray-200 hover:border-indigo-300' : 'border-red-200 opacity-60'
                  } transition-all duration-200`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-3">
                      {business.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{business.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">₹{business.initialCost.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Initial Cost</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{business.description}</p>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center bg-green-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-green-600">₹{business.monthlyRevenue.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Revenue/month</div>
                        </div>
                        <div className="text-center bg-red-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-red-600">₹{business.monthlyExpenses.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Expenses/month</div>
                        </div>
                        <div className="text-center bg-blue-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-blue-600">₹{monthlyProfit.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Profit/month</div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => startBusiness(business)}
                        disabled={!canAfford}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          canAfford
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Start This Business' : 'Insufficient Funds'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-200">
            <h4 className="font-bold text-gray-900 mb-2">💡 Business Tips</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Consider monthly profit, not just initial cost</li>
              <li>• Lower initial investment = lower risk</li>
              <li>• Higher profit margins = faster growth</li>
              <li>• Random events will affect your business!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={resetGame} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">{selectedBusiness?.icon}</span>
            {selectedBusiness?.name}
          </h1>
        </div>
        <p className="text-indigo-100">Month {currentMonth} of 12</p>
        
        {/* Status Bar */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-2xl">₹{bankBalance.toLocaleString()}</div>
            <div className="text-indigo-200">Bank Balance</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl">₹{(monthlyRevenue - monthlyExpenses).toLocaleString()}</div>
            <div className="text-indigo-200">Monthly Profit</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl">{12 - currentMonth}</div>
            <div className="text-indigo-200">Months Left</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Monthly Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Revenue
              </span>
              <span className="font-bold text-green-600">₹{monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                Expenses
              </span>
              <span className="font-bold text-red-600">₹{monthlyExpenses.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Net Profit</span>
              <span className={`font-bold text-xl ${
                monthlyRevenue - monthlyExpenses > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{(monthlyRevenue - monthlyExpenses).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        {eventHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Recent Business Events</h3>
            <div className="space-y-2">
              {eventHistory.slice(-3).map((event, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  event.type === 'positive' ? 'bg-green-50 border-green-200' :
                  event.type === 'negative' ? 'bg-red-50 border-red-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4">Business Progress</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-600">₹{totalProfit.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Profit So Far</div>
            </div>
            <div className="text-center bg-purple-50 rounded-lg p-3">
              <div className="text-xl font-bold text-purple-600">
                {selectedBusiness ? ((totalProfit / selectedBusiness.initialCost) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-gray-600">Return on Investment</div>
            </div>
          </div>
        </div>

        {/* Next Month Button */}
        <button
          onClick={nextMonth}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
        >
          Next Month →
        </button>

        {/* Business Tips */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 border-2 border-green-200">
          <h4 className="font-bold text-gray-900 mb-2">📈 Growth Strategy</h4>
          <p className="text-sm text-gray-700">
            Keep track of your monthly profits and be prepared for unexpected events. 
            The goal is to grow your business and maximize returns over 12 months!
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideHustleBuilder;