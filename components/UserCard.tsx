import React, { useState } from 'react';
import { User } from '../types.ts';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon, EnvelopeIcon, BellIcon } from './icons.tsx';

interface UserCardProps {
    user: User;
    clientCompany: string;
    projectsCount: number;
    onEdit: () => void;
    onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, clientCompany, projectsCount, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSendNotification = () => {
        alert(`Sending notification to ${user.name}...`);
    };

    const handleSendEmail = () => {
        window.location.href = `mailto:${user.email}`;
    };

    return (
        <div className="bg-card-bg rounded-2xl flex flex-col relative group transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/10">
            <div className="absolute top-2 right-2 z-20">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full text-secondary-text hover:bg-white/10">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div 
                        onMouseLeave={() => setMenuOpen(false)}
                        className="absolute right-0 mt-2 w-36 bg-sidebar-bg border border-border-color rounded-md shadow-lg text-left"
                    >
                        <a href="#" onClick={(e) => { e.preventDefault(); onEdit(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                            <PencilSquareIcon className="w-4 h-4 mr-2" /> Edit User
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); onDelete(); setMenuOpen(false); }} className="flex items-center px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white">
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete User
                        </a>
                    </div>
                )}
            </div>

            <div className="p-5 text-center items-center flex flex-col flex-grow">
                 {user.role === 'superuser' && (
                    <span className="absolute top-4 left-4 text-xs font-bold bg-accent-pink/20 text-accent-pink px-2 py-1 rounded-full">Superuser</span>
                )}
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-dark-bg object-cover" />
                <h3 className="font-bold text-white text-lg">{user.name}</h3>
                <p className="text-sm text-accent-blue font-medium">{user.position}</p>
                <p className="text-xs text-secondary-text mt-1">{clientCompany} &bull; {projectsCount} {projectsCount === 1 ? 'Project' : 'Projects'}</p>
                <div className="flex-grow flex items-center justify-center">
                    <div className="mt-4">
                        {user.dashboardAccess === 'view-and-edit' ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-green/10 text-accent-green">
                                Dashboard: Edit Access
                            </span>
                        ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent-blue/10 text-accent-blue">
                                Dashboard: View Access
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="w-full border-t border-border-color mt-auto flex">
                <button onClick={handleSendNotification} className="flex-1 flex items-center justify-center space-x-2 py-3 text-secondary-text hover:text-accent-blue hover:bg-accent-blue/10 transition-colors duration-200">
                   <BellIcon className="w-5 h-5" />
                   <span className="text-sm font-medium">Notify</span>
                </button>
                <button onClick={handleSendEmail} className="flex-1 flex items-center justify-center space-x-2 py-3 text-secondary-text hover:text-accent-blue hover:bg-accent-blue/10 border-l border-border-color transition-colors duration-200">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Email</span>
                </button>
            </div>
        </div>
    );
};

export default UserCard;