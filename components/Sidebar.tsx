
import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { HomeIcon, FolderIcon, UsersIcon, DocumentTextIcon, TagIcon, CreditCardIcon, Cog6ToothIcon, XMarkIcon, UserGroupIcon, ArrowLeftOnRectangleIcon, CpuChipIcon, PhotoIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from './icons.tsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  adminProfile: {
    name: string;
    position: string;
    avatarUrl: string;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  page: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ icon: Icon, label, isActive, onClick, isCollapsed }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 overflow-hidden ${
        isActive
          ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
          : 'text-secondary-text hover:bg-white/10 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className={`font-semibold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'ml-4 opacity-100'}`}>{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, onLogout, adminProfile, isCollapsed, onToggleCollapse }) => {
    const navItems = [
        { icon: FolderIcon, label: 'Projects', page: 'projects' },
        { icon: UsersIcon, label: 'Clients', page: 'clients' },
        { icon: UserGroupIcon, label: 'User Management', page: 'user-management' },
        { icon: DocumentTextIcon, label: 'Invoices', page: 'invoices' },
        { icon: TagIcon, label: 'Organization Management', page: 'organization-management' },
        { icon: CreditCardIcon, label: 'Payment Plans', page: 'payment-plans' },
        { icon: CpuChipIcon, label: 'Deploy KPI Dashboard', page: 'deploy-kpi-dashboard' },
        { icon: PhotoIcon, label: 'Portfolio', page: 'portfolio' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            <aside
                className={`fixed top-0 left-0 h-full bg-sidebar-bg text-white p-4 flex flex-col z-40 lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
            >
                <div className={`flex items-center mb-8 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('dashboard');
                      }}
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200 overflow-hidden ${
                        currentPage === 'dashboard'
                          ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                          : 'text-primary-text hover:bg-white/10 hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <HomeIcon className="w-6 h-6 flex-shrink-0" />
                      <span className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'ml-4 opacity-100'}`}>OneQlek</span>
                    </a>
                    <button onClick={onClose} className="lg:hidden p-1 text-secondary-text hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <nav className="flex-1">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <NavItem
                                key={item.page}
                                icon={item.icon}
                                label={item.label}
                                page={item.page}
                                isActive={currentPage === item.page}
                                onClick={() => onNavigate(item.page)}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-border-color pt-4">
                    <div className="flex items-center">
                        <img src={adminProfile.avatarUrl} alt="Admin" className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'ml-3 opacity-100'}`}>
                            <p className="text-sm font-semibold text-white truncate">{adminProfile.name}</p>
                            <p className="text-xs text-secondary-text truncate">{adminProfile.position}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="hidden lg:block">
                            <button
                                onClick={onToggleCollapse}
                                className="flex items-center p-2 rounded-lg text-secondary-text hover:bg-white/10 hover:text-white transition-colors"
                                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                {isCollapsed ? <ChevronDoubleRightIcon className="w-6 h-6" /> : <ChevronDoubleLeftIcon className="w-6 h-6" />}
                            </button>
                        </div>
                        <div className={`flex items-center overflow-hidden transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            <button
                                onClick={() => onNavigate('settings')}
                                className={`p-2 rounded-lg transition-colors ${
                                    currentPage === 'settings'
                                        ? 'bg-accent-blue text-white'
                                        : 'text-secondary-text hover:bg-white/10 hover:text-white'
                                }`}
                                aria-label="Settings"
                            >
                                <Cog6ToothIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onLogout}
                                className="p-2 ml-1 rounded-lg text-secondary-text hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Sign Out"
                            >
                                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;