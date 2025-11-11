
import React from 'react';

const MOCK_CHART_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const InvestmentGrowthCard: React.FC = () => {
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } = (window as any).Recharts || {};

  return (
    <div className="bg-card-bg p-4 sm:p-6 rounded-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Project Growth</h3>
        <div className="flex space-x-2">
            <button className="text-xs text-white bg-white/10 px-3 py-1 rounded-md">6M</button>
            <button className="text-xs text-secondary-text hover:text-white px-3 py-1 rounded-md">1Y</button>
            <button className="text-xs text-secondary-text hover:text-white px-3 py-1 rounded-md">All</button>
        </div>
      </div>
      <div className="h-72">
        {ResponsiveContainer && AreaChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-secondary-text">
                Chart library not available.
            </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentGrowthCard;
