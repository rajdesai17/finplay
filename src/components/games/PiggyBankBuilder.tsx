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
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 pb-20">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Goal Achieved!</h1>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Woohoo!</h2>
            <p className="text-xl text-gray-700 mb-6">
              You saved ₹{goal} for your dream bicycle! 🚲
            </p>
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">What You Learned:</h3>
              <ul className="text-left space-y-2">
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
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
            >
              Play More Games!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Piggy Bank Builder</h1>
        </div>
        <p className="text-pink-100">Save coins to buy your dream bicycle! 🚲</p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Goal: ₹{goal}</span>
            <span>₹{currentCoins}/₹{goal}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div 
              className="bg-yellow-400 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${Math.max(progress, 8)}%` }}
            >
              <span className="text-xs">🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* Piggy Bank Display */}
      <div className="p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center mb-6 border-4 border-pink-200">
          <div className={`text-8xl mb-4 ${coinAnimation ? 'animate-bounce' : ''}`}>
            🏦
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Piggy Bank</h2>
          <div className="text-4xl font-bold text-green-600 mb-2">₹{currentCoins}</div>
          <p className="text-gray-600">
            {goal - currentCoins > 0 ? `₹${goal - currentCoins} more to go!` : 'Goal reached! 🎉'}
          </p>
        </div>

        {/* Coin Buttons */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Add Coins to Your Bank!</h3>
          
          <div className="grid grid-cols-2 gap-4">
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
                className={`bg-gradient-to-r ${coin.color} text-white p-4 rounded-2xl font-bold text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-3xl mb-2">{coin.icon}</div>
                <div className="font-bold">₹{coin.value}</div>
                <div className="text-xs opacity-90">{coin.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Goal Display */}
        <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl p-6 border-4 border-orange-200">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🚲</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Dream Bicycle</h3>
              <p className="text-gray-600">Save ₹{goal} to buy this awesome bike!</p>
              <div className="flex items-center gap-2 mt-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-600 font-medium">{progress.toFixed(0)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-lg border-2 border-purple-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Fun Fact!
          </h4>
          <p className="text-gray-700 text-sm">
            If you save ₹10 every day, you'll have enough for a bicycle in just 50 days! 
            Saving little by little makes big dreams come true! ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default PiggyBankBuilder;