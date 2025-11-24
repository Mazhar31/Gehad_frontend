import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Low', value: 1 }, { name: 'Moderate', value: 1 }, { name: 'High', value: 1 },
  { name: 'Very High', value: 1 }, { name: 'Very High', value: 1 },
];
const COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#DC2626'];
const value = 90;
const needleAngle = (value / 120) * 180; // Assuming max value is 120 for the gauge range

const RiskometerCard: React.FC = () => {
  return (
    <div className="bg-card-bg p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Scheme Riskometer</h3>
      <div className="relative w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={80}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        <div 
            className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[105px] w-0.5 h-20 bg-white origin-bottom"
            style={{ transform: `translateX(-50%) translateY(-105px) rotate(${needleAngle}deg)` }}
        ></div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[110px] w-4 h-4 bg-white rounded-full border-2 border-card-bg"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
            <span className="text-4xl font-bold text-white">90</span>
        </div>

        <div className="absolute w-full top-[calc(100%-60px)] flex justify-between text-xs text-text-secondary px-2">
            <span>Low</span>
            <span className="pl-8">Moderate</span>
            <span className="pr-8">High</span>
            <span>Very High</span>
        </div>
      </div>
      <p className="text-center text-sm text-text-secondary mt-2">
        Investors understand that their principal will be at <span className="text-red-400 font-semibold">very high risk</span>
      </p>
    </div>
  );
};

export default RiskometerCard;