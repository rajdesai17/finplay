import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
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

const allItems: Item[] = [
  { id: 'toffee', name: 'Toffee', icon: '🍬', value: 1 },
  { id: 'biscuit', name: 'Biscuit', icon: '🍪', value: 2 },
  { id: 'chocolate', name: 'Chocolate', icon: '🍫', value: 4 },
  { id: 'juice', name: 'Juice Box', icon: '🧃', value: 8 },
  { id: 'toy-car', name: 'Toy Car', icon: '🚗', value: 15 },
  { id: 'book', name: 'Story Book', icon: '📚', value: 12 },
];

function BarterMela({ onBack }: BarterMelaProps) {
  const [inventory, setInventory] = useState([
    { ...allItems[0], quantity: 8 }, // 8 toffees
  ]);
  const [selectedTrade, setSelectedTrade] = useState<{
    give: { item: Item; quantity: number };
    get: { item: Item; quantity: number };
  } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<string[]>([]);
  const [successfulTrades, setSuccessfulTrades] = useState(0);
  const { addReward } = useUser();

  const trades = [
    { give: { item: allItems[0], quantity: 2 }, get: { item: allItems[1], quantity: 1 } }, // 2 toffees for 1 biscuit
    { give: { item: allItems[1], quantity: 2 }, get: { item: allItems[2], quantity: 1 } }, // 2 biscuits for 1 chocolate
    { give: { item: allItems[2], quantity: 2 }, get: { item: allItems[3], quantity: 1 } }, // 2 chocolates for 1 juice
    { give: { item: allItems[3], quantity: 1 }, get: { item: allItems[4], quantity: 1 } }, // 1 juice for 1 toy car (special deal!)
    { give: { item: allItems[0], quantity: 6 }, get: { item: allItems[5], quantity: 1 } }, // 6 toffees for 1 book
  ];

  const getItemQuantity = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const canAffordTrade = (trade: typeof trades[0]) => {
    return getItemQuantity(trade.give.item.id) >= trade.give.quantity;
  };

  const executeTrade = (trade: typeof trades[0]) => {
    setInventory(prev => {
      let newInventory = [...prev];
      
      // Remove given items
      const giveIndex = newInventory.findIndex(i => i.id === trade.give.item.id);
      if (giveIndex >= 0) {
        newInventory[giveIndex].quantity -= trade.give.quantity;
        if (newInventory[giveIndex].quantity <= 0) {
          newInventory = newInventory.filter(i => i.id !== trade.give.item.id);
        }
      }
      
      // Add received items
      const getIndex = newInventory.findIndex(i => i.id === trade.get.item.id);
      if (getIndex >= 0) {
        newInventory[getIndex].quantity += trade.get.quantity;
      } else {
        newInventory.push({ ...trade.get.item, quantity: trade.get.quantity });
      }
      
      return newInventory;
    });

    const tradeText = `${trade.give.quantity} ${trade.give.item.name}${trade.give.quantity > 1 ? 's' : ''} → ${trade.get.quantity} ${trade.get.item.name}${trade.get.quantity > 1 ? 's' : ''}`;
    setTradeHistory(prev => [...prev, tradeText]);
    setSuccessfulTrades(prev => prev + 1);
    setSelectedTrade(null);

    // Check if they have valuable items for completion
    const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    if (successfulTrades >= 2 && totalValue >= 15) {
      setTimeout(() => {
        setShowResult(true);
        addReward({
          xp: 40,
          cashback: 20,
          badge: {
            id: 'barter-king',
            name: 'Barter King',
            icon: '👑',
            description: 'Trading master',
            earned: true
          }
        });
      }, 1000);
    }
  };

  const reset = () => {
    setInventory([{ ...allItems[0], quantity: 8 }]);
    setTradeHistory([]);
    setSuccessfulTrades(0);
    setSelectedTrade(null);
    setShowResult(false);
  };

  if (showResult) {
    const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Trading Complete!</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-4 border-orange-200">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Amazing Trading!</h2>
            <p className="text-gray-600 mb-6">You made {successfulTrades} successful trades!</p>
            
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Final Inventory Value: ₹{totalValue}</h3>
              <div className="grid grid-cols-3 gap-3">
                {inventory.map(item => (
                  <div key={item.id} className="text-center">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-medium">{item.quantity}x {item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">What You Learned:</h3>
              <ul className="text-left text-sm space-y-1">
                <li>• Fair trading makes everyone happy!</li>
                <li>• Some items are worth more than others</li>
                <li>• Planning helps you get what you want</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Trade Again
              </button>
              <button
                onClick={onBack}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
              >
                Play More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Barter Mela</h1>
          <button onClick={reset} className="p-2 hover:bg-white/20 rounded-full ml-auto">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        <p className="text-orange-100">Trade your items fairly at the market!</p>
      </div>

      <div className="p-6 space-y-6">
        {/* My Inventory */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🎒 My Items</h3>
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
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">🤝 Available Trades</h3>
          <div className="space-y-3">
            {trades.map((trade, index) => {
              const canAfford = canAffordTrade(trade);
              return (
                <button
                  key={index}
                  onClick={() => canAfford && executeTrade(trade)}
                  disabled={!canAfford}
                  className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                    canAfford 
                      ? 'border-green-300 bg-green-50 hover:bg-green-100 transform hover:scale-[1.02]' 
                      : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
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
                      Need {trade.give.quantity} {trade.give.item.name}${trade.give.quantity > 1 ? 's' : ''}
                    </div>
                  )}
                </button>
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

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-200">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>🎯</span>
            How to Play
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Start with 8 toffees</li>
            <li>• Trade items to get more valuable ones</li>
            <li>• Make at least 2 trades to complete the game</li>
            <li>• Fair trades make everyone happy! 😊</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BarterMela;