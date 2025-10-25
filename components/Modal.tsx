
import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { XMarkIcon } from './icons.tsx';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, size = '2xl' }) => {
  // Effect to handle Escape key press
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const sizeClasses = {
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-sidebar-bg rounded-2xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95`} 
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scaleUp 0.3s forwards' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-color sticky top-0 bg-sidebar-bg rounded-t-2xl z-10 no-print">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-secondary-text hover:bg-white/10 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-0 sm:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Modal;