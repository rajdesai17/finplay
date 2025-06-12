import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: { text: string; type: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What's your dream weekend?",
    options: [
      { text: "Building a startup idea", type: "entrepreneur" },
      { text: "Learning new skills online", type: "corporate" },
      { text: "Working on creative projects", type: "freelancer" },
      { text: "Chilling with friends", type: "balanced" },
    ]
  },
  {
    id: 2,
    question: "How do you prefer to earn money?",
    options: [
      { text: "Multiple income streams", type: "entrepreneur" },
      { text: "Steady monthly salary", type: "corporate" },
      { text: "Project-based payments", type: "freelancer" },
      { text: "Part-time flexible work", type: "balanced" },
    ]
  },
  {
    id: 3,
    question: "Your ideal workspace is:",
    options: [
      { text: "Co-working space with networking", type: "entrepreneur" },
      { text: "Corporate office with team", type: "corporate" },
      { text: "Home office with flexibility", type: "freelancer" },
      { text: "Mix of office and remote", type: "balanced" },
    ]
  },
  {
    id: 4,
    question: "When planning finances, you:",
    options: [
      { text: "Take calculated risks for growth", type: "entrepreneur" },
      { text: "Follow systematic investment plans", type: "corporate" },
      { text: "Save for irregular income periods", type: "freelancer" },
      { text: "Balance saving and spending", type: "balanced" },
    ]
  }
];

const careerResults = {
  entrepreneur: {
    title: "The Hustler 🚀",
    description: "You're born to build! You love taking risks and creating multiple income streams.",
    advice: "Focus on learning about startup funding, business loans, and investment diversification. Consider starting a side business while studying!",
    financialTips: [
      "Learn about equity and angel investors",
      "Start with small investments in mutual funds",
      "Keep 6-month emergency fund for business risks",
      "Explore government startup schemes like Startup India"
    ]
  },
  corporate: {
    title: "The Professional 💼",
    description: "You prefer stability and structured growth. Perfect for the corporate world!",
    advice: "Master salary negotiation, tax planning, and systematic investments. Your steady income is your superpower!",
    financialTips: [
      "Maximize EPF and PPF contributions",
      "Start SIP in index funds early",
      "Learn about salary structuring for tax benefits",
      "Build a diversified investment portfolio"
    ]
  },
  freelancer: {
    title: "The Creative 🎨",
    description: "Freedom and flexibility are your priorities. You're perfect for the gig economy!",
    advice: "Learn to manage irregular income, build multiple client streams, and save for lean periods.",
    financialTips: [
      "Maintain 3-6 months emergency fund",
      "Learn about freelancer tax deductions",
      "Use digital payment tools effectively",
      "Consider professional indemnity insurance"
    ]
  },
  balanced: {
    title: "The Balanced One ⚖️",
    description: "You want the best of all worlds - work-life balance with financial growth!",
    advice: "Explore hybrid careers, part-time opportunities, and balanced investment strategies.",
    financialTips: [
      "Start with simple investment options",
      "Balance high-risk and safe investments",
      "Learn about work-life financial planning",
      "Consider part-time passive income ideas"
    ]
  }
};

function CareerQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const counts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (showResult) {
    const resultType = getResult() as keyof typeof careerResults;
    const result = careerResults[resultType];

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Career Path</h1>
          <p className="text-gray-600 text-lg">Discover your financial personality</p>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{result.title.split(' ').pop()}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{result.title}</h2>
              <p className="text-gray-600 text-xl leading-relaxed">{result.description}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Your Financial Strategy
              </h3>
              <p className="text-gray-700 mb-6 text-base leading-relaxed">{result.advice}</p>
              
              <h4 className="font-bold text-gray-900 mb-4">Top Tips for You:</h4>
              <ul className="space-y-3">
                {result.financialTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 font-bold text-lg">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 hover:shadow-lg"
              >
                Take Quiz Again
              </button>
              
              <div className="text-center">
                <p className="text-gray-600">
                  Share your result and start your financial journey! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Career Quiz</h1>
          <span className="text-sm bg-gray-100 rounded-full px-4 py-2 font-semibold text-gray-700">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
        <p className="text-gray-600 text-lg mb-6">Discover your ideal financial path</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.type)}
                className="w-full text-left p-6 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="text-gray-900 font-semibold text-lg">{option.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Answer honestly to get the best career advice! 💡
          </p>
        </div>
      </div>
    </div>
  );
}

export default CareerQuiz;