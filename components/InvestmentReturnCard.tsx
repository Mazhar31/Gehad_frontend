
import React from 'react';

const InvestmentReturnCard: React.FC = () => {
  return (
    <div className="bg-card-bg p-4 sm:p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-1">Investment Return</h3>
      <p className="text-sm text-secondary-text mb-4">30 days performance</p>
      
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-white">$12,890.00</p>
        <p className="text-accent-green font-semibold">+12.5%</p>
      </div>

      <div className="flex justify-between text-sm">
        <div>
            <p className="text-secondary-text">Invested</p>
            <p className="text-white font-semibold">$10,000</p>
        </div>
        <div>
            <p className="text-secondary-text">Profit</p>
            <p className="text-white font-semibold">$2,890</p>
        </div>
        <div>
            <p className="text-secondary-text">Loss</p>
            <p className="text-white font-semibold">$0</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentReturnCard;
