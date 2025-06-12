import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface FreelancerLifeProps {
  onBack: () => void;
}

interface Project {
  id: number;
  client: string;
  amount: number;
  deadline: string;
  paymentDelay: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    client: 'Tech Startup',
    amount: 25000,
    deadline: '2 weeks',
    paymentDelay: 30,
    difficulty: 'Medium',
    description: 'Design a mobile app interface'
  },
  {
    id: 2,
    client: 'Local Restaurant',
    amount: 8000,
    deadline: '1 week',
    paymentDelay: 15,
    difficulty: 'Easy',
    description: 'Create social media posts'
  },
  {
    id: 3,
    client: 'E-commerce Brand',
    amount: 45000,
    deadline: '1 month',
    paymentDelay: 45,
    difficulty: 'Hard',
    description: 'Complete website redesign'
  }
];

function FreelancerLife({ onBack }: FreelancerLifeProps) {
  const [currentMonth, setCurrentMonth] = useState(1);
  const [bankBalance, setBankBalance] = useState(15000);
  const [completedProjects, setCompletedProjects] = useState<Array<{
    project: Project;
    completedMonth: number;
    paidMonth: number;
  }>>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [monthlyExpenses] = useState(12000);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const { addReward } = useUser();
  const [showInstructions, setShowInstructions] = useState(false);

  const availableProjects = projects.filter(p => 
    !completedProjects.some(cp => cp.project.id === p.id) && 
    currentProject?.id !== p.id
  );

  const takeProject = (project: Project) => {
    setCurrentProject(project);
  };

  const completeProject = () => {
    if (!currentProject) return;
    
    const newCompletion = {
      project: currentProject,
      completedMonth: currentMonth,
      paidMonth: currentMonth + Math.ceil(currentProject.paymentDelay / 30)
    };
    
    setCompletedProjects(prev => [...prev, newCompletion]);
    setCurrentProject(null);
    
    // Small advance payment (20% of project value)
    const advancePayment = Math.round(currentProject.amount * 0.2);
    setBankBalance(prev => prev + advancePayment);
  };

  const nextMonth = () => {
    let newBalance = bankBalance - monthlyExpenses;
    
    // Check for payments due this month
    completedProjects.forEach(cp => {
      if (cp.paidMonth === currentMonth + 1) {
        const remainingPayment = Math.round(cp.project.amount * 0.8); // 80% remaining
        newBalance += remainingPayment;
      }
    });
    
    setBankBalance(newBalance);
    setCurrentMonth(prev => prev + 1);
    
    // Check game over conditions
    if (newBalance < 0) {
      setGameOver(true);
      setShowResult(true);
      addReward({ xp: 20, cashback: 5, badge: undefined });
    } else if (currentMonth >= 6) {
      setShowResult(true);
      
      const totalEarned = completedProjects.reduce((sum, cp) => sum + cp.project.amount, 0);
      const finalScore = newBalance + totalEarned;
      
      let badge = undefined;
      if (finalScore >= 100000 && completedProjects.length >= 3) {
        badge = {
          id: 'side-hustler',
          name: 'Side Hustler',
          icon: '🚀',
          description: 'Freelancing success story',
          earned: true
        };
      }

      addReward({
        xp: Math.max(50, Math.min(100, finalScore / 1000)),
        cashback: Math.round(finalScore / 1000),
        badge
      });
    }
  };

  const getPendingPayments = () => {
    return completedProjects
      .filter(cp => cp.paidMonth > currentMonth)
      .reduce((sum, cp) => sum + Math.round(cp.project.amount * 0.8), 0);
  };

  if (showResult) {
    const totalEarned = completedProjects.reduce((sum, cp) => sum + cp.project.amount, 0);
    const totalExpenses = currentMonth * monthlyExpenses;
    const netProfit = totalEarned - totalExpenses + 15000; // Include starting balance
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pb-20">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Freelancer Life Results</h1>
            <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-purple-900 text-sm shadow border border-purple-300" title="How to Play?">
              How to Play?
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Result Summary */}
          <div className={`rounded-3xl p-6 shadow-xl text-center text-white ${
            gameOver ? 'bg-gradient-to-r from-red-400 to-red-600' :
            netProfit >= 50000 ? 'bg-gradient-to-r from-green-400 to-green-600' :
            netProfit >= 20000 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}>
            <div className="text-4xl mb-3">
              {gameOver ? '💸' : netProfit >= 50000 ? '🏆' : netProfit >= 20000 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {gameOver ? 'Cash Flow Crisis!' :
               netProfit >= 50000 ? 'Freelancing Success!' :
               netProfit >= 20000 ? 'Good Progress!' :
               'Learning Experience!'}
            </h2>
            <div className="text-3xl font-bold">₹{bankBalance.toLocaleString()}</div>
            <p className="text-white/90">Final Bank Balance</p>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">₹{totalEarned.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Earned</div>
              </div>
              <div className="text-center bg-red-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Expenses</div>
              </div>
              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{completedProjects.length}</div>
                <div className="text-sm text-gray-600">Projects Done</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">₹{getPendingPayments().toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pending Payments</div>
              </div>
            </div>
          </div>

          {/* Project History */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Completed Projects</h3>
            {completedProjects.length > 0 ? (
              <div className="space-y-3">
                {completedProjects.map((cp, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{cp.project.client}</div>
                      <div className="text-sm text-gray-600">{cp.project.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{cp.project.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {cp.paidMonth <= currentMonth ? 'Paid' : `Due Month ${cp.paidMonth}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No projects completed</p>
            )}
          </div>

          {/* Key Learnings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Freelancer Survival Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Always maintain 3-6 months emergency fund</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ask for advance payments to manage cash flow</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Diversify clients to reduce payment risk</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Track expenses and set aside money for taxes</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
          >
            Try Another Simulation
          </button>
        </div>
        {showInstructions && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-purple-200 relative">
              <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
              <div className="text-4xl mb-2">🤔</div>
              <h2 className="font-bold text-lg mb-2">How to Play</h2>
              <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
                <li>Your goal: Complete projects, manage your cash flow, and avoid running out of money.</li>
                <li>Pick projects, finish them, and wait for payments (some are delayed!).</li>
                <li>Each month, pay your expenses and see if you get paid for finished work.</li>
                <li>Try to finish with a healthy bank balance for a badge!</li>
              </ul>
              <button onClick={() => setShowInstructions(false)} className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Freelancer Life</h1>
          <button onClick={() => setShowInstructions(true)} className="ml-auto px-3 py-2 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-purple-900 text-sm shadow border border-purple-300" title="How to Play?">
            How to Play?
          </button>
        </div>
        <p className="text-purple-100">Manage cash flow and delayed payments</p>
        
        {/* Status Bar */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold">Month {currentMonth}</div>
            <div className="text-purple-200">Timeline</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${bankBalance < 5000 ? 'text-red-300' : 'text-green-300'}`}>
              ₹{bankBalance.toLocaleString()}
            </div>
            <div className="text-purple-200">Bank Balance</div>
          </div>
          <div className="text-center">
            <div className="font-bold">₹{getPendingPayments().toLocaleString()}</div>
            <div className="text-purple-200">Pending</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Monthly Expenses Warning */}
        {bankBalance < monthlyExpenses && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-800">Cash Flow Warning!</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              You have ₹{bankBalance.toLocaleString()} but need ₹{monthlyExpenses.toLocaleString()} for monthly expenses.
            </p>
          </div>
        )}

        {/* Current Project */}
        {currentProject && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Current Project
            </h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{currentProject.client}</h4>
                  <p className="text-gray-600 text-sm">{currentProject.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentProject.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                  currentProject.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {currentProject.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">₹{currentProject.amount.toLocaleString()}</span>
                <button
                  onClick={completeProject}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Complete Project
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Payment expected {currentProject.paymentDelay} days after completion
              </p>
            </div>
          </div>
        )}

        {/* Available Projects */}
        {!currentProject && availableProjects.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Available Projects</h3>
            <div className="space-y-3">
              {availableProjects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{project.client}</h4>
                      <p className="text-gray-600 text-sm">{project.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                      project.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-600">₹{project.amount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">• {project.deadline} deadline</span>
                    </div>
                    <button
                      onClick={() => takeProject(project)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Take Project
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Payment delay: {project.paymentDelay} days
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-red-50 rounded-lg p-3">
              <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-red-600">₹{monthlyExpenses.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Expenses</div>
              <div className="text-xs text-gray-500 mt-1">Rent, Food, Bills</div>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">{6 - currentMonth}</div>
              <div className="text-sm text-gray-600">Months Left</div>
              <div className="text-xs text-gray-500 mt-1">Survive 6 months</div>
            </div>
          </div>
        </div>

        {/* Payments Timeline */}
        {completedProjects.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Payment Timeline</h3>
            <div className="space-y-2">
              {completedProjects.map((cp, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  cp.paidMonth <= currentMonth ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                } border`}>
                  <div>
                    <div className="font-medium text-gray-900">{cp.project.client}</div>
                    <div className="text-sm text-gray-600">Completed Month {cp.completedMonth}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${cp.paidMonth <= currentMonth ? 'text-green-600' : 'text-yellow-600'}`}>
                      ₹{Math.round(cp.project.amount * 0.8).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cp.paidMonth <= currentMonth ? 'Paid' : `Due Month ${cp.paidMonth}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Month Button */}
        <button
          onClick={nextMonth}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
        >
          Next Month →
        </button>

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-yellow-200">
          <h4 className="font-bold text-gray-900 mb-2">💡 Freelancer Tips</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Take projects even if payment is delayed - cash flow planning is key</li>
            <li>• Always ask for advance payments to cover immediate expenses</li>
            <li>• Track your expenses and maintain emergency funds</li>
          </ul>
        </div>
      </div>
      {showInstructions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xs w-full text-center shadow-xl border-4 border-purple-200 relative">
            <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 text-xl">✖️</button>
            <div className="text-4xl mb-2">🤔</div>
            <h2 className="font-bold text-lg mb-2">How to Play</h2>
            <ul className="text-left text-sm mb-4 list-disc pl-5 text-gray-700">
              <li>Your goal: Complete projects, manage your cash flow, and avoid running out of money.</li>
              <li>Pick projects, finish them, and wait for payments (some are delayed!).</li>
              <li>Each month, pay your expenses and see if you get paid for finished work.</li>
              <li>Try to finish with a healthy bank balance for a badge!</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold mt-2">Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerLife;