
import React, { useState } from 'react';
import { 
    DocumentTextIcon, 
    CpuChipIcon, 
    Squares2X2Icon, 
    ArrowUpTrayIcon, 
    CheckCircleIcon, 
    Cog6ToothIcon, 
    ChartTrendingUpIcon,
    ChevronDownIcon
} from './icons.tsx';

// Inline arrow component for the flow
const FlowArrow = ({ className }: { className?: string }) => (
    <svg className={`w-6 h-6 text-blue-500/50 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const CornerArrow = ({ className }: { className?: string }) => (
     <svg className={`w-12 h-12 text-blue-500/30 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
);

interface Step {
    id: number;
    title: string;
    icon: React.ElementType;
    summary: string;
    details: string[];
}

const steps: Step[] = [
    {
        id: 1,
        title: "Excel Template (One-Time Setup)",
        icon: DocumentTextIcon,
        summary: "Everything starts with your Excel file. This step is done once per dashboard.",
        details: [
            "Key metrics definition",
            "Formulas & logic structuring",
            "Data relationship mapping",
            "Forecasting rules setup",
            "Visual layout planning",
            "Validation checks configuration",
            "Special business rules implementation"
        ]
    },
    {
        id: 2,
        title: "AI Agent will Build the Logic",
        icon: CpuChipIcon,
        summary: "Our AI agents scan your sheets to understand the underlying structure and intent.",
        details: [
            "Table structure analysis",
            "Pivot table interpretation",
            "Named range identification",
            "Calculated field logic extraction",
            "Suggesting measures (like DAX)",
            "Recommending optimized formulas",
            "Proposing data relationships",
            "Suggesting better data normalization"
        ]
    },
    {
        id: 3,
        title: "Dashboard Blueprint Is Created",
        icon: Squares2X2Icon,
        summary: "Once the logic is approved, we convert your Excel model into a web-ready interactive dashboard.",
        details: [
            "Chart definitions",
            "KPI cards",
            "Filters",
            "Forecast models",
            "Export formats (Excel, PDF, etc.)",
            "Mobile & desktop layouts",
            "This becomes the master dashboard for that template"
        ]
    },
    {
        id: 4,
        title: "Users Upload Their Excel Template",
        icon: ArrowUpTrayIcon,
        summary: "No learning curve. No technical skills. Just upload → done.",
        details: [
            "No learning curve",
            "No technical skills required",
            "Secure drag-and-drop interface",
            "Instant upload confirmation"
        ]
    },
    {
        id: 5,
        title: "AI Validates the File Before Processing",
        icon: CheckCircleIcon,
        summary: "To prevent bad data, missing sheets, or modified structures.",
        details: [
            "Sheet structure validation",
            "Range checks",
            "Column matching",
            "Instant human-friendly error reporting (e.g., \"Column C is missing from the ‘Sales’ sheet\")"
        ]
    },
    {
        id: 6,
        title: "Your Dashboard Logic Runs Behind the Scenes",
        icon: Cog6ToothIcon,
        summary: "Once validated, the AI Agent applies the logic we built.",
        details: [
            "Measures and calculations",
            "Business rules applied",
            "Forecasting models executed",
            "Data relationships established",
            "KPIs updated",
            "Custom formulas calculated",
            "Everything is executed instantly"
        ]
    },
    {
        id: 7,
        title: "The User Gets a Clean, Interactive Dashboard",
        icon: ChartTrendingUpIcon,
        summary: "Users see: Dynamic charts, Tables, KPIs, Trend lines, Filters, Drill-downs, Benchmark comparisons, Forecast projections.",
        details: [
            "Dynamic charts",
            "Tables",
            "KPIs",
            "Trend lines",
            "Filters",
            "Drill-downs",
            "Benchmark comparisons",
            "Forecast projections",
            "They can export and print insights"
        ]
    }
];

const HowItWorks: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number | null>(null);

    const toggleStep = (id: number) => {
        setActiveStep(activeStep === id ? null : id);
    };

    return (
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 font-geist overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-6xl tracking-tight mb-6 font-playfair font-medium text-gray-100 leading-tight">
                        Your data. Your Excel. <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                            Your dashboard — automatically brought to life.
                        </span>
                    </h2>
                    <p className="text-lg max-w-3xl mx-auto font-geist text-gray-400 leading-relaxed">
                        Our platform transforms your Excel templates into interactive, intelligent dashboards without requiring users to build formulas, logic, or visualizations themselves.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line Background (Desktop) */}
                    <div className="hidden lg:block absolute top-[3.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-900/30 to-transparent -z-10 pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-y-16 relative">
                        {steps.map((step, index) => {
                            const isActive = activeStep === step.id;
                            const Icon = step.icon;
                            
                            // Determine arrow visibility
                            const showArrowRight = index !== 2 && index !== 5 && index !== 6; // Hide on right edge items and last item
                            const showArrowDownMobile = index !== steps.length - 1;

                            // Special Layout for the 7th item to center it
                            const isLast = index === steps.length - 1;
                            const containerClass = isLast ? "md:col-span-2 md:col-start-1 lg:col-span-3 lg:col-start-1 lg:w-1/3 lg:mx-auto" : "";

                            return (
                                <div key={step.id} className={`relative ${containerClass}`}>
                                    {/* Desktop Connector Arrow */}
                                    {!isLast && (
                                        <div className={`hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0 ${
                                            (index + 1) % 3 === 0 ? 'hidden' : 'block'
                                        }`}>
                                            <FlowArrow className="w-8 h-8 text-blue-900/50" />
                                        </div>
                                    )}

                                    {/* Mobile/Tablet Connector Line */}
                                    {showArrowDownMobile && (
                                        <div className="lg:hidden absolute left-1/2 bottom-[-2rem] transform -translate-x-1/2 h-8 w-0.5 bg-blue-900/30 -z-10"></div>
                                    )}

                                    <div 
                                        onClick={() => toggleStep(step.id)}
                                        className={`group relative rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden bg-[#080808]
                                            ${isActive 
                                                ? 'border-blue-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] scale-[1.02]' 
                                                : 'border-white/5 hover:border-white/10 hover:bg-[#0a0a0a]'
                                            }`}
                                    >
                                        {/* Card Top Glow */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'group-hover:opacity-50'}`}></div>

                                        <div className="p-6 sm:p-8">
                                            {/* Header Section of Card */}
                                            <div className="flex items-start justify-between gap-4 mb-6">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
                                                    isActive ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'
                                                }`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <span className={`text-6xl font-bold tracking-tighter transition-all duration-500 font-geist select-none ${
                                                    isActive 
                                                        ? 'opacity-100 text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-200 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' 
                                                        : 'opacity-10 text-gray-600'
                                                }`}>
                                                    0{step.id}
                                                </span>
                                            </div>

                                            <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-200'}`}>
                                                {step.title}
                                            </h3>
                                            
                                            <p className={`text-sm leading-relaxed transition-colors duration-300 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {step.summary}
                                            </p>

                                            {/* Expandable Details Section */}
                                            <div 
                                                className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                                    isActive ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/10' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <ul className="space-y-2">
                                                        {step.details.map((detail, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></span>
                                                                <span className="font-geist">{detail}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            {/* Interaction Hint */}
                                            <div className={`mt-6 flex justify-center transition-opacity duration-300 ${isActive ? 'opacity-0 hidden' : 'opacity-100'}`}>
                                                <div className="p-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-bounce group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-shadow duration-300">
                                                    <ChevronDownIcon className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_2px_rgba(6,182,212,1)]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
