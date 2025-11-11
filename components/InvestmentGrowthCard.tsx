import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
  const { ResponsiveContainer: FallbackResponsiveContainer, AreaChart: FallbackAreaChart, Area: FallbackArea, XAxis: FallbackXAxis, YAxis: FallbackYAxis, Tooltip: FallbackTooltip, CartesianGrid: FallbackCartesianGrid } = (window as any).Recharts || {};
  
  // Use imported components first, fallback to window.Recharts if import fails
  const ChartComponents = {
    ResponsiveContainer: ResponsiveContainer || FallbackResponsiveContainer,
    AreaChart: AreaChart || FallbackAreaChart,
    Area: Area || FallbackArea,
    XAxis: XAxis || FallbackXAxis,
    YAxis: YAxis || FallbackYAxis,
    Tooltip: Tooltip || FallbackTooltip,
    CartesianGrid: CartesianGrid || FallbackCartesianGrid
  };
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
        {ChartComponents.ResponsiveContainer && ChartComponents.AreaChart ? (
          <ChartComponents.ResponsiveContainer width="100%" height="100%">
            <ChartComponents.AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <ChartComponents.XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <ChartComponents.YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <ChartComponents.CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <ChartComponents.Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }} />
              <ChartComponents.Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </ChartComponents.AreaChart>
          </ChartComponents.ResponsiveContainer>
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
