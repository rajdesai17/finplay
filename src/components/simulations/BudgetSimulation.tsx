import React, { useState } from 'react';
import { ArrowLeft, PieChart, CheckCircle } from 'lucide-react';
import { PieChart as Chart, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useUser } from '../../context/UserContext';

interface BudgetSimulationProps {
  onBack: () => void;
}

function BudgetSimulation({ onBack }: BudgetSimulationProps) {
  const [salary] = useState(15000);
  const [rent, setRent] = useState(6000);
  const [food, setFood] = useState(3000);
  const [transport, setTransport] = useState(1500);
  const [entertainment, setEntertainment] = useState(2000);
  const [showResult, setShowResult] = useState(false);
  const { addReward } = useUser();
  const [showInstructions, setShowInstructions] = useState(false);

  const savings = salary - rent - food - transport - entertainment;
  const savingsPercentage = (savings / salary) * 100;

  const data = [
    { name: 'Rent', value: rent, color: '#ef4444' },
    { name: 'Food', value: food, color: '#f97316' },
    { name: 'Transport', value: transport, color: '#eab308' },
    { name: 'Entertainment', value: entertainment, color: '#8b5cf6' },
    { name: 'Savings', value: Math.max(savings, 0), color: '#10b981' },
  ];

  const handleSubmit = () => {
    setShowResult(true);
    
    let badge = undefined;
    if (savingsPercentage >= 20) {
      badge = {
        id: 'budget-boss',
        name: 'Budget Boss',
        icon: '💰',
        description: 'Master of budgeting',
        earned: true
      };
    }

    addReward({
      xp: savingsPercentage >= 20 ? 75 : savingsPercentage >= 10 ? 50 : 25,
      cashback: Math.floor(savings / 10),
      badge
    });
  };

  const getAdvice = () => {
    if (savingsPercentage >= 20) {
      return {
        title: "Excellent Budget Management! 🎉",
        message: "You're saving 20%+ of your income - that's fantastic! You're on track to build a strong emergency fund.",
        color: "bg-green-500",
        emoji: "🌟"
      };
    } else if (savingsPercentage >= 10) {
      return {
        title: "Good Start! 👍",
        message: "You're saving 10%+ which is good. Try to reduce entertainment or transport costs to save more.",
        color: "bg-yellow-500",
        emoji: "👌"
      };
    } else if (savings > 0) {
      return {
        title: "Need Improvement 💪",
        message: "You're saving very little. Consider reducing non-essential expenses to build an emergency fund.",
        color: "bg-orange-500",
        emoji: "⚠️"
      };
    } else {
      return {
        title: "Budget Crisis! 🚨",
        message: "You're overspending! Reduce entertainment and find cheaper alternatives for transport and food.",
        color: "bg-red-500",
        emoji: "🚨"
      };
    }
  };

  if (showResult) {
    const advice = getAdvice();
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Budget Results</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto max-h-[80vh] p-3 space-y-4">
          {/* Result Card */}
          <div className={`${advice.color} text-white rounded-2xl p-4 text-center shadow-lg`}> 
            <div className="text-4xl mb-2">{advice.emoji}</div>
            <h2 className="text-lg font-bold mb-1">{advice.title}</h2>
            <p className="text-white/90 text-base">{advice.message}</p>
          </div>

          {/* Savings Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 text-base">Your Budget Summary</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center bg-green-50 rounded-lg p-2 border border-green-200">
                <div className="text-xl font-bold text-green-600">₹{Math.max(savings, 0)}</div>
                <div className="text-gray-600 text-xs">Monthly Savings</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-2 border border-blue-200">
                <div className="text-xl font-bold text-blue-600">{savingsPercentage.toFixed(1)}%</div>
                <div className="text-gray-600 text-xs">Savings Rate</div>
              </div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <Chart data={data}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Legend />
                </Chart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-base">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Next Steps
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-gray-700">Try to save at least 20% of your income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-gray-700">Build an emergency fund of 6 months expenses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-gray-700">Consider cooking at home to reduce food costs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span className="text-gray-700">Look for free entertainment options in your city</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sticky Bottom Button */}
        <div className="bg-white border-t border-gray-200 p-3 sticky bottom-0 z-10">
          <button
            onClick={onBack}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-bold text-base transition-all duration-200 hover:shadow-lg"
          >
            Try Another Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Budget ₹15K Salary</h1>
          <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-gray-100 rounded-xl font-bold text-blue-900 text-sm shadow border border-blue-300" title="How to Play?">
            How to Play?
          </button>
        </div>
        <p className="text-gray-600 text-sm">Allocate your first salary wisely</p>
      </div>
      {showInstructions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-blue-200 relative">
            <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
            <div className="text-4xl mb-2">🤔</div>
            <h2 className="font-bold text-lg mb-2">How to Play</h2>
            <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
              <li>Your goal: Allocate your ₹15,000 salary across rent, food, transport, and entertainment.</li>
              <li>Use the sliders to adjust how much you spend in each category.</li>
              <li>Try to maximize your savings! Aim for at least 20% savings for a badge.</li>
              <li>Submit your budget to see your results and advice.</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
          </div>
        </div>
      )}
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto max-h-[80vh] p-3 space-y-4">
        {/* Salary Display */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center">
          <h2 className="text-base font-bold text-gray-900 mb-1">Monthly Salary</h2>
          <div className="text-2xl font-bold text-green-600">₹{salary.toLocaleString()}</div>
        </div>

        {/* Budget Sliders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 text-base">Allocate Your Money</h3>
          <div className="space-y-4">
            {/* Rent */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-gray-700 text-sm">🏠 Rent</label>
                <span className="font-bold text-red-600 text-sm">₹{rent}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="3000"
                  max="10000"
                  step="500"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${((rent - 3000) / (10000 - 3000)) * 100}%, #fecaca ${((rent - 3000) / (10000 - 3000)) * 100}%, #fecaca 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹3,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Food */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-gray-700 text-sm">🍽️ Food</label>
                <span className="font-bold text-orange-600 text-sm">₹{food}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1500"
                  max="6000"
                  step="250"
                  value={food}
                  onChange={(e) => setFood(Number(e.target.value))}
                  className="w-full h-3 bg-orange-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((food - 1500) / (6000 - 1500)) * 100}%, #fed7aa ${((food - 1500) / (6000 - 1500)) * 100}%, #fed7aa 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹1,500</span>
                <span>₹6,000</span>
              </div>
            </div>

            {/* Transport */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-gray-700 text-sm">�� Transport</label>
                <span className="font-bold text-yellow-600 text-sm">₹{transport}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="250"
                  value={transport}
                  onChange={(e) => setTransport(Number(e.target.value))}
                  className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #eab308 0%, #eab308 ${((transport - 500) / (3000 - 500)) * 100}%, #fef3c7 ${((transport - 500) / (3000 - 500)) * 100}%, #fef3c7 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹500</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Entertainment */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-gray-700 text-sm">🎬 Entertainment</label>
                <span className="font-bold text-purple-600 text-sm">₹{entertainment}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="250"
                  value={entertainment}
                  onChange={(e) => setEntertainment(Number(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((entertainment - 500) / (4000 - 500)) * 100}%, #e9d5ff ${((entertainment - 500) / (4000 - 500)) * 100}%, #e9d5ff 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>₹500</span>
                <span>₹4,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Display */}
        <div className={`rounded-2xl p-6 shadow-sm border-2 ${savings >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-xl">💰 Savings</h3>
              <p className="text-gray-600">
                {savings >= 0 ? 'Great job!' : 'You\'re overspending!'}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{savings}
              </div>
              <div className="text-gray-600">
                {savingsPercentage.toFixed(1)}% of salary
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={savings < 0}
          className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-lg"
        >
          {savings >= 0 ? 'Submit Budget' : 'Balance Your Budget First!'}
        </button>
      </div>
    </div>
  );
}

export default BudgetSimulation;