import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

const TERMS = [
  { term: 'FD', emoji: '🏦', explanation: 'Fixed Deposit: A savings account with a fixed interest rate and maturity date.' },
  { term: 'SIP', emoji: '📈', explanation: 'Systematic Investment Plan: Invest a fixed amount regularly in mutual funds.' },
  { term: 'EMI', emoji: '💳', explanation: 'Equated Monthly Installment: Fixed payment made to repay a loan.' },
  { term: 'Credit Score', emoji: '⭐', explanation: 'A number that shows how trustworthy you are with credit and loans.' },
  { term: 'Tax Slab', emoji: '🧾', explanation: 'Income range taxed at a particular rate.' },
  { term: 'UPI', emoji: '📲', explanation: 'Unified Payments Interface: Instant money transfer system in India.' },
  { term: 'Mutual Fund', emoji: '💼', explanation: 'A pool of money from many investors to buy stocks, bonds, etc.' },
  { term: 'Principal', emoji: '💰', explanation: 'The original sum of money invested or loaned.' },
  { term: 'Interest', emoji: '📊', explanation: 'Extra money paid for borrowing or earned for saving.' },
  { term: 'Debit Card', emoji: '🏧', explanation: 'A card to spend your own money from your bank account.' },
  { term: 'Credit Card', emoji: '💳', explanation: 'A card to borrow money up to a limit for purchases.' },
  { term: 'Net Banking', emoji: '💻', explanation: 'Managing your bank account online.' },
  { term: 'KYC', emoji: '🪪', explanation: 'Know Your Customer: Process to verify your identity at banks.' },
  { term: 'Inflation', emoji: '📈', explanation: "Rise in prices over time, reducing money's value." },
  { term: 'Budget', emoji: '📝', explanation: 'A plan for how to spend and save your money.' },
  { term: 'Savings Account', emoji: '🏦', explanation: 'A bank account to keep and grow your money safely.' },
  { term: 'Loan', emoji: '🤝', explanation: 'Money borrowed that must be paid back with interest.' },
  { term: 'Insurance', emoji: '🛡️', explanation: 'A policy that protects you from financial loss.' },
  { term: 'ATM', emoji: '🏧', explanation: 'Automated Teller Machine: Lets you withdraw or deposit cash.' },
  { term: 'NEFT', emoji: '💸', explanation: 'National Electronic Funds Transfer: A way to send money between banks.' },
];

const TIPS = [
  'Learning the lingo helps you make smarter money moves!',
  'Knowing these terms can help you avoid scams and mistakes.',
  'Understanding finance words makes you a money pro!',
  'Ask questions if you don\'t know a term — curiosity pays!',
];

function FinanceGlossary() {
  const [selected, setSelected] = useState<number | null>(null);
  const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white flex flex-col items-center font-sans">
      <div className="w-full max-w-[420px] flex flex-col flex-1 mx-auto shadow-lg rounded-2xl bg-white/80 mt-4 mb-6">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-10 bg-white/90 rounded-t-2xl flex items-center gap-2 px-4 py-3 border-b border-blue-100 shadow-sm">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-blue-50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <h2 className="flex-1 text-xl font-extrabold text-blue-700 text-center tracking-tight">Learn the Lingo</h2>
        </div>
        {/* Glossary Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TERMS.map((item, idx) => (
            <button
              key={item.term}
              className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-xl shadow-md p-3 font-semibold text-blue-800 text-center transition-all duration-150 cursor-pointer border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => setSelected(idx)}
              aria-label={`Learn about ${item.term}`}
            >
              <span className="text-2xl mb-1">{item.emoji}</span>
              <span className="text-base font-bold leading-tight">{item.term}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Modal for Explanation */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl animate-slide-up relative border-2 border-blue-100">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
              onClick={() => setSelected(null)}
              aria-label="Close explanation"
            >
              ×
            </button>
            <div className="flex flex-col items-center mb-2">
              <span className="text-4xl mb-2">{TERMS[selected].emoji}</span>
              <h3 className="text-xl font-extrabold mb-1 text-blue-700 text-center">{TERMS[selected].term}</h3>
            </div>
            <p className="text-gray-700 text-base mb-3 text-center">{TERMS[selected].explanation}</p>
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 mt-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-700 font-medium">{randomTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceGlossary; 