import React from 'react';
// FIX: Added file extension to import to resolve module error.
import { Client } from '../types.ts';
// FIX: Added file extension to import to resolve module error.
import { EnvelopeIcon } from './icons.tsx';

interface DetailsCardProps {
  clients: Client[];
  onViewAll: () => void;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ clients, onViewAll }) => {
  return (
    <div className="bg-card-bg p-4 sm:p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Recent Clients</h3>
        <button onClick={onViewAll} className="text-sm text-accent-blue hover:underline">View All</button>
      </div>
      <div className="space-y-4">
        {clients.map(client => (
          <div key={client.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={client.avatarUrl} alt={client.company} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-white text-sm">{client.company}</p>
              </div>
            </div>
            <button className="p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white">
              <EnvelopeIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsCard;