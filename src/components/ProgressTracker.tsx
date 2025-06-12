import React from 'react';
import { Star, Trophy, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface ProgressTrackerProps {
  showInHeader?: boolean;
}

function ProgressTracker({ showInHeader = false }: ProgressTrackerProps) {
  const { user } = useUser();
  const progressPercentage = (user.xp % 100);
  const nextLevelXP = 100;

  if (showInHeader) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 border border-white/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-bold text-white">Level {user.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-medium text-white">{user.badges.filter(b => b.earned).length} Badges</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full progress-fill relative overflow-hidden"
              style={{ width: `${Math.max(progressPercentage, 8)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/80 mt-1">
            <span>{user.xp % 100} XP</span>
            <span>{nextLevelXP} XP</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-100 animate-slide-up">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2 animate-bounce-in">🎯</div>
        <h3 className="text-xl font-bold text-gray-900">Your Progress</h3>
        <p className="text-gray-600">Keep learning to level up!</p>
      </div>

      <div className="space-y-4">
        {/* Level Progress */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Level {user.level}
            </span>
            <span className="text-sm text-gray-600">{user.xp % 100}/{nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full progress-fill relative overflow-hidden"
              style={{ width: `${Math.max(progressPercentage, 5)}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-blue-50 rounded-xl p-3 transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-blue-600">{user.xp}</div>
            <div className="text-xs text-gray-600">Total XP</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl p-3 transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-green-600">₹{user.cashback}</div>
            <div className="text-xs text-gray-600">Earned</div>
          </div>
          <div className="text-center bg-orange-50 rounded-xl p-3 transform hover:scale-105 transition-transform">
            <div className="text-2xl font-bold text-orange-600">{user.badges.filter(b => b.earned).length}</div>
            <div className="text-xs text-gray-600">Badges</div>
          </div>
        </div>

        {/* Next Level Preview */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-3 border-2 border-indigo-200">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="font-semibold text-indigo-900">Next Level: {user.level + 1}</div>
              <div className="text-sm text-indigo-700">
                {nextLevelXP - (user.xp % 100)} XP to go!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;