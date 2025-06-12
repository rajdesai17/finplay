import React, { useState } from 'react';
import { ArrowLeft, Calculator, FileText, DollarSign } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface TaxReturnGameProps {
  onBack: () => void;
}

interface TaxData {
  salary: number;
  rentPaid: number;
  lifeInsurance: number;
  ppfContribution: number;
  educationLoan: number;
  mediclaim: number;
}

function TaxReturnGame({ onBack }: TaxReturnGameProps) {
  const [step, setStep] = useState(1);
  const [taxData, setTaxData] = useState<TaxData>({
    salary: 600000,
    rentPaid: 120000,
    lifeInsurance: 25000,
    ppfContribution: 150000,
    educationLoan: 30000,
    mediclaim: 25000
  });
  const [userCalculation, setUserCalculation] = useState({
    taxableIncome: 0,
    taxOwed: 0,
    refundExpected: 0
  });
  const [showResult, setShowResult] = useState(false);
  const { addReward } = useUser();

  const calculateCorrectTax = () => {
    const { salary, rentPaid, lifeInsurance, ppfContribution, educationLoan, mediclaim } = taxData;
    
    // Section 80C deductions (max 1.5L)
    const section80C = Math.min(lifeInsurance + ppfContribution, 150000);
    
    // HRA deduction (40% of salary or actual rent paid, whichever is lower)
    const hraDeduction = Math.min(rentPaid, salary * 0.4);
    
    // Other deductions
    const educationLoanDeduction = educationLoan; // No limit for education loan interest
    const mediclaimDeduction = mediclaim; // Up to 25k for self
    
    const totalDeductions = section80C + hraDeduction + educationLoanDeduction + mediclaimDeduction;
    const taxableIncome = Math.max(salary - totalDeductions, 0);
    
    // Tax calculation (old regime)
    let tax = 0;
    if (taxableIncome > 250000) {
      if (taxableIncome <= 500000) {
        tax = (taxableIncome - 250000) * 0.05;
      } else if (taxableIncome <= 1000000) {
        tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2;
      } else {
        tax = 250000 * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3;
      }
    }
    
    // Add cess (4% of tax)
    tax = tax * 1.04;
    
    // TDS already deducted (assume 10% of salary as TDS)
    const tdsDeducted = salary * 0.1;
    
    return {
      taxableIncome: Math.round(taxableIncome),
      taxOwed: Math.round(tax),
      tdsDeducted: Math.round(tdsDeducted),
      refund: Math.round(tdsDeducted - tax)
    };
  };

  const handleCalculationSubmit = () => {
    const correctTax = calculateCorrectTax();
    const taxableIncomeDiff = Math.abs(userCalculation.taxableIncome - correctTax.taxableIncome);
    const taxOwedDiff = Math.abs(userCalculation.taxOwed - correctTax.taxOwed);
    
    // Calculate accuracy score
    const taxableIncomeAccuracy = Math.max(0, 100 - (taxableIncomeDiff / correctTax.taxableIncome) * 100);
    const taxOwedAccuracy = Math.max(0, 100 - (taxOwedDiff / Math.max(correctTax.taxOwed, 1)) * 100);
    const averageAccuracy = (taxableIncomeAccuracy + taxOwedAccuracy) / 2;
    
    setShowResult(true);
    
    let badge = undefined;
    if (averageAccuracy >= 80) {
      badge = {
        id: 'tax-ninja',
        name: 'Tax Ninja',
        icon: '🥷',
        description: 'Tax calculation expert',
        earned: true
      };
    }

    addReward({
      xp: Math.round(averageAccuracy),
      cashback: Math.round(averageAccuracy / 2),
      badge
    });
  };

  const resetGame = () => {
    setStep(1);
    setUserCalculation({
      taxableIncome: 0,
      taxOwed: 0,
      refundExpected: 0
    });
    setShowResult(false);
  };

  if (showResult) {
    const correctTax = calculateCorrectTax();
    const taxableIncomeDiff = Math.abs(userCalculation.taxableIncome - correctTax.taxableIncome);
    const taxOwedDiff = Math.abs(userCalculation.taxOwed - correctTax.taxOwed);
    const taxableIncomeAccuracy = Math.max(0, 100 - (taxableIncomeDiff / correctTax.taxableIncome) * 100);
    const taxOwedAccuracy = Math.max(0, 100 - (taxOwedDiff / Math.max(correctTax.taxOwed, 1)) * 100);
    const averageAccuracy = (taxableIncomeAccuracy + taxOwedAccuracy) / 2;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pb-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Tax Return Results</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Accuracy Score */}
          <div className={`rounded-3xl p-6 shadow-xl text-center text-white ${
            averageAccuracy >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
            averageAccuracy >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            'bg-gradient-to-r from-red-400 to-red-600'
          }`}>
            <div className="text-4xl mb-3">
              {averageAccuracy >= 80 ? '🏆' : averageAccuracy >= 60 ? '📊' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {averageAccuracy >= 80 ? 'Tax Expert!' : averageAccuracy >= 60 ? 'Good Effort!' : 'Keep Learning!'}
            </h2>
            <div className="text-3xl font-bold">{averageAccuracy.toFixed(0)}%</div>
            <p className="text-white/90">Calculation Accuracy</p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Your vs Correct Calculation</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Your Answer</th>
                    <th className="text-right py-2">Correct Answer</th>
                    <th className="text-right py-2">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Taxable Income</td>
                    <td className="text-right font-medium">₹{userCalculation.taxableIncome.toLocaleString()}</td>
                    <td className="text-right font-medium text-green-600">₹{correctTax.taxableIncome.toLocaleString()}</td>
                    <td className={`text-right ${taxableIncomeDiff === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {taxableIncomeDiff === 0 ? '✓' : `₹${taxableIncomeDiff.toLocaleString()}`}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Tax Owed</td>
                    <td className="text-right font-medium">₹{userCalculation.taxOwed.toLocaleString()}</td>
                    <td className="text-right font-medium text-green-600">₹{correctTax.taxOwed.toLocaleString()}</td>
                    <td className={`text-right ${taxOwedDiff === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {taxOwedDiff === 0 ? '✓' : `₹${taxOwedDiff.toLocaleString()}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Refund/Pay</td>
                    <td className="text-right font-medium">
                      {correctTax.refund > 0 ? `₹${correctTax.refund.toLocaleString()} refund` : `₹${Math.abs(correctTax.refund).toLocaleString()} to pay`}
                    </td>
                    <td className="text-right font-medium text-blue-600">Expected</td>
                    <td className="text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Tax Calculation Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Annual Salary</span>
                <span className="font-medium">₹{taxData.salary.toLocaleString()}</span>
              </div>
              <div className="text-gray-600 ml-4 space-y-1">
                <div className="flex justify-between">
                  <span>- HRA Deduction</span>
                  <span>₹{Math.min(taxData.rentPaid, taxData.salary * 0.4).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>- Section 80C (LIC + PPF)</span>
                  <span>₹{Math.min(taxData.lifeInsurance + taxData.ppfContribution, 150000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>- Education Loan Interest</span>
                  <span>₹{taxData.educationLoan.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>- Mediclaim Premium</span>
                  <span>₹{taxData.mediclaim.toLocaleString()}</span>
                </div>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Taxable Income</span>
                <span>₹{correctTax.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-red-600">
                <span>Tax Owed (with cess)</span>
                <span>₹{correctTax.taxOwed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>TDS Already Deducted</span>
                <span>₹{correctTax.tdsDeducted.toLocaleString()}</span>
              </div>
              <hr />
              <div className={`flex justify-between font-bold ${correctTax.refund > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>{correctTax.refund > 0 ? 'Refund Expected' : 'Additional Tax to Pay'}</span>
                <span>₹{Math.abs(correctTax.refund).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tax Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4">Tax Saving Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Maximize Section 80C deductions (PPF, ELSS, LIC) up to ₹1.5L</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Claim HRA if you pay rent (40% of salary or actual rent, whichever is lower)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Keep all investment and expense receipts for proof</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>File returns even if no tax is due - it's mandatory above ₹2.5L income</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetGame}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg transition-all duration-200"
            >
              More Simulations
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Tax Return Game</h1>
          </div>
          <p className="text-orange-100">Calculate your first income tax return</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Scenario Introduction */}
          <div className="bg-white rounded-3xl p-6 shadow-xl text-center border-4 border-orange-200">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Tax Scenario</h2>
            <p className="text-gray-600 mb-6">
              You're 24 years old, working at a tech company in Bangalore. 
              Time to file your first income tax return!
            </p>
          </div>

          {/* Income and Deductions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              Your Financial Details
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Annual Salary</div>
                  <div className="text-xl font-bold text-blue-600">₹6,00,000</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Monthly Rent Paid</div>
                  <div className="text-xl font-bold text-green-600">₹10,000</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Your Investments & Expenses</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>Life Insurance Premium</span>
                    <span className="font-medium">₹25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPF Contribution</span>
                    <span className="font-medium">₹1,50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Education Loan Interest</span>
                    <span className="font-medium">₹30,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mediclaim Premium</span>
                    <span className="font-medium">₹25,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 border-orange-200">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-orange-600" />
              Your Task
            </h4>
            <p className="text-gray-700 text-sm mb-3">
              Calculate your taxable income and tax owed using the given financial details. 
              Remember to apply all eligible deductions!
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Section 80C limit: ₹1,50,000 (LIC + PPF)</li>
              <li>• HRA deduction: 40% of salary or actual rent</li>
              <li>• Tax slabs: 0-2.5L (0%), 2.5-5L (5%), 5L+ (20%)</li>
              <li>• Add 4% cess on calculated tax</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200"
          >
            Start Calculating →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setStep(1)} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Calculate Your Tax</h1>
        </div>
        <p className="text-orange-100">Enter your calculations below</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Reference */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-3">Quick Reference</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-medium">Income: ₹6,00,000</div>
              <div>Rent: ₹10,000/month</div>
            </div>
            <div>
              <div>LIC: ₹25,000, PPF: ₹1,50,000</div>
              <div>Education Loan: ₹30,000, Mediclaim: ₹25,000</div>
            </div>
          </div>
        </div>

        {/* Calculation Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4">Your Calculations</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taxable Income (after all deductions)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={userCalculation.taxableIncome || ''}
                  onChange={(e) => setUserCalculation(prev => ({
                    ...prev,
                    taxableIncome: Number(e.target.value)
                  }))}
                  placeholder="Enter taxable income"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Owed (including 4% cess)
              </label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={userCalculation.taxOwed || ''}
                  onChange={(e) => setUserCalculation(prev => ({
                    ...prev,
                    taxOwed: Number(e.target.value)
                  }))}
                  placeholder="Enter tax amount"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Calculation Helper */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4 border-2 border-blue-200">
          <h4 className="font-bold text-gray-900 mb-2">💡 Calculation Hints</h4>
          <div className="text-sm text-gray-700 space-y-1">
            <div>1. Start with salary: ₹6,00,000</div>
            <div>2. Subtract HRA: min(₹1,20,000, 40% of salary)</div>
            <div>3. Subtract Section 80C: min(₹1,75,000, ₹1,50,000)</div>
            <div>4. Subtract other deductions: ₹30,000 + ₹25,000</div>
            <div>5. Apply tax slabs and add 4% cess</div>
          </div>
        </div>

        <button
          onClick={handleCalculationSubmit}
          disabled={!userCalculation.taxableIncome || !userCalculation.taxOwed}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-2xl font-bold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Tax Calculation
        </button>
      </div>
    </div>
  );
}

export default TaxReturnGame;