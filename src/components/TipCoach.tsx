import React, { useState, useEffect } from 'react';
import { X, Lightbulb, DollarSign, Shield, TrendingUp } from 'lucide-react';

interface TipCoachProps {
  type: 'budget' | 'emi' | 'freelancer' | 'upi' | 'tax' | 'sidehustle' | 'piggybank' | 'barter' | 'scam';
  onClose: () => void;
}

const coachData = {
  budget: {
    name: "Budget Buddy",
    avatar: "💰",
    tip: "Smart budgeting is like planning a party - allocate money for needs first, then wants!",
    icon: DollarSign,
    color: "bg-green-500"
  },
  emi: {
    name: "Credit Coach",
    avatar: "🛍️",
    tip: "Remember: EMIs cost extra due to interest. Cash is king when you can afford it!",
    icon: TrendingUp,
    color: "bg-blue-500"
  },
  freelancer: {
    name: "Freelance Friend",
    avatar: "🧑‍💼",
    tip: "Freelancing tip: Always keep 3-6 months of expenses saved for delayed payments!",
    icon: TrendingUp,
    color: "bg-purple-500"
  },
  upi: {
    name: "UPI Guardian",
    avatar: "🛡️",
    tip: "Golden rule: Never send money to receive money. Real prizes don't need fees!",
    icon: Shield,
    color: "bg-red-500"
  },
  tax: {
    name: "Tax Tiger",
    avatar: "🐅",
    tip: "Tax saving isn't just about deductions - it's about smart financial planning!",
    icon: DollarSign,
    color: "bg-orange-500"
  },
  sidehustle: {
    name: "Business Buddy",
    avatar: "🚀",
    tip: "Start small, think big! Every successful business began with a single step.",
    icon: TrendingUp,
    color: "bg-indigo-500"
  },
  piggybank: {
    name: "Savings Star",
    avatar: "⭐",
    tip: "Every rupee saved is a step closer to your dreams! Small amounts add up big!",
    icon: DollarSign,
    color: "bg-pink-500"
  },
  barter: {
    name: "Trade Teacher",
    avatar: "🤝",
    tip: "Fair trading makes everyone happy! Always think about what's valuable to others.",
    icon: TrendingUp,
    color: "bg-orange-500"
  },
  scam: {
    name: "Safety Superhero",
    avatar: "🦸",
    tip: "Trust your instincts! If something feels too good to be true, it probably is.",
    icon: Shield,
    color: "bg-green-500"
  }
};

function TipCoach({ type, onClose }: TipCoachProps) {
  const [isVisible, setIsVisible] = useState(false);
  const coach = coachData[type];
  const Icon = coach.icon;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="text-8xl mb-4 animate-bounce-in">{coach.avatar}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{coach.name}</h3>
          <div className={`inline-flex items-center gap-2 ${coach.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
            <Icon className="w-4 h-4" />
            <span>Your Guide</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 leading-relaxed">{coach.tip}</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className={`w-full ${coach.color} hover:opacity-90 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg`}
        >
          Let's Start Learning! 🎯
        </button>
      </div>
    </div>
  );
}

export default TipCoach;