import React, { useState } from 'react';
import { Coins, Wallet, PiggyBank, TrendingUp, Globe, ChevronDown } from 'lucide-react';
import { Screen } from '../App';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'हिंदी', 'বাংলা', 'தமிழ்', 'ગુજરાતી', 'മലയാളം'];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Coins className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="absolute top-40 right-12 animate-float delay-100">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5 text-green-400" />
          </div>
        </div>
        <div className="absolute bottom-32 left-8 animate-float delay-200">
          <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center">
            <PiggyBank className="w-7 h-7 text-purple-400" />
          </div>
        </div>
        <div className="absolute bottom-20 right-16 animate-float delay-300">
          <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{selectedLanguage}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showLanguages && (
            <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 min-w-32 z-20 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguages(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="mb-8 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
              <Coins className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Fin<span className="text-blue-600">Play</span>
          </h1>
          
          <p className="text-2xl text-gray-900 font-semibold mb-3">
            Learn Money. Play Life.
          </p>
          
          <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
            India's first gamified financial literacy platform for youth and kids
          </p>
        </div>

        {/* Mode Selection Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          <button
            onClick={() => onNavigate('youth')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 px-8 rounded-2xl font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🧑‍🎓</span>
              <span>Play as Youth</span>
            </div>
            <p className="text-sm opacity-90 mt-1 font-normal">Age 15-25 • Advanced Simulations</p>
          </button>

          <button
            onClick={() => onNavigate('kids')}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-5 px-8 rounded-2xl font-semibold text-lg shadow-lg border-2 border-gray-200 hover:border-gray-300 transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🧒</span>
              <span>Play as Kid</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 font-normal">Age 8-14 • Fun Learning Games</p>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex gap-8 text-gray-600">
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">10K+</div>
            <div className="text-sm">Young Learners</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">50+</div>
            <div className="text-sm">Fun Challenges</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900">₹1L+</div>
            <div className="text-sm">Money Learned</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <div className="flex justify-center gap-8 text-gray-500 text-sm">
          <button className="hover:text-gray-700 transition-colors">About</button>
          <button className="hover:text-gray-700 transition-colors">Terms</button>
          <button className="hover:text-gray-700 transition-colors">Privacy</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;