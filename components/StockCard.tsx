import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  change?: string;
  changeType?: 'positive' | 'negative';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, change, changeType }) => {
    const changeColor = changeType === 'positive' ? 'text-green-300' : 'text-red-300';

    return (
        <div className="bg-card-bg p-6 rounded-2xl shadow-lg border border-border-color hover:border-accent-blue/50 transition-colors duration-300 text-white">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-secondary-text font-medium">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-accent-blue/10 text-accent-blue">
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                {change && (
                    <p className={`text-sm mt-4 ${changeColor}`}>
                        {change}
                    </p>
                )}
            </div>
        </div>
    );
};

export default KpiCard;