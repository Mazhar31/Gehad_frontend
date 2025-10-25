import React from 'react';

const Header: React.FC<{ title: string; onMenuClick: () => void }> = ({ title, onMenuClick }) => {
    return (
        <header className="bg-dark-bg p-4 sm:p-6 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="mr-4 lg:hidden p-2 text-secondary-text hover:text-white">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-white capitalize">{title.replace('-', ' ')}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                    <input
                        type="search"
                        placeholder="Search..."
                        className="bg-card-bg text-white placeholder-secondary-text rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    />
                    <svg className="w-5 h-5 text-secondary-text absolute top-1/2 left-3 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <button className="relative p-2 text-secondary-text hover:text-white">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-dark-bg"></span>
                </button>
                <div className="flex items-center space-x-2">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026702d" alt="User" className="w-10 h-10 rounded-full" />
                    <div className="hidden md:block">
                        <p className="text-white font-semibold text-sm">Admin</p>
                        <p className="text-xs text-secondary-text">Super Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;