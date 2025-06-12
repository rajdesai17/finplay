import React, { useState } from 'react';
import { ArrowLeft, Target, Star } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface PiggyBankBuilderProps {
  onBack: () => void;
}

function PiggyBankBuilder({ onBack }: PiggyBankBuilderProps) {
  const [currentCoins, setCurrentCoins] = useState(0);
  const [goal] = useState(500);
  const [showSuccess, setShowSuccess] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const { addReward } = useUser();

  const addCoin = (value: number) => {
    if (currentCoins + value <= goal) {
      setCoinAnimation(true);
      setTimeout(() => setCoinAnimation(false), 300);
      
      const newTotal = currentCoins + value;
      setCurrentCoins(newTotal);
      
      if (newTotal >= goal) {
        setTimeout(() => {
          setShowSuccess(true);
          addReward({
            xp: 30,
            cashback: 25,
            badge: {
              id: 'savings-star',
              name: 'Savings Star',
              icon: '⭐',
              description: 'Piggy bank champion',
              earned: true
            }
          });
        }, 500);
      }
    }
  };

  const progress = (currentCoins / goal) * 100;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 flex flex-col">
        {/* Sticky Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Goal Achieved!</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[80vh] p-3 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-yellow-200">
            <div className="text-5xl mb-2 animate-bounce">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Woohoo!</h2>
            <p className="text-base text-gray-700 mb-4">
              You saved ₹{goal} for your dream bicycle! 🚲
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 text-base">What You Learned:</h3>
              <ul className="text-left space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span className="text-gray-700">Small savings add up to big dreams!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span className="text-gray-700">₹10 saved daily = ₹3,650 per year</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span className="text-gray-700">Having a goal makes saving fun!</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-200"
            >
              Play More Games!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 flex flex-col">
      {/* Sticky Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Piggy Bank Builder</h1>
        </div>
        <p className="text-pink-100 text-sm">Save coins to buy your dream bicycle! 🚲</p>
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Goal: ₹{goal}</span>
            <span>₹{currentCoins}/₹{goal}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-yellow-400 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${Math.max(progress, 8)}%` }}>
              <span className="text-xs">🪙</span>
            </div>
          </div>
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto max-h-[80vh] p-3">
        <div className="bg-white rounded-2xl p-4 shadow-xl text-center mb-4 border-2 border-pink-200">
          <div className={`text-5xl mb-2 ${coinAnimation ? 'animate-bounce' : ''}`}>🏦</div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">My Piggy Bank</h2>
          <div className="text-2xl font-bold text-green-600 mb-1">₹{currentCoins}</div>
          <p className="text-gray-600 text-sm">
            {goal - currentCoins > 0 ? `₹${goal - currentCoins} more to go!` : 'Goal reached! 🎉'}
          </p>
        </div>
        {/* Coin Buttons */}
        <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-yellow-200 mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-2 text-center">Add Coins to Your Bank!</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 5, icon: '🪙', color: 'from-yellow-400 to-yellow-600', label: 'Pocket Money' },
              { value: 10, icon: '💰', color: 'from-green-400 to-green-600', label: 'Chores Money' },
              { value: 25, icon: '🎁', color: 'from-blue-400 to-blue-600', label: 'Gift Money' },
              { value: 50, icon: '💎', color: 'from-purple-400 to-purple-600', label: 'Special Bonus' },
            ].map((coin) => (
              <button
                key={coin.value}
                onClick={() => addCoin(coin.value)}
                disabled={currentCoins + coin.value > goal}
                className={`bg-gradient-to-r ${coin.color} text-white p-3 rounded-xl font-bold text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-2xl mb-1">{coin.icon}</div>
                <div className="font-bold">₹{coin.value}</div>
                <div className="text-xs opacity-90">{coin.label}</div>
              </button>
            ))}
          </div>
        </div>
        {/* Goal Display */}
        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 border-2 border-orange-200 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚲</div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Dream Bicycle</h3>
              <p className="text-gray-600 text-xs">Save ₹{goal} to buy this awesome bike!</p>
              <div className="flex items-center gap-1 mt-1">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">{progress.toFixed(0)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
        {/* Fun Fact */}
        <div className="bg-white rounded-xl p-3 shadow-lg border border-purple-200">
          <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-sm">
            <span>💡</span>
            Fun Fact!
          </h4>
          <p className="text-gray-700 text-xs">
            If you save ₹10 every day, you'll have enough for a bicycle in just 50 days! 
            Saving little by little makes big dreams come true! ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default PiggyBankBuilder;