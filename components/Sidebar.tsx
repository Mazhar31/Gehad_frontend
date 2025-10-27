





import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { HomeIcon, FolderIcon, UsersIcon, DocumentTextIcon, TagIcon, CreditCardIcon, Cog6ToothIcon, XMarkIcon, UserGroupIcon, ArrowLeftOnRectangleIcon, CpuChipIcon, PhotoIcon } from './icons.tsx';

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
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  page: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
          : 'text-secondary-text hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="ml-4 font-semibold">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, onLogout, adminProfile }) => {
    const navItems = [
        { icon: HomeIcon, label: 'Dashboard', page: 'dashboard' },
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
                className={`fixed top-0 left-0 h-full bg-sidebar-bg w-64 text-white p-4 flex flex-col z-40 transform transition-transform lg:relative lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <div className="bg-accent-blue p-2 rounded-lg">
                             <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-5.94-2.28a11.95 11.95 0 00-5.814 5.517L9 18.75l-6.75-6.75" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold ml-3">OneQlek</span>
                    </div>
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
                            />
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto border-t border-border-color pt-4">
                    <div className="flex items-center">
                        <img src={adminProfile.avatarUrl} alt="Admin" className="w-10 h-10 rounded-full" />
                        <div className="ml-3 flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{adminProfile.name}</p>
                            <p className="text-xs text-secondary-text truncate">{adminProfile.position}</p>
                        </div>
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
            </aside>
        </>
    );
};

export default Sidebar;