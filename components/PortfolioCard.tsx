import React, { useState } from 'react';
import { PortfolioCase } from './types.ts';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, ArrowTopRightOnSquareIcon } from './icons.tsx';

interface PortfolioCardProps {
    caseItem: PortfolioCase;
    onEdit: () => void;
    onDelete: () => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ caseItem, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-card-bg rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 border border-border-color relative">
            <div className="absolute top-2 right-2 z-20">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full text-white bg-black/30 hover:bg-black/60">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div
                        onMouseLeave={() => setMenuOpen(false)}
                        className="absolute right-0 mt-2 w-32 bg-sidebar-bg border border-border-color rounded-md shadow-lg text-left"
                    >
                        <a href="#" onClick={(e) => { e.preventDefault(); onEdit(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                            <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onDelete(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
                        </a>
                    </div>
                )}
            </div>
            <div className="aspect-video overflow-hidden">
                <img src={caseItem.imageUrl} alt={caseItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
                <p className="text-sm font-medium text-accent-blue mb-2">{caseItem.category}</p>
                <h3 className="text-xl font-bold text-white mb-3">{caseItem.title}</h3>
                <p className="text-secondary-text text-sm mb-6 h-20 overflow-hidden">
                    {caseItem.description}
                </p>
                {caseItem.link && (
                    <a href={caseItem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-white group-hover:text-accent-blue transition-colors">
                        View Case Study
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default PortfolioCard;
