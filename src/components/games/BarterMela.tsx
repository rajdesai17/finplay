import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface BarterMelaProps {
  onBack: () => void;
}

interface Item {
  id: string;
  name: string;
  icon: string;
  value: number;
}

interface TradeCharacter {
  name: string;
  avatar: string;
  quote: string;
}

const allItems: Item[] = [
  { id: 'toffee', name: 'Toffee', icon: '🍬', value: 1 },
  { id: 'biscuit', name: 'Biscuit', icon: '🍪', value: 2 },
  { id: 'chocolate', name: 'Chocolate', icon: '🍫', value: 4 },
  { id: 'juice', name: 'Juice Box', icon: '🧃', value: 8 },
  { id: 'toy-car', name: 'Toy Car', icon: '🚗', value: 15 },
  { id: 'book', name: 'Story Book', icon: '📚', value: 12 },
  { id: 'stickers', name: 'Stickers', icon: '⭐', value: 3 },
];

const tradeCharacters: TradeCharacter[] = [
  { name: 'Bunty', avatar: '🧒', quote: 'I love biscuits! Want to trade?' },
  { name: 'Priya', avatar: '👧', quote: 'Chocolate is my favorite treat!' },
  { name: 'Rahul', avatar: '🧑', quote: 'This juice box is so refreshing!' },
  { name: 'Shopkeeper', avatar: '👨‍💼', quote: 'Welcome to my toy shop!' },
  { name: 'Librarian', avatar: '👩‍🏫', quote: 'Books are treasures!' },
];

function BarterMela({ onBack }: BarterMelaProps) {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [inventory, setInventory] = useState([
    { ...allItems[0], quantity: 14 }, // 8 toffees
  ]);
  const [tradeAnimation, setTradeAnimation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<string[]>([]);
  const [successfulTrades, setSuccessfulTrades] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const { addReward } = useUser();
  const tradeLock = useRef(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const trades = [
    { 
      give: { item: allItems[0], quantity: 2 }, 
      get: { item: allItems[1], quantity: 1 }, 
      character: tradeCharacters[0],
      unlocked: true 
    },
    { 
      give: { item: allItems[1], quantity: 2 }, 
      get: { item: allItems[2], quantity: 1 }, 
      character: tradeCharacters[1],
      unlocked: true 
    },
    { 
      give: { item: allItems[2], quantity: 2 }, 
      get: { item: allItems[3], quantity: 1 }, 
      character: tradeCharacters[2],
      unlocked: true 
    },
    { 
      give: { item: allItems[3], quantity: 1 }, 
      get: { item: allItems[4], quantity: 1 }, 
      character: tradeCharacters[3],
      unlocked: false // Unlocks after 2 trades
    },
    { 
      give: { item: allItems[0], quantity: 6 }, 
      get: { item: allItems[5], quantity: 1 }, 
      character: tradeCharacters[4],
      unlocked: true 
    },
    // Bonus trade
    { 
      give: { item: allItems[0], quantity: 3 }, 
      get: { item: allItems[6], quantity: 2 }, 
      character: { name: 'Maya', avatar: '👩', quote: 'These stickers are magical!' },
      unlocked: false // Unlocks after finding the right combination
    },
  ];

  const getItemQuantity = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  // Determine if a trade is unlocked based on current progress
  const isTradeUnlocked = (index: number) => {
    // First three trades and book trade always unlocked (index 0,1,2,4)
    if ([0,1,2,4].includes(index)) return true;
    // Toy car trade (index 3) unlocks after at least 2 successful trades
    if (index === 3) return successfulTrades >= 2;
    // Bonus stickers trade (index 5) unlocks after mission complete (got toy car)
    if (index === 5) return missionComplete;
    return false;
  };

  const canAffordTrade = (trade: typeof trades[0]) => {
    return getItemQuantity(trade.give.item.id) >= trade.give.quantity;
  };

  const executeTrade = (trade: typeof trades[0]) => {
    if (tradeLock.current) return;
    tradeLock.current = true;
    setTradeAnimation(true);
    
    setTimeout(() => {
      setInventory(prev => {
        let newInventory = [...prev];
        
        const giveIndex = newInventory.findIndex(i => i.id === trade.give.item.id);
        if (giveIndex >= 0) {
          const newQty = newInventory[giveIndex].quantity - trade.give.quantity;
          newInventory[giveIndex].quantity = Math.max(newQty, 0);
          if (newInventory[giveIndex].quantity === 0) {
            newInventory.splice(giveIndex, 1);
          }
        }
        
        const getIndex = newInventory.findIndex(i => i.id === trade.get.item.id);
        if (getIndex >= 0) {
          newInventory[getIndex].quantity += trade.get.quantity;
        } else {
          newInventory.push({ ...trade.get.item, quantity: trade.get.quantity });
        }
        
        return newInventory;
      });

      const tradeText = `${trade.character.name}: ${trade.give.quantity} ${trade.give.item.name}${trade.give.quantity > 1 ? 's' : ''} → ${trade.get.quantity} ${trade.get.item.name}${trade.get.quantity > 1 ? 's' : ''}`;
      setTradeHistory(prev => [...prev, tradeText]);
      setSuccessfulTrades(prev => prev + 1);
      
      if (trade.get.item.id === 'toy-car') {
        setMissionComplete(true);
      }
      
      if (successfulTrades >= 1) {
        setBonusUnlocked(true);
      }
      
      setTradeAnimation(false);
      tradeLock.current = false;
    }, 1000);
  };

  const completeGame = () => {
    const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    let xpReward = 30;
    let cashbackReward = 15;
    
    if (missionComplete) {
      xpReward = 50;
      cashbackReward = 25;
    }
    
    if (successfulTrades >= 4) {
      xpReward += 20;
      cashbackReward += 10;
    }

    addReward({
      xp: xpReward,
      cashback: cashbackReward,
      badge: {
        id: 'barter-king',
        name: 'Barter King',
        icon: '👑',
        description: 'Trading master',
        earned: true
      }
    });
    
    setGamePhase('result');
  };

  const reset = () => {
    setInventory([{ ...allItems[0], quantity: 8 }]);
    setTradeHistory([]);
    setSuccessfulTrades(0);
    setMissionComplete(false);
    setBonusUnlocked(false);
    setGamePhase('intro');
  };

  // Introduction screen
  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Barter Mela</h1>
            <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-orange-900 text-sm shadow border border-orange-300" title="How to Play?">
              How to Play?
            </button>
          </div>
        </div>
        {showInstructions && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-orange-200 relative">
              <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
              <div className="text-4xl mb-2">🤔</div>
              <h2 className="font-bold text-lg mb-2">How to Play</h2>
              <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
                <li>Your goal: Help Mira trade her toffees to get a toy car for her brother!</li>
                <li>Click on a trade to exchange your items for something new.</li>
                <li>Some trades unlock after you make progress.</li>
                <li>Plan your trades to reach the toy car!</li>
                <li>Finish to see your rewards and what you learned.</li>
              </ul>
              <button onClick={() => setShowInstructions(false)} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
            </div>
          </div>
        )}
        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-orange-200">
            <div className="text-6xl mb-4">🎪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Barter Mela!</h2>
            
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
              <div className="text-4xl mb-3">👧</div>
              <h3 className="font-bold text-blue-800 mb-2">Help Mira!</h3>
              <p className="text-blue-700 text-sm">
                "Hi! My little brother's birthday is today, and I want to get him a 🚗 toy car! 
                But I only have 8 toffees. Can you help me trade these for a toy car?"
              </p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-4 mb-6 border-2 border-yellow-200">
              <h3 className="font-bold text-gray-900 mb-2">🎯 Your Mission:</h3>
              <p className="text-gray-700 text-sm">Help Mira trade her 8 toffees to get a toy car for her brother!</p>
            </div>

            <button
              onClick={() => setGamePhase('playing')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Trading! 🤝
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (gamePhase === 'result') {
    const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Mission Complete!</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-orange-200">
            <div className="text-6xl mb-4">{missionComplete ? '🎉' : '🌟'}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {missionComplete ? 'Mission Accomplished!' : 'Great Trading!'}
            </h2>
            
            {missionComplete ? (
              <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="text-4xl mb-3">👧🎁</div>
                <h3 className="font-bold text-green-800 mb-2">Mira says:</h3>
                <p className="text-green-700 text-sm">
                  "Thank you so much! My brother will be so happy with his new toy car! 
                  You're an amazing trader! 🚗✨"
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
                <div className="text-4xl mb-3">🤝</div>
                <p className="text-blue-700 text-sm">
                  You made {successfulTrades} great trades! Every trade helps someone get what they need.
                </p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Your Final Collection:</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {inventory.map(item => (
                  <div key={item.id} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-medium">{item.quantity}x {item.name}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-700">Total Value: ₹{totalValue}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">🎓 What You Learned:</h3>
              <ul className="text-left text-sm space-y-1 text-gray-700">
                <li>• Fair trading makes everyone happy!</li>
                <li>• Some items are worth more than others</li>
                <li>• Planning helps you get what you want</li>
                <li>• Helping others feels great!</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Help Again! 🔄
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Play More 🎮
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Barter Mela</h1>
          <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-orange-900 text-sm shadow border border-orange-300" title="How to Play?">
            How to Play?
          </button>
        </div>
        <div className="bg-white/20 rounded-2xl p-3">
          <p className="text-sm">🎯 Mission: Help Mira get a 🚗 toy car for her brother!</p>
          <p className="text-xs mt-1">Trades made: {successfulTrades}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Trade Animation Overlay */}
        {tradeAnimation && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
              <div className="text-4xl mb-4">🤝</div>
              <p className="font-bold text-lg">Trading...</p>
            </div>
          </div>
        )}

        {/* My Inventory */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎒 Mira's Items</h3>
          <div className="grid grid-cols-4 gap-3">
            {inventory.map(item => (
              <div key={item.id} className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3 border-2 border-yellow-200">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xs font-bold text-gray-900">{item.quantity}x</div>
                <div className="text-xs text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Trades */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-orange-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🤝 Friendly Traders</h3>
          <div className="space-y-3">
            {trades.map((trade, index) => {
              const unlocked = isTradeUnlocked(index);
              const canAfford = unlocked && canAffordTrade(trade);
              
              return (
                <div
                  key={index}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                    !unlocked 
                      ? 'border-gray-200 bg-gray-50 opacity-40' 
                      : canAfford 
                        ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Character info */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{trade.character.avatar}</span>
                    <div>
                      <div className="font-bold text-sm">{trade.character.name}</div>
                      <div className="text-xs text-gray-600">"{trade.character.quote}"</div>
                    </div>
                  </div>
                  
                  {unlocked ? (
                    <button
                      onClick={() => canAfford && executeTrade(trade)}
                      disabled={!canAfford || tradeAnimation}
                      className="w-full"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl mb-1">{trade.give.item.icon}</div>
                          <div className="text-sm font-bold">Give {trade.give.quantity}</div>
                          <div className="text-xs text-gray-600">{trade.give.item.name}</div>
                        </div>
                        
                        <div className="text-2xl">⇄</div>
                        
                        <div className="text-center">
                          <div className="text-2xl mb-1">{trade.get.item.icon}</div>
                          <div className="text-sm font-bold">Get {trade.get.quantity}</div>
                          <div className="text-xs text-gray-600">{trade.get.item.name}</div>
                        </div>
                      </div>
                      
                      {!canAfford && (
                        <div className="text-xs text-red-600 mt-2">
                          Need {trade.give.quantity} {trade.give.item.name}{trade.give.quantity > 1 ? 's' : ''}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg mb-2">🔒</div>
                      <div className="text-xs text-gray-500">
                        {index === 3 ? 'Make 2 trades to unlock!' : 'Complete special quest to unlock!'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trade History */}
        {tradeHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📜</span>
              Trade History
            </h4>
            <div className="space-y-2">
              {tradeHistory.map((trade, index) => (
                <div key={index} className="text-sm bg-green-50 rounded-lg p-2 border border-green-200">
                  {trade}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Mission Button */}
        {successfulTrades >= 2 && (
          <div className="text-center">
            <button
              onClick={completeGame}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              Finish Trading!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BarterMela;