import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface UPIScamAlertProps {
  onBack: () => void;
}

interface UPITransaction {
  id: number;
  type: 'receive' | 'send';
  from: string;
  to: string;
  amount: number;
  message: string;
  isScam: boolean;
  scamIndicators: string[];
  safetyTip: string;
}

const transactions: UPITransaction[] = [
  {
    id: 1,
    type: 'receive',
    from: 'Amit Sharma',
    to: 'You',
    amount: 5000,
    message: 'Congratulations! You won lottery. Send ₹500 processing fee to claim prize.',
    isScam: true,
    scamIndicators: [
      'Asks for money to receive money',
      'Lottery you never entered',
      'Too good to be true'
    ],
    safetyTip: 'Real prizes never require upfront payments. This is a classic scam!'
  },
  {
    id: 2,
    type: 'send',
    from: 'You',
    to: 'Mom',
    amount: 2000,
    message: 'For groceries',
    isScam: false,
    scamIndicators: [],
    safetyTip: 'This looks like a legitimate transaction to a trusted contact.'
  },
  {
    id: 3,
    type: 'receive',
    from: 'Bank Customer Care',
    to: 'You',
    amount: 1,
    message: 'Your account is blocked. Send us ₹1 to verify and unblock immediately.',
    isScam: true,
    scamIndicators: [
      'Fake bank name',
      'Creates urgency',
      'Asks for money to solve problem'
    ],
    safetyTip: 'Banks never ask for money via UPI. Always call your bank directly!'
  },
  {
    id: 4,
    type: 'send',
    from: 'You',
    to: 'Amazon Pay',
    amount: 1299,
    message: 'Payment for order #12345',
    isScam: false,
    scamIndicators: [],
    safetyTip: 'This appears to be a legitimate purchase from a trusted platform.'
  },
  {
    id: 5,
    type: 'receive',
    from: 'UPI REFUND',
    to: 'You',
    amount: 9999,
    message: 'Wrong transaction refund. Please send ₹100 processing fee for instant refund.',
    isScam: true,
    scamIndicators: [
      'Refund asking for money',
      'Generic sender name',
      'Instant refund promise'
    ],
    safetyTip: 'Refunds never require processing fees. Contact your bank for real refunds!'
  }
];

function UPIScamAlert({ onBack }: UPIScamAlertProps) {
  const [currentTransaction, setCurrentTransaction] = useState(0);
  const [userChoice, setUserChoice] = useState<'safe' | 'scam' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const { addReward } = useUser();

  const transaction = transactions[currentTransaction];

  const handleChoice = (choice: 'safe' | 'scam') => {
    setUserChoice(choice);
    setShowResult(true);
    
    const isCorrect = (choice === 'scam' && transaction.isScam) || (choice === 'safe' && !transaction.isScam);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentTransaction < transactions.length - 1) {
      setCurrentTransaction(prev => prev + 1);
      setUserChoice(null);
      setShowResult(false);
    } else {
      setShowFinalResult(true);
      
      let badge = undefined;
      if (score >= 4) {
        badge = {
          id: 'upi-shield',
          name: 'UPI Shield',
          icon: '🛡️',
          description: 'Digital payment security expert',
          earned: true
        };
      }

      addReward({
        xp: score * 20,
        cashback: score * 15,
        badge
      });
    }
  };

  const resetGame = () => {
    setCurrentTransaction(0);
    setUserChoice(null);
    setShowResult(false);
    setScore(0);
    setShowFinalResult(false);
  };

  if (showFinalResult) {
    const percentage = Math.round((score / transactions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pb-20">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">UPI Security Results</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-green-200">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🛡️' : '📚'}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {percentage >= 80 ? 'UPI Security Expert!' : 
               percentage >= 60 ? 'Good Security Awareness!' : 
               'Keep Learning!'}
            </h2>
            
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score}/{transactions.length}
            </div>
            <p className="text-gray-600 mb-6">You identified {percentage}% of threats correctly!</p>

            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                UPI Safety Rules
              </h3>
              <ul className="text-left text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Never send money to receive money - it's always a scam</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Banks never ask for money via UPI to solve problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Verify unusual requests by calling the sender directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Be suspicious of urgent requests or too-good-to-be-true offers</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Practice Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                More Simulations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">UPI Scam Alert</h1>
        </div>
        <p className="text-red-100">Spot fraudulent UPI transactions</p>
        
        {/* Progress */}
        <div className="mt-4 flex justify-between text-sm">
          <span>Transaction {currentTransaction + 1} of {transactions.length}</span>
          <span>Score: {score}/{transactions.length}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentTransaction + 1) / transactions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        {/* UPI Transaction Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border-4 border-blue-200">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-90">UPI Transaction</span>
              <span className="text-sm opacity-90">#{transaction.id.toString().padStart(4, '0')}</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-90">
                  {transaction.type === 'receive' ? 'From' : 'To'}
                </div>
                <div className="font-bold text-lg">
                  {transaction.type === 'receive' ? transaction.from : transaction.to}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  transaction.type === 'receive' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {transaction.type === 'receive' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-sm opacity-90 mb-1">Message:</div>
              <div className="text-white font-medium">{transaction.message}</div>
            </div>
          </div>
        </div>

        {/* Choice Buttons */}
        {!showResult && (
          <div className="space-y-4">
            <button
              onClick={() => handleChoice('safe')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <div className="font-bold text-lg">This looks SAFE</div>
                  <div className="text-sm opacity-90">Legitimate transaction</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleChoice('scam')}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <div className="font-bold text-lg">This is a SCAM</div>
                  <div className="text-sm opacity-90">Fraudulent transaction</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Result Explanation */}
        {showResult && (
          <div className={`rounded-3xl p-6 shadow-xl border-4 ${
            (userChoice === 'scam' && transaction.isScam) || (userChoice === 'safe' && !transaction.isScam)
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">
                {(userChoice === 'scam' && transaction.isScam) || (userChoice === 'safe' && !transaction.isScam) 
                  ? '✅' : '❌'}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {(userChoice === 'scam' && transaction.isScam) || (userChoice === 'safe' && !transaction.isScam)
                  ? 'Correct!' : 'Incorrect!'}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-2xl">
                  {transaction.isScam ? '⚠️' : '✅'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    This transaction is {transaction.isScam ? 'FRAUDULENT' : 'LEGITIMATE'}
                  </h4>
                  <p className="text-gray-700 text-sm">{transaction.safetyTip}</p>
                </div>
              </div>

              {transaction.isScam && transaction.scamIndicators.length > 0 && (
                <div className="border-t pt-3">
                  <h5 className="font-semibold text-gray-900 mb-2">🚩 Red Flags:</h5>
                  <ul className="space-y-1">
                    {transaction.scamIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
            >
              {currentTransaction < transactions.length - 1 ? 'Next Transaction' : 'See Final Results'}
            </button>
          </div>
        )}

        {/* Tips */}
        {!showResult && (
          <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-200">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-600" />
              Quick UPI Safety Check
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Does someone ask you to send money to receive money?</li>
              <li>• Is it too good to be true (lottery, prizes)?</li>
              <li>• Does it create urgency or panic?</li>
              <li>• Do you recognize the sender?</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UPIScamAlert;