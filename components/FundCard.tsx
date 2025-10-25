

import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { Fund } from '../types.ts';
// FIX: Added file extension to import to resolve module error.
import { ShoppingCartIcon } from './icons.tsx';

const FundCard: React.FC<Fund> = ({ category, name, fundSize, returnPA, risk, riskColor }) => {
  const isPositive = returnPA.startsWith('+');
  return (
    <div className="bg-card-bg p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
      <div className="flex-1">
        <p className="text-xs text-blue-400 mb-1">{category}</p>
        <h4 className="font-semibold text-white">{name}</h4>
      </div>
      <div className="flex items-center space-x-6 w-full md:w-auto">
        <div>
          <p className="text-xs text-text-secondary">Fund Size</p>
          <p className="font-semibold text-white">{fundSize}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Return(P.A.)</p>
          <p className={`font-semibold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>{returnPA}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary">Risk</p>
          <p className={`font-semibold ${riskColor}`}>{risk}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto pt-2 md:pt-0 md:pl-6">
        <button className="text-sm bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-1/2 md:w-auto">Invest Now</button>
        <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 flex items-center justify-center space-x-2 w-1/2 md:w-auto">
          <ShoppingCartIcon className="w-4 h-4" />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
};

export default FundCard;