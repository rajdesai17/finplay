import React, { useEffect } from 'react';
import { X, Star, Gift, Trophy } from 'lucide-react';
import { useUser } from '../context/UserContext';

function RewardPopup() {
  const { showReward, currentReward, dismissReward } = useUser();

  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => {
        dismissReward();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showReward, dismissReward]);

  if (!showReward || !currentReward) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-slide-up">
        <button
          onClick={dismissReward}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Awesome!</h2>
          <p className="text-gray-600 text-lg">You've earned rewards!</p>
        </div>

        {/* Rewards Display */}
        <div className="space-y-4 mb-8">
          {currentReward.xp > 0 && (
            <div className="flex items-center justify-center gap-3 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <Star className="w-6 h-6 text-yellow-600" />
              <span className="font-bold text-yellow-700 text-lg">+{currentReward.xp} XP</span>
            </div>
          )}

          {currentReward.cashback > 0 && (
            <div className="flex items-center justify-center gap-3 bg-green-50 rounded-2xl p-4 border border-green-200">
              <Gift className="w-6 h-6 text-green-600" />
              <span className="font-bold text-green-700 text-lg">+₹{currentReward.cashback} Cashback</span>
            </div>
          )}

          {currentReward.badge && (
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-700 text-lg">New Badge!</span>
              </div>
              <div className="text-4xl mb-3">{currentReward.badge.icon}</div>
              <div className="font-bold text-gray-900 text-lg">{currentReward.badge.name}</div>
              <div className="text-gray-600">{currentReward.badge.description}</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={dismissReward}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-lg"
        >
          Keep Learning!
        </button>
      </div>
    </div>
  );
}

export default RewardPopup;