import React, { useState } from 'react';

const TERMS = [
  { term: 'FD', explanation: 'Fixed Deposit: A savings account with a fixed interest rate and maturity date.' },
  { term: 'SIP', explanation: 'Systematic Investment Plan: Invest a fixed amount regularly in mutual funds.' },
  { term: 'EMI', explanation: 'Equated Monthly Installment: Fixed payment made to repay a loan.' },
  { term: 'Credit Score', explanation: 'A number that shows how trustworthy you are with credit and loans.' },
  { term: 'Tax Slab', explanation: 'Income range taxed at a particular rate.' },
  { term: 'UPI', explanation: 'Unified Payments Interface: Instant money transfer system in India.' },
  { term: 'Mutual Fund', explanation: 'A pool of money from many investors to buy stocks, bonds, etc.' },
  { term: 'Principal', explanation: 'The original sum of money invested or loaned.' },
  { term: 'Interest', explanation: 'Extra money paid for borrowing or earned for saving.' },
  { term: 'Debit Card', explanation: 'A card to spend your own money from your bank account.' },
  { term: 'Credit Card', explanation: 'A card to borrow money up to a limit for purchases.' },
  { term: 'Net Banking', explanation: 'Managing your bank account online.' },
  { term: 'KYC', explanation: 'Know Your Customer: Process to verify your identity at banks.' },
  { term: 'Inflation', explanation: 'Rise in prices over time, reducing money\'s value.' },
  { term: 'Budget', explanation: 'A plan for how to spend and save your money.' },
  { term: 'Savings Account', explanation: 'A bank account to keep and grow your money safely.' },
  { term: 'Loan', explanation: 'Money borrowed that must be paid back with interest.' },
  { term: 'Insurance', explanation: 'A policy that protects you from financial loss.' },
  { term: 'ATM', explanation: 'Automated Teller Machine: Lets you withdraw or deposit cash.' },
  { term: 'NEFT', explanation: 'National Electronic Funds Transfer: A way to send money between banks.' },
];

function FinanceGlossary() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Learn the Lingo</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TERMS.map((item, idx) => (
          <button
            key={item.term}
            className="bg-white rounded-xl shadow-md p-4 text-center font-semibold hover:bg-blue-50 transition cursor-pointer border border-blue-100"
            onClick={() => setSelected(idx)}
            aria-label={`Learn about ${item.term}`}
          >
            {item.term}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-slide-up relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setSelected(null)}
              aria-label="Close explanation"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">{TERMS[selected].term}</h3>
            <p className="text-gray-700 text-base mb-2">{TERMS[selected].explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceGlossary; 