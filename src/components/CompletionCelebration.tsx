import React, { useEffect, useState } from 'react';
import { Trophy, Star, Gift, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';
import ConfettiEffect from './ConfettiEffect';

interface CompletionCelebrationProps {
  show: boolean;
  onClose: () => void;
}

function CompletionCelebration({ show, onClose }: CompletionCelebrationProps) {
  const { user } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const earnedBadges = user.badges.filter(b => b.earned);
  const completionPercentage = Math.round((earnedBadges.length / user.badges.length) * 100);
  const isFullyComplete = earnedBadges.length === user.badges.length;

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);

      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(confettiTimer);
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <>
      <ConfettiEffect show={showConfetti} duration={5000} />
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-bounce-in">
          <div className="text-center">
            {/* Main Trophy */}
            <div className="text-8xl mb-4 animate-wiggle">
              {isFullyComplete ? '🏆' : '🌟'}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isFullyComplete ? 'FinPlay Champion!' : 'Amazing Progress!'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isFullyComplete 
                ? "You've mastered all financial challenges! You're ready for the real world! 🚀"
                : `You've completed ${completionPercentage}% of FinPlay challenges!`
              }
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 ${
                currentStep >= 1 ? 'animate-slide-up' : 'opacity-0'
              }`}>
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{user.level}</div>
                <div className="text-sm text-gray-600">Final Level</div>
              </div>
              
              <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-200 ${
                currentStep >= 2 ? 'animate-slide-up' : 'opacity-0'
              }`}>
                <Gift className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">₹{user.cashback}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              
              <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 ${
                currentStep >= 3 ? 'animate-slide-up' : 'opacity-0'
              }`}>
                <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{earnedBadges.length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              
              <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 ${
                currentStep >= 4 ? 'animate-slide-up' : 'opacity-0'
              }`}>
                <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{user.xp}</div>
                <div className="text-sm text-gray-600">Total XP</div>
              </div>
            </div>

            {/* Achievement Message */}
            <div className={`bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 mb-6 border-2 border-indigo-200 ${
              currentStep >= 5 ? 'animate-slide-up' : 'opacity-0'
            }`}>
              <h3 className="font-bold text-gray-900 mb-2">🎓 What You've Learned:</h3>
              <ul className="text-sm text-gray-700 space-y-1 text-left">
                <li>• Smart budgeting and expense management</li>
                <li>• Credit vs cash decision making</li>
                <li>• Fraud detection and digital safety</li>
                <li>• Tax planning and investment basics</li>
                <li>• Business fundamentals and entrepreneurship</li>
              </ul>
            </div>

            {/* Call to Action */}
            <div className={`space-y-3 ${currentStep >= 6 ? 'animate-slide-up' : 'opacity-0'}`}>
              {isFullyComplete ? (
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl p-4 mb-4">
                  <h3 className="font-bold mb-2">🚀 Ready for Real World!</h3>
                  <p className="text-sm">
                    You've mastered financial literacy! Time to apply these skills in real life.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-4 mb-4">
                  <h3 className="font-bold mb-2">🎯 Keep Going!</h3>
                  <p className="text-sm">
                    Complete more challenges to become a FinPlay Champion!
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {isFullyComplete ? 'Share Your Success! 🎉' : 'Continue Learning! 📚'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompletionCelebration;