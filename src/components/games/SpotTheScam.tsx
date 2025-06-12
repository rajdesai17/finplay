import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface SpotTheScamProps {
  onBack: () => void;
}

interface ScenarioChoice {
  text: string;
  isScam: boolean;
  explanation: string;
}

interface Scenario {
  id: number;
  title: string;
  story: string;
  image: string;
  choices: ScenarioChoice[];
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "The Phone Call Winner",
    story: "Ravi gets a phone call: 'Congratulations! You won ₹50,000 in a lottery! Just pay ₹500 processing fee to claim your prize!'",
    image: "📞",
    choices: [
      {
        text: "Pay ₹500 to get the prize money",
        isScam: true,
        explanation: "This is a scam! Real lotteries never ask for money upfront. They deduct fees from your winnings."
      },
      {
        text: "Ask for official documents first",
        isScam: false,
        explanation: "Smart choice! Always verify before paying money to strangers."
      },
      {
        text: "Hang up immediately",
        isScam: false,
        explanation: "Perfect! When something sounds too good to be true, it usually is."
      }
    ]
  },
  {
    id: 2,
    title: "The Online Shopping Deal",
    story: "Priya sees an ad: 'iPhone 14 for just ₹5,000! Limited time offer! Pay now or miss out forever!'",
    image: "📱",
    choices: [
      {
        text: "Buy it immediately - it's a great deal!",
        isScam: true,
        explanation: "This is definitely a scam! iPhones never cost this little. Scammers use 'urgent' language to make you rush."
      },
      {
        text: "Check if the website is real first",
        isScam: false,
        explanation: "Excellent thinking! Always verify the seller before buying expensive items online."
      },
      {
        text: "Compare prices on other websites",
        isScam: false,
        explanation: "Very smart! If a deal is much cheaper than everywhere else, it's probably fake."
      }
    ]
  },
  {
    id: 3,
    title: "The ATM Helper",
    story: "At the ATM, a 'helpful' stranger says: 'Your card is stuck! Let me help. Just tell me your PIN and I'll get it out.'",
    image: "🏧",
    choices: [
      {
        text: "Tell them the PIN - they're helping!",
        isScam: true,
        explanation: "Never share your PIN with anyone! This person wants to steal your money. Call the bank instead."
      },
      {
        text: "Ask them to leave and call the bank",
        isScam: false,
        explanation: "Perfect! Your PIN is secret. Only share it with the bank through official channels."
      },
      {
        text: "Go to another ATM and report this one",
        isScam: false,
        explanation: "Smart move! Avoid suspicious situations and report them to authorities."
      }
    ]
  }
];

function SpotTheScam({ onBack }: SpotTheScamProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { addReward } = useUser();

  const scenario = scenarios[currentScenario];

  const handleChoiceSelect = (choiceIndex: number) => {
    setSelectedChoice(choiceIndex);
    setShowExplanation(true);
    
    const choice = scenario.choices[choiceIndex];
    if (!choice.isScam) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedChoice(null);
      setShowExplanation(false);
    } else {
      setShowFinalResult(true);
      
      let badge = undefined;
      if (score >= 2) {
        badge = {
          id: 'upi-shield',
          name: 'UPI Shield',
          icon: '🛡️',
          description: 'Fraud detector extraordinaire',
          earned: true
        };
      }

      addReward({
        xp: score * 15,
        cashback: score * 10,
        badge
      });
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setScore(0);
    setSelectedChoice(null);
    setShowExplanation(false);
    setShowFinalResult(false);
  };

  if (showFinalResult) {
    const percentage = Math.round((score / scenarios.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 pb-20">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Scam Detection Results</h1>
            <button onClick={() => setShowInstructions(true)} className="ml-auto p-2 hover:bg-white/20 rounded-full" title="How to Play?">
              <span role="img" aria-label="info">ℹ️</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-green-200">
            <div className="text-6xl mb-4">
              {percentage >= 70 ? '🏆' : percentage >= 50 ? '👍' : '💪'}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {percentage >= 70 ? 'Scam Detective!' : percentage >= 50 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score}/{scenarios.length}
            </div>
            <p className="text-gray-600 mb-6">You spotted {percentage}% of scams correctly!</p>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Remember These Safety Tips:</h3>
              <ul className="text-left text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Never share your PIN or passwords with anyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>If something sounds too good to be true, it probably is</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Always verify before paying money to strangers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>When in doubt, ask a trusted adult for help</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                More Games
              </button>
            </div>
          </div>
        </div>

        {showInstructions && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-green-200 relative">
              <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
              <div className="text-4xl mb-2">🤔</div>
              <h2 className="font-bold text-lg mb-2">How to Play</h2>
              <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
                <li>Your goal: Spot the scam in each story scenario!</li>
                <li>Read the story and choose the option you think is safest.</li>
                <li>Learn why each choice is right or wrong after you pick.</li>
                <li>Try to get the highest score and earn a badge!</li>
              </ul>
              <button onClick={() => setShowInstructions(false)} className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Spot the Scam</h1>
          <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-green-900 text-sm shadow border border-green-300" title="How to Play?">
            How to Play?
          </button>
        </div>
        <p className="text-green-100">Help the characters avoid tricky situations!</p>
        
        {/* Progress */}
        <div className="mt-4 flex justify-between text-sm">
          <span>Story {currentScenario + 1} of {scenarios.length}</span>
          <span>Score: {score}/{scenarios.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        {/* Story Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border-4 border-blue-200">
          <div className="text-center mb-4">
            <div className="text-6xl mb-3">{scenario.image}</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{scenario.title}</h2>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200">
            <p className="text-gray-800 text-base leading-relaxed">{scenario.story}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            What should they do?
          </h3>
          
          <div className="space-y-3">
            {scenario.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleChoiceSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedChoice === index
                    ? choice.isScam
                      ? 'border-red-500 bg-red-50'
                      : 'border-green-500 bg-green-50'
                    : showExplanation
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 transform hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {showExplanation && selectedChoice === index && (
                    <div className="text-2xl">
                      {choice.isScam ? '❌' : '✅'}
                    </div>
                  )}
                  <span className="text-gray-900 font-medium">{choice.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && selectedChoice !== null && (
          <div className={`mt-6 rounded-3xl p-6 shadow-xl border-4 ${
            scenario.choices[selectedChoice].isScam 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl">
                {scenario.choices[selectedChoice].isScam ? '⚠️' : '🎉'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {scenario.choices[selectedChoice].isScam ? 'Oops! This is a scam!' : 'Great choice!'}
                </h4>
                <p className="text-gray-700">
                  {scenario.choices[selectedChoice].explanation}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Story' : 'See Results'}
            </button>
          </div>
        )}

        {/* Safety Tip */}
        {!showExplanation && (
          <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-200">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Safety Tip
            </h4>
            <p className="text-gray-700 text-sm">
              When someone asks for money or personal information, always think twice! 
              Ask yourself: "Does this sound too good to be true?"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotTheScam;