
import React, { useState } from 'react';
import { 
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, 
    PieChart, Pie, Cell, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
    ChartTrendingUpIcon, 
    ArrowDownTrayIcon, 
    CpuChipIcon, 
    BanknotesIcon, 
    UsersIcon, 
    BoxIcon, 
    MapPinIcon 
} from './icons.tsx';

// --- Mock Data ---

const revenueData = [
  { name: 'Jan', revenue: 4000, target: 3800 },
  { name: 'Feb', revenue: 3000, target: 3200 },
  { name: 'Mar', revenue: 5000, target: 4500 },
  { name: 'Apr', revenue: 4780, target: 4600 },
  { name: 'May', revenue: 5890, target: 5000 },
  { name: 'Jun', revenue: 6390, target: 6000 },
  { name: 'Jul', revenue: 7490, target: 7000 },
  { name: 'Aug', revenue: 8200, target: 7800 },
  { name: 'Sep', revenue: 9100, target: 8500 },
  { name: 'Oct', revenue: 9900, target: 9200 },
  { name: 'Nov', revenue: 10500, target: 10000 },
  { name: 'Dec', revenue: 12200, target: 11500 },
];

const ebitdaData = [
  { name: 'Q1', ebitda: 2400, expenses: 1500 },
  { name: 'Q2', ebitda: 3900, expenses: 1800 },
  { name: 'Q3', ebitda: 5800, expenses: 2100 },
  { name: 'Q4', ebitda: 7500, expenses: 2400 },
];

const profitData = [
  { name: 'Jan', margin: 18, profit: 1200 },
  { name: 'Feb', margin: 20, profit: 1500 },
  { name: 'Mar', margin: 22, profit: 2100 },
  { name: 'Apr', margin: 19, profit: 1800 },
  { name: 'May', margin: 24, profit: 2800 },
  { name: 'Jun', margin: 25, profit: 3100 },
];

const expenseBreakdown = [
  { name: 'R&D', value: 35 },
  { name: 'Sales', value: 30 },
  { name: 'Marketing', value: 20 },
  { name: 'G&A', value: 15 },
];

const topProducts = [
  { name: 'Enterprise License', revenue: '$4.2M', growth: '+12%' },
  { name: 'Cloud Subscription', revenue: '$3.8M', growth: '+24%' },
  { name: 'Consulting Services', revenue: '$1.5M', growth: '+5%' },
  { name: 'Add-on Modules', revenue: '$800k', growth: '+18%' },
];

const regionalProfit = [
  { region: 'North America', profit: '$1.8M', margin: '28%' },
  { region: 'Europe', profit: '$850k', margin: '22%' },
  { region: 'Asia Pacific', profit: '$620k', margin: '18%' },
];

const insights = {
    revenue: [
        "Q4 Revenue projected to exceed targets by 15%.",
        "Recurring revenue up 8% month-over-month.",
        "Top performing region: North America."
    ],
    ebitda: [
        "Operational efficiency improved EBITDA margin by 5%.",
        "Cost reduction strategies in Q2 showing impact.",
        "Projected year-end EBITDA: $6.2M."
    ],
    profit: [
        "Net Profit margin hit an all-time high of 24%.",
        "Investment income contributed 12% to bottom line.",
        "Shareholder value increased by 18% YTD."
    ]
};

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

type MetricType = 'revenue' | 'ebitda' | 'profit';

const HeroDashboard: React.FC = () => {
    const [activeMetric, setActiveMetric] = useState<MetricType>('revenue');

    const kpiCards = [
        { 
            id: 'revenue', 
            label: 'Total Revenue', 
            value: '$12.5M', 
            change: '+12.5%', 
            trend: 'up',
            color: '#3B82F6', // blue
            gradient: 'from-blue-500/20 to-blue-600/5'
        },
        { 
            id: 'ebitda', 
            label: 'EBITDA', 
            value: '$4.2M', 
            change: '+8.1%', 
            trend: 'up',
            color: '#8B5CF6', // purple
            gradient: 'from-purple-500/20 to-purple-600/5'
        },
        { 
            id: 'profit', 
            label: 'Net Profit', 
            value: '$2.8M', 
            change: '+15.3%', 
            trend: 'up',
            color: '#10B981', // emerald
            gradient: 'from-emerald-500/20 to-emerald-600/5'
        }
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-neutral-900/95 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md z-50">
                    <p className="text-gray-400 text-xs mb-1">{label}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} className="text-sm font-bold" style={{ color: p.color }}>
                            {p.name}: ${new Intl.NumberFormat('en-US').format(p.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // --- Views ---

    const renderRevenueView = () => (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
            {/* Mini Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">ARR</p>
                    <p className="text-sm sm:text-lg font-bold text-white">$10.2M</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">New Customers</p>
                    <p className="text-sm sm:text-lg font-bold text-green-400">+142</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Churn Rate</p>
                    <p className="text-sm sm:text-lg font-bold text-red-400">2.1%</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="md:col-span-2 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tickLine={false} axisLine={false} tick={{fontSize: 10}} dy={10} />
                            <YAxis stroke="#666" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 10}} />
                            <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}} />
                            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="target" stroke="#60A5FA" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Table */}
                <div className="md:col-span-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 sticky top-0 bg-[#0F1115] py-1">Top Products</h4>
                    <div className="space-y-3">
                        {topProducts.map((prod, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                                        <BoxIcon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{prod.name}</p>
                                        <p className="text-xs text-green-400">{prod.growth}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">{prod.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEbitdaView = () => (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
             {/* Mini Cards */}
             <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">OpEx Ratio</p>
                    <p className="text-sm sm:text-lg font-bold text-white">32%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Gross Margin</p>
                    <p className="text-sm sm:text-lg font-bold text-purple-400">68%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Efficiency</p>
                    <p className="text-sm sm:text-lg font-bold text-white">94/100</p>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Composed Chart */}
                <div className="h-[300px] w-full">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">EBITDA vs Expenses</h4>
                    <ResponsiveContainer width="100%" height="90%">
                        <ComposedChart data={ebitdaData}>
                            <CartesianGrid stroke="#333" vertical={false} strokeDasharray="3 3"/>
                            <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="expenses" barSize={30} fill="#4B5563" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="ebitda" stroke="#8B5CF6" strokeWidth={3} dot={{r: 4, fill: '#8B5CF6'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-[300px] w-full flex flex-col items-center">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expense Breakdown</h4>
                    <div className="w-full flex-grow relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333'}} itemStyle={{color: '#fff'}} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">Total</p>
                                <p className="text-xs text-gray-400">Expenses</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center mt-2 flex-wrap">
                        {expenseBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                <span className="text-xs text-gray-400">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderProfitView = () => (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
             {/* Mini Cards */}
             <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Net Margin</p>
                    <p className="text-sm sm:text-lg font-bold text-emerald-400">24%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Tax Est.</p>
                    <p className="text-sm sm:text-lg font-bold text-white">$520k</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/5">
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">Dividends</p>
                    <p className="text-sm sm:text-lg font-bold text-white">$1.2M</p>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="md:col-span-2 h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={profitData}>
                            <CartesianGrid stroke="#333" vertical={false} strokeDasharray="3 3"/>
                            <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#666" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="margin" stroke="#34D399" strokeWidth={2} strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Regional Table */}
                <div className="md:col-span-1">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Regional Profitability</h4>
                    <div className="space-y-3">
                        {regionalProfit.map((reg, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPinIcon className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-white">{reg.region}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500">Profit</p>
                                        <p className="text-sm font-bold text-white">{reg.profit}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Margin</p>
                                        <p className="text-sm font-bold text-emerald-400">{reg.margin}</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                    <div 
                                        className="bg-emerald-500 h-1.5 rounded-full" 
                                        style={{ width: reg.margin }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-[#0A0A0A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            {/* Header Bar */}
            <div className="border-b border-white/5 px-6 py-4 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-geist text-gray-500 uppercase tracking-widest">OneQlek Financial Overview 2024</div>
                <div className="w-16"></div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Column: KPI Selection */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {kpiCards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => setActiveMetric(card.id as MetricType)}
                            className={`relative p-5 rounded-xl text-left transition-all duration-300 border group
                                ${activeMetric === card.id 
                                    ? `bg-gradient-to-r ${card.gradient} border-${card.color} shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)]` 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }
                            `}
                            style={{ borderColor: activeMetric === card.id ? card.color : '' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-gray-400 font-geist">{card.label}</span>
                                {activeMetric === card.id && (
                                    <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: card.color }}></div>
                                )}
                            </div>
                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-bold text-white font-geist tracking-tight">{card.value}</span>
                                <span className={`text-sm font-medium mb-1 flex items-center ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                    {card.trend === 'up' ? <ChartTrendingUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownTrayIcon className="w-3 h-3 mr-1" />}
                                    {card.change}
                                </span>
                            </div>
                            
                            {/* Active Indicator Glow */}
                            {activeMetric === card.id && (
                                <div 
                                    className="absolute inset-0 rounded-xl opacity-20 pointer-events-none transition-opacity duration-500"
                                    style={{ boxShadow: `inset 0 0 20px ${card.color}` }}
                                ></div>
                            )}
                        </button>
                    ))}

                    {/* AI Insights Box */}
                    <div className="mt-auto bg-gradient-to-b from-gray-900 to-black rounded-xl border border-white/10 p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                            <CpuChipIcon className="w-5 h-5" />
                            <span className="text-xs font-bold tracking-wider uppercase">AI Analysis</span>
                        </div>
                        <ul className="space-y-3">
                            {insights[activeMetric].map((insight, idx) => (
                                <li key={idx} className="flex gap-3 text-sm text-gray-400 font-geist leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Dynamic Content */}
                <div className="lg:col-span-2 bg-white/5 rounded-xl border border-white/5 p-6 flex flex-col relative min-h-[500px]">
                    <div className="flex-grow w-full h-full">
                        {activeMetric === 'revenue' && renderRevenueView()}
                        {activeMetric === 'ebitda' && renderEbitdaView()}
                        {activeMetric === 'profit' && renderProfitView()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDashboard;
