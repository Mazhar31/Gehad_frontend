
import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { HomeIcon, FolderIcon, UsersIcon, DocumentTextIcon, TagIcon, CreditCardIcon, Cog6ToothIcon, XMarkIcon, UserGroupIcon, ArrowLeftOnRectangleIcon } from './icons.tsx';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose, onLogout }) => {
    const navItems = [
        { icon: HomeIcon, label: 'Dashboard', page: 'dashboard' },
        { icon: FolderIcon, label: 'Projects', page: 'projects' },
        { icon: UsersIcon, label: 'Clients', page: 'clients' },
        { icon: UserGroupIcon, label: 'User Management', page: 'user-management' },
        { icon: DocumentTextIcon, label: 'Invoices', page: 'invoices' },
        { icon: TagIcon, label: 'Categories', page: 'categories' },
        { icon: CreditCardIcon, label: 'Payment Plans', page: 'payment-plans' },
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
                        <span className="text-xl font-bold ml-3">Projex</span>
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

                <div className="mt-auto">
                    <div className="border-t border-border-color my-4"></div>
                    <NavItem
                        icon={Cog6ToothIcon}
                        label="Settings"
                        page="settings"
                        isActive={currentPage === 'settings'}
                        onClick={() => onNavigate('settings')}
                    />
                     <NavItem
                        icon={ArrowLeftOnRectangleIcon}
                        label="Sign Out"
                        page="logout"
                        isActive={false}
                        onClick={onLogout}
                    />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;