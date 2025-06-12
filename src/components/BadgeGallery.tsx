import React from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface BadgeGalleryProps {
  show: boolean;
  onClose: () => void;
}

function BadgeGallery({ show, onClose }: BadgeGalleryProps) {
  const { user } = useUser();

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Badge Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {user.badges.map((badge, index) => (
            <div
              key={badge.id}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                badge.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {badge.earned ? (
                <div className="text-center">
                  <div className="text-5xl mb-3 animate-coin-flip">{badge.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-3 filter grayscale">
                    <Lock className="w-10 h-10 mx-auto text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-500 mb-2">{badge.name}</h3>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                  <div className="text-xs text-gray-400 mt-2">🔒 Locked</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">
              {user.badges.filter(b => b.earned).length} / {user.badges.length} Badges Earned
            </h3>
            <p className="text-gray-600">
              Complete more simulations to unlock all badges!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105"
        >
          Keep Collecting! 🏆
        </button>
      </div>
    </div>
  );
}

export default BadgeGallery;