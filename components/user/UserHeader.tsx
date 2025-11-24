import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, FolderIcon, DocumentTextIcon, UserCircleIcon, PuzzlePieceIcon, Bars3Icon, XMarkIcon } from '../icons.tsx';
import { User } from '../../types.ts';
import { getSafeImageUrl } from '../../utils/imageUtils';

const ProjectileLogo: React.FC<{ className?: string }> = ({ className }) => (
    <svg width="32" height="32" viewBox="0 0 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)"/>
        <path d="M19.998 8.5L11.5 23.4975L8 19.9995L16.498 5L19.998 8.5Z" fill="white"/>
        <path d="M24 12.002L15.502 20.5L12 17.002L20.498 8.50403L24 12.002Z" fill="white"/>
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6D28D9"/>
                <stop offset="1" stopColor="#3B82F6"/>
            </linearGradient>
        </defs>
    </svg>
);

interface UserHeaderProps {
    userName: string;
    userAvatar: string;
    currentPage: string;
    onNavigate: (page: 'dashboards' | 'invoices' | 'profile' | 'addins') => void;
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
    
    const handleMobileNav = (page: 'dashboards' | 'invoices' | 'addins') => {
        onNavigate(page);
        setMobileNavOpen(false);
    };

    const navItems = [
        { page: 'dashboards', label: 'Dashboards', icon: FolderIcon, show: true },
        { page: 'addins', label: 'Add-ins', icon: PuzzlePieceIcon, show: true },
        { page: 'invoices', label: 'Invoices', icon: DocumentTextIcon, show: true },
    ] as const;


    return (
        <header className="bg-sidebar-bg/50 backdrop-blur-lg border-b border-border-color sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-3">
                            <ProjectileLogo />
                            <span className="text-xl font-bold text-white">OneQlek</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-4">
                            {navItems.map(item => item.show && (
                                <a 
                                    key={item.page}
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === item.page ? 'text-white bg-white/10' : 'text-secondary-text hover:text-white'}`}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-2">
                         <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                                <img src={getSafeImageUrl(userAvatar, 'avatar')} alt={userName} className="w-9 h-9 rounded-full" />
                                <div className="hidden md:block text-left">
                                    <p className="text-white font-semibold text-sm">{userName}</p>
                                    <p className="text-xs text-secondary-text">Client</p>
                                </div>
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-sidebar-bg border border-border-color rounded-md shadow-lg py-1 z-20">
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleProfileNav('profile'); }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white"
                                    >
                                        <UserCircleIcon className="w-4 h-4 mr-2" />
                                        Profile
                                    </a>
                                    <div className="border-t border-border-color my-1"></div>
                                    <button
                                        onClick={onLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-secondary-text hover:bg-white/10 hover:text-white"
                                    >
                                        <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setMobileNavOpen(!isMobileNavOpen)} className="p-2 text-secondary-text hover:text-white" aria-controls="mobile-menu" aria-expanded={isMobileNavOpen}>
                                <span className="sr-only">Open main menu</span>
                                {isMobileNavOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileNavOpen && (
                    <div className="md:hidden" id="mobile-menu">
                        <nav className="px-2 pt-2 pb-4 space-y-1">
                             {navItems.map(item => item.show && (
                                <a
                                    key={item.page}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleMobileNav(item.page); }}
                                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${currentPage === item.page ? 'text-white bg-white/10' : 'text-secondary-text hover:text-white hover:bg-white/5'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default UserHeader;