
import React, { useState } from 'react';
import { 
    RefreshIcon, 
    Squares2X2Icon, 
    AlertTriangleIcon, 
    ClockIcon, 
    UserGroupIcon, 
    ChatBubbleLeftRightIcon, 
    ChartTrendingUpIcon, 
    UsersIcon, 
    LightbulbIcon, 
    MagnifyingGlassIcon,
    CheckCircleIcon,
    ArrowTopRightOnSquareIcon
} from './icons.tsx';

interface ProblemScenario {
    id: number;
    icon: React.ElementType;
    title: string;
    problem: string;
    solution: string;
    impact: string[];
    image: string;
}

const scenarios: ProblemScenario[] = [
    {
        id: 1,
        icon: RefreshIcon,
        title: "Repetitive Manual Reporting",
        problem: "Every week or month, teams repeat the exact same report: copy → paste → clean → update → build → export → send. It’s slow. It’s painful. It’s error-prone.",
        solution: "Upload Excel → dashboard updates instantly → done. The story, insights, forecasts, and visuals auto-refresh.",
        impact: ["Saves hours per report", "Zero manual rebuilds", "Fast, clean updates every time"],
        // Abstract Automation / Flow
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop" 
    },
    {
        id: 2,
        icon: Squares2X2Icon,
        title: "Inconsistent Reports Across Departments",
        problem: "Different employees create different KPIs, formats, colors, and conclusions.",
        solution: "You define the dashboard logic once. Every user sees the same narrative, visuals, and insight flow.",
        impact: ["Consistent reporting across the company", "One source of truth", "No more “wrong version” confusion"],
        // Abstract Alignment / Structure
        image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        icon: AlertTriangleIcon,
        title: "Excel Complexity & Human Errors",
        problem: "Excel files break easily: Wrong formulas, deleted columns, version conflicts, mistyped values, misaligned formats. One small mistake ruins the whole report.",
        solution: "AI validates the uploaded Excel file before generating anything. It checks structure, data types, formatting, and logic errors.",
        impact: ["Fewer mistakes", "Cleaner data", "Reliable results every time"],
        // Data Code / Complexity
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        icon: ClockIcon,
        title: "Teams With Tight Deadlines",
        problem: "Finance, HR, Sales, and Operations teams all face deadlines. End of month. End of quarter. End of year. And they spend half that time fixing spreadsheets.",
        solution: "A fully automated dashboard that updates in minutes.",
        impact: ["Reports delivered on time", "No last-minute Excel drama", "More time for real work"],
        // Speed / Motion
        image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        icon: UserGroupIcon,
        title: "Lack of Data Skills",
        problem: "Not everyone knows how to build charts, pivot tables, DAX measures, or KPIs.",
        solution: "Users don’t need skills. They just upload their Excel — everything else is automated. You (as the admin) build the logic once. They reuse it forever.",
        impact: ["No need for Power BI experts", "No more “Who can build this chart?”", "Simple for everyone"],
        // AI / Neural Network
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        icon: ChatBubbleLeftRightIcon,
        title: "Data Without Context",
        problem: "Numbers without narrative leave decision-makers guessing 'Why?'.",
        solution: "Storytelling dashboards with automated narrative chapters and highlights.",
        impact: ["Clearer insights", "Faster decisions"],
        // Network / Connection - Updated Image to fix broken link
        image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 10,
        icon: MagnifyingGlassIcon,
        title: "Wasted Search Time",
        problem: "Digging through rows and columns to find the root cause of variance.",
        solution: "Drill-down capabilities and root-cause highlighting built-in.",
        impact: ["Instant answers", "Deep visibility"],
        // Digital Interface / Search
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 8,
        icon: UsersIcon,
        title: "Agency Dependence",
        problem: "Waiting days and paying thousands for an agency to update a chart.",
        solution: "Take control. Update logic internally once, apply it forever.",
        impact: ["Cost reduction", "Agility"],
        // Analytics Interface / Control
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 9,
        icon: LightbulbIcon,
        title: "Decision-Makers Need Insights",
        problem: "Leaders don’t want spreadsheets — they want answers.",
        solution: "Executive summaries, trend explanations, insight blocks, and forecasts.",
        impact: ["Faster leadership decisions", "Clear communication", "Better alignment across the org"],
        // Growth Chart / Success
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    }
];

const ProblemsWeSolve: React.FC = () => {
    const [activeCard, setActiveCard] = useState<number | null>(null);

    const handleCardClick = (id: number) => {
        setActiveCard(activeCard === id ? null : id);
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-medium font-playfair text-gray-100 tracking-tight mb-6">
                        Problems We <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-playfair font-medium">Solve</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto font-geist">
                        Transforming data chaos into clarity. Click on a card to reveal the solution.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {scenarios.map((item) => {
                        const isFlipped = activeCard === item.id;
                        
                        return (
                            <div 
                                key={item.id}
                                className="h-[420px] perspective-1000 cursor-pointer"
                                onClick={() => handleCardClick(item.id)}
                            >
                                <div 
                                    className="relative w-full h-full transition-transform duration-700 transform-style-3d"
                                    style={{ 
                                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
                                    }}
                                >
                                    {/* --- FRONT FACE --- */}
                                    <div 
                                        className="absolute inset-0 w-full h-full backface-hidden bg-[#080808] border border-white/10 rounded-3xl overflow-hidden flex flex-col"
                                        style={{ 
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(0deg)' // Explicitly at 0
                                        }}
                                    >
                                        {/* Top: Content */}
                                        <div className="p-6 bg-[#080808] border-b border-white/5 z-20 relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Problem</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2 font-playfair">{item.title}</h3>
                                            <p className="text-sm text-gray-400 font-geist line-clamp-3">{item.problem}</p>
                                        </div>

                                        {/* Bottom: Image */}
                                        <div className="relative flex-1 w-full overflow-hidden group">
                                            <img 
                                                src={item.image} 
                                                alt="Abstract Concept" 
                                                className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-110" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent"></div>
                                            
                                            {/* Tap Indication */}
                                            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 p-2 rounded-full">
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-white/80" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- BACK FACE --- */}
                                    <div 
                                        className="absolute inset-0 w-full h-full backface-hidden bg-[#0A0A0A] border border-blue-500/30 rounded-3xl overflow-hidden"
                                        style={{ 
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)' // Explicitly pre-rotated
                                        }}
                                    >
                                        {/* Blurred Background Image */}
                                        <div className="absolute inset-0">
                                            <img src={item.image} alt="" className="w-full h-full object-cover blur-xl opacity-30" />
                                            <div className="absolute inset-0 bg-black/80"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 p-8 flex flex-col h-full">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                                    <CheckCircleIcon className="w-3 h-3 text-green-400" />
                                                    <span className="text-[10px] font-bold tracking-widest text-green-400 uppercase">Solution</span>
                                                </div>
                                            </div>

                                            <p className="text-lg font-medium text-white leading-relaxed font-geist mb-8">
                                                {item.solution}
                                            </p>

                                            <div className="mt-auto bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                                                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-3">The Impact</p>
                                                <ul className="space-y-2">
                                                    {item.impact.map((point, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        </section>
    );
};

export default ProblemsWeSolve;
