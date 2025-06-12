import React, { useState } from 'react';
import { ArrowLeft, Star, TrendingUp } from 'lucide-react';
import BudgetSimulation from './simulations/BudgetSimulation';
import EMIChallenge from './simulations/EMIChallenge';
import FreelancerLife from './simulations/FreelancerLife';
import UPIScamAlert from './simulations/UPIScamAlert';
import TaxReturnGame from './simulations/TaxReturnGame';
import SideHustleBuilder from './simulations/SideHustleBuilder';
import TipCoach from './TipCoach';
import DidYouKnow from './DidYouKnow';
import BadgeGallery from './BadgeGallery';
import CompletionCelebration from './CompletionCelebration';
import FinanceReportCard from './FinanceReportCard';
import { useUser } from '../context/UserContext';

type Simulation = 'budget' | 'emi' | 'freelancer' | 'upi' | 'tax' | 'sidehustle' | null;

function YouthZone() {
  const [activeSimulation, setActiveSimulation] = useState<Simulation>(null);
  const [showTipCoach, setShowTipCoach] = useState<Simulation>(null);
  const [showDidYouKnow, setShowDidYouKnow] = useState(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { user } = useUser();

  const handleSimulationStart = (simulation: Simulation) => {
    setShowTipCoach(simulation);
  };

  const handleTipCoachClose = () => {
    if (showTipCoach) {
      setActiveSimulation(showTipCoach);
    }
    setShowTipCoach(null);
  };

  const handleSimulationBack = () => {
    setActiveSimulation(null);
    // Show random tip after completing simulation
    if (Math.random() < 0.3) {
      setShowDidYouKnow(true);
    }
    
    // Check if user completed all simulations
    const earnedBadges = user.badges.filter(b => b.earned).length;
    if (earnedBadges >= user.badges.length) {
      setShowCompletion(true);
    }
  };

  if (activeSimulation) {
    const simulations = {
      budget: <BudgetSimulation onBack={handleSimulationBack} />,
      emi: <EMIChallenge onBack={handleSimulationBack} />,
      freelancer: <FreelancerLife onBack={handleSimulationBack} />,
      upi: <UPIScamAlert onBack={handleSimulationBack} />,
      tax: <TaxReturnGame onBack={handleSimulationBack} />,
      sidehustle: <SideHustleBuilder onBack={handleSimulationBack} />,
    };

    return simulations[activeSimulation];
  }

  const simulationCards = [
    {
      id: 'budget' as Simulation,
      title: 'Budget ₹15K Salary',
      description: 'Manage your first salary wisely',
      icon: '💸',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
      difficulty: 'Easy',
      difficultyColor: 'bg-green-100 text-green-700',
    },
    {
      id: 'emi' as Simulation,
      title: 'EMI Challenge',
      description: 'Credit vs Cash - Make smart choices',
      icon: '🛍️',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      difficulty: 'Medium',
      difficultyColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'freelancer' as Simulation,
      title: 'Freelancer Life',
      description: 'Handle delayed payments & taxes',
      icon: '🧑‍💼',
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
      difficulty: 'Medium',
      difficultyColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'upi' as Simulation,
      title: 'UPI Scam Alert',
      description: 'Spot fraudulent transactions',
      icon: '📱',
      color: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      difficulty: 'Easy',
      difficultyColor: 'bg-green-100 text-green-700',
    },
    {
      id: 'tax' as Simulation,
      title: 'Tax Return Mini-Game',
      description: 'File your first ITR',
      icon: '📃',
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-100 text-red-700',
    },
    {
      id: 'sidehustle' as Simulation,
      title: 'Side Hustle Builder',
      description: 'Start your own business',
      icon: '📊',
      color: 'bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-100',
      difficulty: 'Hard',
      difficultyColor: 'bg-red-100 text-red-700',
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Youth Zone</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">{user.xp} XP</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-gray-700">₹{user.cashback}</span>
              </div>
              <button
                onClick={() => setShowBadgeGallery(true)}
                className="bg-gray-100 hover:bg-gray-200 rounded-xl p-2 transition-colors"
              >
                🏆
              </button>
              <button onClick={() => setShowInstructions(true)} className="px-3 py-2 bg-white/20 hover:bg-gray-100 rounded-xl font-bold text-blue-900 text-sm shadow border border-blue-300" title="How to Play?">
                How to Play?
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Master real-world financial challenges</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Level {user.level}</span>
              <span className="text-gray-500">{user.xp % 100}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max((user.xp % 100), 4)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Report Card Button (demo/testing) */}
          {user.badges.filter(b => b.earned).length >= 3 && (
            <button
              onClick={() => setShowReportCard(true)}
              className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-xl font-semibold text-sm shadow border border-blue-200 transition-all duration-200"
            >
              View My Finance Report Card
            </button>
          )}
        </div>

        {/* Simulation Cards */}
        <div className="p-6 space-y-4">
          {simulationCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleSimulationStart(card.id)}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${card.color} hover:shadow-md transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.difficultyColor}`}>
                      {card.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-base mb-4">{card.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 font-medium">+50 XP</span>
                    </div>
                    <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg">
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{user.badges.filter(b => b.earned).length}</div>
                <div className="text-sm text-gray-600 font-medium">Badges Earned</div>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{user.level}</div>
                <div className="text-sm text-gray-600 font-medium">Current Level</div>
              </div>
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-purple-600">₹{user.cashback}</div>
                <div className="text-sm text-gray-600 font-medium">Total Earned</div>
              </div>
            </div>
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
      
      {showReportCard && (
        <FinanceReportCard onClose={() => setShowReportCard(false)} />
      )}

      {showInstructions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-blue-200 relative">
            <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
            <div className="text-4xl mb-2">🤔</div>
            <h2 className="font-bold text-lg mb-2">How to Play</h2>
            <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
              <li>Welcome to Youth Zone! Here you can try real-life money challenges.</li>
              <li>Click a card to start a simulation (like budgeting, taxes, or spotting scams).</li>
              <li>Each simulation teaches you a new skill—complete them to earn XP, cashback, and badges.</li>
              <li>Check your progress and unlock your Finance Report Card!</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
          </div>
        </div>
      )}
    </>
  );
}

export default YouthZone;