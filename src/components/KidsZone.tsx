import React, { useState } from 'react';
import { Star, Gift } from 'lucide-react';
import PiggyBankBuilder from './games/PiggyBankBuilder';
import BarterMela from './games/BarterMela';
import SpotTheScam from './games/SpotTheScam';
import TipCoach from './TipCoach';
import DidYouKnow from './DidYouKnow';
import BadgeGallery from './BadgeGallery';
import CompletionCelebration from './CompletionCelebration';
import { useUser } from '../context/UserContext';

type Game = 'piggybank' | 'barter' | 'scam' | null;

function KidsZone() {
  const [activeGame, setActiveGame] = useState<Game>(null);
  const [showTipCoach, setShowTipCoach] = useState<Game>(null);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const { user } = useUser();

  const handleGameStart = (game: Game) => {
    setShowTipCoach(game);
  };

  const handleTipCoachClose = () => {
    if (showTipCoach) {
      setActiveGame(showTipCoach);
    }
    setShowTipCoach(null);
  };

  const handleGameBack = () => {
    setActiveGame(null);
    // Show random tip after completing game
    if (Math.random() < 0.4) {
      setShowDidYouKnow(true);
    }
    
    // Check if user completed all games
    const earnedBadges = user.badges.filter(b => b.earned).length;
    if (earnedBadges >= 3) { // Kids have fewer badges
      setShowCompletion(true);
    }
  };

  if (activeGame) {
    const games = {
      piggybank: <PiggyBankBuilder onBack={handleGameBack} />,
      barter: <BarterMela onBack={handleGameBack} />,
      scam: <SpotTheScam onBack={handleGameBack} />,
    };

    return games[activeGame];
  }

  const gameCards = [
    {
      id: 'piggybank' as Game,
      title: 'Piggy Bank Builder',
      description: 'Save coins to reach your goal!',
      icon: '🏦',
      color: 'bg-pink-50 border-pink-200',
      iconBg: 'bg-pink-100',
      ageGroup: '8-12',
    },
    {
      id: 'barter' as Game,
      title: 'Barter Mela',
      description: 'Trade sweets and toys fairly',
      icon: '🧃',
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
      ageGroup: '8-14',
    },
    {
      id: 'scam' as Game,
      title: 'Spot the Scam',
      description: 'Find the bad guys in the story',
      icon: '💡',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
      ageGroup: '10-14',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Kids Zone</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-100 rounded-xl px-4 py-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-700">{user.xp} Stars</span>
              </div>
              <div className="flex items-center gap-2 bg-green-100 rounded-xl px-4 py-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">{user.badges.filter(b => b.earned).length} Prizes</span>
              </div>
              <button
                onClick={() => setShowBadgeGallery(true)}
                className="bg-yellow-100 hover:bg-yellow-200 rounded-xl p-2 transition-colors text-xl"
              >
                🏆
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Learn about money through fun games!</p>
          
          {/* Fun Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Super Star Level {user.level}</span>
              <span className="text-gray-500">{user.xp % 100}/100 ⭐</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                style={{ width: `${Math.max((user.xp % 100), 8)}%` }}
              >
                <span className="text-xs">🌟</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Cards */}
        <div className="p-6 space-y-6">
          {gameCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleGameStart(card.id)}
              className={`bg-white rounded-3xl p-8 shadow-sm border-2 ${card.color} hover:shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
            >
              <div className="flex items-start gap-6">
                <div className={`w-24 h-24 ${card.iconBg} rounded-3xl flex items-center justify-center text-4xl shadow-sm`}>
                  {card.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                    <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                      Age {card.ageGroup}
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">{card.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <span className="text-base text-gray-600 font-semibold">+30 Stars</span>
                    </div>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                      Let's Play!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Section */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span>🏆</span>
              Your Awesome Progress!
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
                <div className="text-4xl font-bold text-pink-600 mb-2">{user.badges.filter(b => b.earned).length}</div>
                <div className="text-base text-gray-700 font-semibold">Cool Badges</div>
                <div className="text-2xl mt-2">🎖️</div>
              </div>
              <div className="text-center bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                <div className="text-4xl font-bold text-orange-600 mb-2">{user.level}</div>
                <div className="text-base text-gray-700 font-semibold">Super Level</div>
                <div className="text-2xl mt-2">🚀</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span>💡</span>
              Did You Know?
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Saving ₹10 every day means you'll have ₹3,650 by the end of the year! 
              That's enough to buy a cool bicycle! 🚲
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTipCoach && (
        <TipCoach type={showTipCoach} onClose={handleTipCoachClose} />
      )}
      
      <DidYouKnow 
        show={showDidYouKnow} 
        onClose={() => setShowDidYouKnow(false)} 
      />
      
      <BadgeGallery 
        show={showBadgeGallery} 
        onClose={() => setShowBadgeGallery(false)} 
      />
      
      <CompletionCelebration 
        show={showCompletion} 
        onClose={() => setShowCompletion(false)} 
      />
    </>
  );
}

export default KidsZone;