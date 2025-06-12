import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, BarChart3 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface EMIChallengeProps {
  onBack: () => void;
}

interface Purchase {
  item: string;
  price: number;
  urgency: 'High' | 'Medium' | 'Low';
  icon: string;
}

const purchases: Purchase[] = [
  { item: 'Latest iPhone', price: 80000, urgency: 'Low', icon: '📱' },
  { item: 'Laptop for Studies', price: 45000, urgency: 'High', icon: '💻' },
  { item: 'Designer Shoes', price: 12000, urgency: 'Low', icon: '👟' },
  { item: 'Medical Emergency', price: 25000, urgency: 'High', icon: '🏥' },
  { item: 'Gaming Console', price: 35000, urgency: 'Low', icon: '🎮' },
];

function EMIChallenge({ onBack }: EMIChallengeProps) {
  const [currentPurchase, setCurrentPurchase] = useState(0);
  const [decisions, setDecisions] = useState<Array<{
    item: string;
    choice: 'cash' | 'emi' | 'skip';
    score: number;
  }>>([]);
  const [showResult, setShowResult] = useState(false);
  const [creditScore, setCreditScore] = useState(750);
  const [cashAvailable] = useState(50000);
  const { addReward } = useUser();
  const [showInstructions, setShowInstructions] = useState(false);

  const purchase = purchases[currentPurchase];

  const calculateScore = (choice: 'cash' | 'emi' | 'skip', item: Purchase) => {
    if (choice === 'cash') {
      if (item.price <= cashAvailable * 0.3) return 10; // Good if affordable
      if (item.urgency === 'High') return 8; // Okay for urgent needs
      return 4; // Poor if depletes savings
    }
    
    if (choice === 'emi') {
      if (item.urgency === 'High') return 7; // Acceptable for needs
      if (item.price > 50000) return 3; // Poor for expensive wants
      return 5; // Average for moderate purchases
    }
    
    if (choice === 'skip') {
      if (item.urgency === 'Low') return 10; // Excellent for wants
      if (item.urgency === 'High') return 2; // Poor for needs
      return 6; // Okay for medium urgency
    }
    
    return 0;
  };

  const handleDecision = (choice: 'cash' | 'emi' | 'skip') => {
    const score = calculateScore(choice, purchase);
    
    setDecisions(prev => [...prev, {
      item: purchase.item,
      choice,
      score
    }]);

    // Affect credit score
    if (choice === 'emi') {
      setCreditScore(prev => Math.max(prev - 10, 300));
    } else if (choice === 'skip' && purchase.urgency === 'Low') {
      setCreditScore(prev => Math.min(prev + 5, 900));
    }

    if (currentPurchase < purchases.length - 1) {
      setCurrentPurchase(prev => prev + 1);
    } else {
      setShowResult(true);
      
      const totalScore = decisions.reduce((sum, d) => sum + d.score, 0) + score;
      const avgScore = totalScore / purchases.length;
      
      let badge = undefined;
      if (avgScore >= 8) {
        badge = {
          id: 'budget-boss',
          name: 'Budget Boss',
          icon: '💰',
          description: 'Master of smart spending',
          earned: true
        };
      }

      addReward({
        xp: Math.round(avgScore * 10),
        cashback: Math.round(avgScore * 5),
        badge
      });
    }
  };

  const getChoiceText = (choice: 'cash' | 'emi' | 'skip') => {
    switch (choice) {
      case 'cash': return 'Pay Full Cash';
      case 'emi': return 'Buy on EMI';
      case 'skip': return 'Skip for Now';
    }
  };

  const getChoiceColor = (choice: 'cash' | 'emi' | 'skip') => {
    switch (choice) {
      case 'cash': return 'from-green-400 to-green-600';
      case 'emi': return 'from-orange-400 to-orange-600';
      case 'skip': return 'from-blue-400 to-blue-600';
    }
  };

  if (showResult) {
    const totalScore = decisions.reduce((sum, d) => sum + d.score, 0);
    const avgScore = totalScore / purchases.length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">EMI Challenge Results</h1>
            <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-blue-900 text-sm shadow border border-blue-300" title="How to Play?">
              How to Play?
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Card */}
          <div className={`rounded-3xl p-6 shadow-xl text-center ${
            avgScore >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
            avgScore >= 6 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            'bg-gradient-to-r from-red-400 to-red-600'
          } text-white`}>
            <div className="text-4xl mb-3">
              {avgScore >= 8 ? '🏆' : avgScore >= 6 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {avgScore >= 8 ? 'Financial Genius!' : avgScore >= 6 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <div className="text-3xl font-bold">{avgScore.toFixed(1)}/10</div>
            <p className="text-white/90">Average Decision Score</p>
          </div>

          {/* Credit Score */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Your Credit Score Impact
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span>Credit Score</span>
              <span className={`font-bold ${
                creditScore >= 750 ? 'text-green-600' :
                creditScore >= 650 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {creditScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  creditScore >= 750 ? 'bg-green-500' :
                  creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(creditScore / 900) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {creditScore >= 750 ? 'Excellent! Banks will offer you the best rates.' :
               creditScore >= 650 ? 'Good. You can get loans but rates may be higher.' :
               'Poor. Work on improving your credit habits.'}
            </p>
          </div>

          {/* Decision Review */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Your Decisions</h3>
            <div className="space-y-3">
              {decisions.map((decision, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{purchases[index].icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{decision.item}</div>
                      <div className="text-sm text-gray-600">{getChoiceText(decision.choice)}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    decision.score >= 8 ? 'bg-green-100 text-green-600' :
                    decision.score >= 6 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {decision.score}/10
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Learnings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Key Learnings</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Use cash for small purchases to avoid EMI interest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>EMIs are okay for urgent needs, but avoid for wants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Skipping unnecessary purchases improves your credit score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Always maintain an emergency fund before big purchases</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
          >
            Try Another Simulation
          </button>
        </div>
        {showInstructions && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-blue-200 relative">
              <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
              <div className="text-4xl mb-2">🤔</div>
              <h2 className="font-bold text-lg mb-2">How to Play</h2>
              <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
                <li>Your goal: Make smart choices for each purchase (cash, EMI, or skip).</li>
                <li>Think about urgency, price, and your available cash.</li>
                <li>Each decision affects your score and credit score.</li>
                <li>Try to get the highest average score for a badge!</li>
              </ul>
              <button onClick={() => setShowInstructions(false)} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">EMI Challenge</h1>
          <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-blue-900 text-sm shadow border border-blue-300" title="How to Play?">
            How to Play?
          </button>
        </div>
        <p className="text-blue-100">Make smart choices: Cash vs EMI vs Skip</p>
        
        {/* Progress */}
        <div className="mt-4 flex justify-between text-sm">
          <span>Purchase {currentPurchase + 1} of {purchases.length}</span>
          <span>Credit Score: {creditScore}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentPurchase + 1) / purchases.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Purchase Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl text-center border-4 border-blue-200">
          <div className="text-6xl mb-4">{purchase.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{purchase.item}</h2>
          <div className="text-3xl font-bold text-blue-600 mb-3">₹{purchase.price.toLocaleString()}</div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
            purchase.urgency === 'High' ? 'bg-red-100 text-red-600' :
            purchase.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
            'bg-green-100 text-green-600'
          }`}>
            {purchase.urgency} Priority
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-3">Your Financial Status</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">₹{cashAvailable.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Available Cash</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{creditScore}</div>
              <div className="text-sm text-gray-600">Credit Score</div>
            </div>
          </div>
        </div>

        {/* Decision Options */}
        <div className="space-y-4">
          {/* Cash Option */}
          <button
            onClick={() => handleDecision('cash')}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Pay Full Cash</div>
                  <div className="text-sm opacity-90">No interest, immediate ownership</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">₹{purchase.price.toLocaleString()}</div>
                <div className="text-xs">One-time payment</div>
              </div>
            </div>
          </button>

          {/* EMI Option */}
          <button
            onClick={() => handleDecision('emi')}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-bold">Buy on EMI</div>
                  <div className="text-sm opacity-90">12 months @ 15% interest</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">₹{Math.round((purchase.price * 1.15) / 12).toLocaleString()}/month</div>
                <div className="text-xs">Total: ₹{Math.round(purchase.price * 1.15).toLocaleString()}</div>
              </div>
            </div>
          </button>

          {/* Skip Option */}
          <button
            onClick={() => handleDecision('skip')}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="text-left">
                <div className="font-bold">Skip for Now</div>
                <div className="text-sm opacity-90">Wait and save more money</div>
              </div>
            </div>
          </button>
        </div>

        {/* Advice */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border-2 border-purple-200">
          <h4 className="font-bold text-gray-900 mb-2">💡 Smart Money Tip</h4>
          <p className="text-gray-700 text-sm">
            Ask yourself: "Do I need this now, or do I just want it?" 
            EMIs cost extra money due to interest. Cash is king for purchases you can afford!
          </p>
        </div>
      </div>
      {showInstructions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-blue-200 relative">
            <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
            <div className="text-4xl mb-2">🤔</div>
            <h2 className="font-bold text-lg mb-2">How to Play</h2>
            <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
              <li>Your goal: Make smart choices for each purchase (cash, EMI, or skip).</li>
              <li>Think about urgency, price, and your available cash.</li>
              <li>Each decision affects your score and credit score.</li>
              <li>Try to get the highest average score for a badge!</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EMIChallenge;