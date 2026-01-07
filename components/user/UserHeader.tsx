import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, FolderIcon, UserCircleIcon, PuzzlePieceIcon, Bars3Icon, XMarkIcon } from '../icons.tsx';
import { User } from '../../types.ts';

const Logo: React.FC<{ iconOnly?: boolean }> = ({ iconOnly = false }) => (
    <div className="flex items-center group cursor-pointer select-none flex-shrink-0">
        <svg 
            viewBox="0 0 340 100" 
            className={`${iconOnly ? 'w-10 h-10' : 'h-10 sm:h-11 md:h-10 w-auto'} transition-transform duration-500 group-hover:scale-105`} 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="userSilverGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="25%" stopColor="#E2E8F0" />
                    <stop offset="50%" stopColor="#94A3B8" />
                    <stop offset="75%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>
            </defs>
            {!iconOnly && (
                <>
                    <text x="10" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#userSilverGradient)]" style={{ letterSpacing: '-3px' }}>One</text>
                    <text x="210" y="70" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="58" fill="white" className="md:fill-[url(#userSilverGradient)]" style={{ letterSpacing: '-3px' }}>Lek</text>
                </>
            )}
            <g transform={iconOnly ? "translate(170, 50) scale(1.3)" : "translate(165, 55)"}>
                <circle r="42" fill="#1E40AF" />
                <circle r="36" fill="#080C18" />
                <path d="M0 0 L0 -36 A36 36 0 1 0 36 0 Z" fill="#111827" />
                <path d="M0 0 L36 0 A36 36 0 0 0 0 -36 Z" fill="#3B82F6" />
                <line x1="0" y1="0" x2="0" y2="-36" stroke="#080C18" strokeWidth="2" />
                <line x1="0" y1="0" x2="36" y2="0" stroke="#080C18" strokeWidth="2" />
                <path 
                    d="M28 28 L48 48" 
                    stroke="#3B82F6" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                />
            </g>
        </svg>
    </div>
);

interface UserHeaderProps {
    userName: string;
    userAvatar: string;
    currentPage: string;
    onNavigate: (page: 'dashboards' | 'profile' | 'addins') => void;
    onLogout: () => void;
    userRole: User['role'];
}

const UserHeader: React.FC<UserHeaderProps> = ({ userName, userAvatar, currentPage, onNavigate, onLogout, userRole }) => {
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileNav = (page: 'profile') => {
        onNavigate(page);
        setProfileMenuOpen(false);
    };
    
    const handleMobileNav = (page: 'dashboards' | 'addins') => {
        onNavigate(page);
        setMobileNavOpen(false);
    };

    const navItems = [
        { page: 'dashboards', label: 'Dashboards', icon: FolderIcon, show: true },
        { page: 'addins', label: 'Add-ins', icon: PuzzlePieceIcon, show: true },
    ] as const;


    return (
        <header className="bg-sidebar-bg/50 backdrop-blur-lg border-b border-border-color sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4 md:space-x-8 overflow-hidden min-w-0">
                        <Logo />
                        <nav className="hidden md:flex items-center space-x-4">
                            {navItems.map(item => item.show && (
                                <a 
                                    key={item.page}
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
                                    className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${currentPage === item.page ? 'text-white bg-white/10' : 'text-secondary-text hover:text-white'}`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                         <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/5 transition-colors">
                                <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
                                <div className="hidden lg:block text-left ml-2">
                                    <p className="text-white font-semibold text-sm leading-tight">{userName}</p>
                                    <p className="text-[10px] text-secondary-text uppercase tracking-wider">Client</p>
                                </div>
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-sidebar-bg border border-border-color rounded-xl shadow-2xl py-1 z-20 overflow-hidden">
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleProfileNav('profile'); }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-secondary-text hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <UserCircleIcon className="w-4 h-4 mr-3" />
                                        Profile Settings
                                    </a>
                                    <div className="border-t border-border-color my-1 mx-2"></div>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-3" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setMobileNavOpen(!isMobileNavOpen)} className="p-2 text-secondary-text hover:text-white transition-colors">
                                {isMobileNavOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileNavOpen && (
                    <div className="md:hidden border-t border-white/5 py-4 animate-fade-in">
                        <nav className="space-y-1">
                             {navItems.map(item => item.show && (
                                <a
                                    key={item.page}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleMobileNav(item.page as 'dashboards' | 'addins'); }}
                                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${currentPage === item.page ? 'text-white bg-blue-600/20' : 'text-secondary-text hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-4" />
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </header>
    );
};

export default UserHeader;