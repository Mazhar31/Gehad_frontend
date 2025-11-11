import React, { useState, useMemo } from 'react';
import { Project } from '../../../types.ts';
import UserAddinCard from '../UserAddinCard.tsx';
import { MagnifyingGlassIcon } from '../../icons.tsx';

const UserAddinsPage: React.FC<{ addins: Project[] }> = ({ addins }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAddins = useMemo(() => {
        return addins.filter(addin => 
            addin.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [addins, searchTerm]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Available Add-ins</h1>
                    <p className="text-secondary-text">Enhance your experience with these available add-ins. Click on any card to open it.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input
                        type="search"
                        placeholder="Search add-ins..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-card-bg text-white placeholder-secondary-text rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent-blue w-full sm:w-64"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-secondary-text absolute top-1/2 left-3 transform -translate-y-1/2" />
                </div>
            </div>

            {filteredAddins.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAddins.map(addin => (
                        <UserAddinCard key={addin.id} addin={addin} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card-bg rounded-2xl">
                    <h3 className="text-xl font-semibold text-white">No Add-ins Found</h3>
                    <p className="text-secondary-text mt-2">Your search returned no results.</p>
                </div>
            )}
        </div>
    );
};

export default UserAddinsPage;