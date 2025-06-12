import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import YouthZone from './components/YouthZone';
import KidsZone from './components/KidsZone';
import CareerQuiz from './components/CareerQuiz';
import BottomNav from './components/BottomNav';
import RewardPopup from './components/RewardPopup';
import FinanceGlossary from './components/FinanceGlossary';
import { UserProvider } from './context/UserContext';

export type Screen = 'landing' | 'youth' | 'kids' | 'quiz' | 'glossary';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentScreen} />;
      case 'youth':
        return <YouthZone />;
      case 'kids':
        return <KidsZone />;
      case 'quiz':
        return <CareerQuiz />;
      case 'glossary':
        return <FinanceGlossary />;
      default:
        return <LandingPage onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-white">
        {renderScreen()}
        {currentScreen !== 'landing' && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
        <RewardPopup />
      </div>
    </UserProvider>
  );
}

export default App;