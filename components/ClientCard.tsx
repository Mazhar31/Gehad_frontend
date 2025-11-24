// FIX: Created ClientCard component to display individual client information. This component is used by ClientsPage and resolves a module error.
import React, { useState } from 'react';
// FIX: Added file extension to import to resolve module error.
import { Client } from '../types.ts';
// FIX: Added file extension to import to resolve module error.
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from './icons.tsx';
import { getSafeImageUrl } from '../utils/imageUtils';

interface ClientCardProps {
    client: Client;
    groupName?: string;
    onViewDetails: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, groupName, onViewDetails, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-card-bg rounded-2xl flex flex-col relative group transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
            <div className="absolute top-2 right-2 z-20">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full text-secondary-text hover:bg-white/10">
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

            <div 
                className="p-5 text-center items-center flex flex-col flex-grow cursor-pointer"
                onClick={onViewDetails}
            >
                <img src={getSafeImageUrl(client.avatarUrl, 'avatar')} alt={client.company} className="w-24 h-24 rounded-full mb-4 ring-4 ring-dark-bg" />
                <h3 className="font-bold text-white text-lg">{client.company}</h3>
                {groupName && <p className="text-xs text-secondary-text">{groupName}</p>}
                <div className="flex-grow"></div>
            </div>
            
            <div className="w-full border-t border-border-color mt-auto flex">
                <a 
                   href={client.mobile ? `tel:${client.mobile}` : undefined}
                   onClick={(e) => !client.mobile && e.preventDefault()}
                   className={`flex-1 flex items-center justify-center space-x-2 py-3 transition-colors duration-200 ${client.mobile ? 'text-secondary-text hover:text-accent-blue hover:bg-accent-blue/10' : 'text-secondary-text/50 cursor-not-allowed'}`}
                   aria-disabled={!client.mobile}
                >
                   <PhoneIcon className="w-5 h-5" />
                   <span className="text-sm font-medium">Call</span>
                </a>
                <a href={`mailto:${client.email}`} className="flex-1 flex items-center justify-center space-x-2 py-3 text-secondary-text hover:text-accent-blue hover:bg-accent-blue/10 border-l border-border-color transition-colors duration-200">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                </a>
            </div>
        </div>
    );
};

export default ClientCard;