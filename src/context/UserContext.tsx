import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export interface UserState {
  xp: number;
  level: number;
  badges: Badge[];
  cashback: number;
}

interface Reward {
  xp: number;
  cashback: number;
  badge?: Badge;
}

interface UserContextType {
  user: UserState;
  showReward: boolean;
  currentReward: Reward | null;
  addReward: (reward: Reward) => void;
  dismissReward: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialBadges: Badge[] = [
  { id: 'budget-boss', name: 'Budget Boss', icon: '💰', description: 'Master of budgeting', earned: false },
  { id: 'upi-shield', name: 'UPI Shield', icon: '🛡️', description: 'Fraud detector extraordinaire', earned: false },
  { id: 'tax-ninja', name: 'Tax Ninja', icon: '🥷', description: 'Tax return champion', earned: false },
  { id: 'side-hustler', name: 'Side Hustler', icon: '🚀', description: 'Business building pro', earned: false },
  { id: 'savings-star', name: 'Savings Star', icon: '⭐', description: 'Piggy bank champion', earned: false },
  { id: 'barter-king', name: 'Barter King', icon: '👑', description: 'Trading master', earned: false },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(() => {
    const stored = localStorage.getItem('finplay_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Ensure badges array is always present and merged with initialBadges for new badges
        const badgeMap = Object.fromEntries(initialBadges.map(b => [b.id, b]));
        if (parsed.badges) {
          parsed.badges.forEach((b: Badge) => {
            badgeMap[b.id] = { ...badgeMap[b.id], ...b };
          });
        }
        return {
          ...parsed,
          badges: Object.values(badgeMap),
        };
      } catch {
        // fallback to default
      }
    }
    return {
      xp: 0,
      level: 1,
      badges: initialBadges,
      cashback: 0,
    };
  });
  
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

  const addReward = (reward: Reward) => {
    setUser(prev => {
      const newXp = prev.xp + reward.xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      const updatedBadges = reward.badge 
        ? prev.badges.map(badge => 
            badge.id === reward.badge?.id ? { ...badge, earned: true } : badge
          )
        : prev.badges;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        cashback: prev.cashback + reward.cashback,
        badges: updatedBadges,
      };
    });

    setCurrentReward(reward);
    setShowReward(true);
  };

  const dismissReward = () => {
    setShowReward(false);
    setTimeout(() => setCurrentReward(null), 300);
  };

  // Persist user state to localStorage on change
  useEffect(() => {
    localStorage.setItem('finplay_user', JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{
      user,
      showReward,
      currentReward,
      addReward,
      dismissReward,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};