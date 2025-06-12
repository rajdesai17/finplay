import React, { useState, useEffect } from 'react';
import { X, Brain, Star } from 'lucide-react';

const funFacts = [
  {
    title: "Compound Interest Magic! ✨",
    fact: "If you save ₹100 every month from age 20, you'll have ₹15 lakhs by age 60!",
    emoji: "💰"
  },
  {
    title: "UPI Revolution! 📱",
    fact: "India processes 8 billion UPI transactions monthly - more than the rest of the world combined!",
    emoji: "🚀"
  },
  {
    title: "Emergency Fund Power! 🛡️",
    fact: "Having 6 months of expenses saved can help you sleep peacefully during tough times!",
    emoji: "😴"
  },
  {
    title: "Credit Score Secret! 📊",
    fact: "Paying your credit card bill on time for 6 months can improve your score by 100+ points!",
    emoji: "📈"
  },
  {
    title: "SIP Success Story! 🎯",
    fact: "A ₹1000 monthly SIP for 20 years can grow to ₹50+ lakhs with good mutual funds!",
    emoji: "🌟"
  },
  {
    title: "Tax Saving Tip! 💡",
    fact: "Section 80C can save you up to ₹46,800 in taxes every year - that's a free vacation!",
    emoji: "🏖️"
  }
];

interface DidYouKnowProps {
  show: boolean;
  onClose: () => void;
}

function DidYouKnow({ show, onClose }: DidYouKnowProps) {
  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setCurrentFact(Math.floor(Math.random() * funFacts.length));
      setIsVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!show) return null;

  const fact = funFacts[currentFact];

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
          <div className="text-8xl mb-4 animate-wiggle">{fact.emoji}</div>
          <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Brain className="w-4 h-4" />
            <span>Did You Know?</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">{fact.title}</h3>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <p className="text-gray-700 leading-relaxed text-center">{fact.fact}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setCurrentFact((prev) => (prev + 1) % funFacts.length);
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            <Star className="w-4 h-4 inline mr-2" />
            More Facts
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Got It! 👍
          </button>
        </div>
      </div>
    </div>
  );
}

export default DidYouKnow;