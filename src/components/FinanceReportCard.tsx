import React from 'react';
import { useUser } from '../context/UserContext';
import { Star, Award, TrendingUp } from 'lucide-react';

const LEVELS = [
  { min: 0, name: 'Budget Rookie' },
  { min: 2, name: 'Fraud Buster' },
  { min: 4, name: 'Tax Champ' },
  { min: 6, name: 'Side Hustler' },
  { min: 8, name: 'Finance Pro' },
];

const TIPS = [
  'Track your spending to avoid surprises!',
  'Always double-check UPI requests.',
  'Save before you spend, even small amounts.',
  'Understand your tax basics early!',
  'Every rupee saved is a rupee earned.',
  'Compare before you buy or invest.',
  'Ask questions if you don\'t understand a financial term.',
];

function getLevelName(badgesCount: number) {
  let level = LEVELS[0].name;
  for (const l of LEVELS) {
    if (badgesCount >= l.min) level = l.name;
  }
  return level;
}

function getRandomTips(count = 2) {
  const shuffled = [...TIPS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function FinanceReportCard({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const badgesCount = user.badges.filter(b => b.earned).length;
  const levelName = getLevelName(badgesCount);
  const progress = Math.min((badgesCount / user.badges.length) * 100, 100);
  const tips = getRandomTips(2);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-up relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close report card"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">📜</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Finance Report Card</h2>
          <div className="text-gray-600 text-sm">Name: <span className="font-semibold">You</span></div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-800">Level:</span>
            <span className="text-blue-700 font-bold">{levelName}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-green-400 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{badgesCount} games</span>
            <span>{user.badges.length} total</span>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-gray-800">Badges:</span>
            <span className="text-purple-700 font-bold">{badgesCount}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-gray-800">Tips for You:</span>
          </div>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-2xl font-bold text-lg shadow-md transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinanceReportCard; 