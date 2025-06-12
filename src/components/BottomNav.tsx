import React from 'react';
import { Home, GraduationCap, Baby, HelpCircle } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'landing' as Screen, icon: Home, label: 'Home' },
    { id: 'youth' as Screen, icon: GraduationCap, label: 'Youth' },
    { id: 'kids' as Screen, icon: Baby, label: 'Kids' },
    { id: 'quiz' as Screen, icon: HelpCircle, label: 'Quiz' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom shadow-lg">
      <div className="flex justify-around items-center py-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
              currentScreen === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${currentScreen === id ? 'scale-110' : ''} transition-transform duration-200`} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;