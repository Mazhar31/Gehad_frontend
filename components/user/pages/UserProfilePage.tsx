import React, { useState, useRef } from 'react';
import { User } from '../../../types.ts';
import { PhotoIcon, KeyIcon } from '../../icons.tsx';

interface UserProfilePageProps {
    user: User;
    onSave: (user: User) => void;
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onSave }) => {
    const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const base64 = await toBase64(file);
                setAvatarPreview(base64);
                onSave({ ...user, avatarUrl: base64 });
                showNotification('Profile photo updated successfully!');
            } catch (error) {
                console.error("Error converting file to base64", error);
                showNotification('Error updating photo. Please try again.');
            }
        }
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };
    
    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would involve more complex state and API calls.
        // For this demo, we'll just show a success message.
        showNotification('Password changed successfully!');
        e.currentTarget.reset();
    };

    return (
        <div>
             {notification && (
                <div className="fixed top-20 right-6 bg-accent-green text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    {notification}
                </div>
            )}
            <style>{`
              @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translateY(-20px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-out {
                animation: fadeInOut 3s ease-in-out forwards;
              }
            `}</style>

            <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Details Card */}
                <div className="lg:col-span-1">
                    <div className="bg-card-bg p-6 rounded-2xl border border-border-color text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <img src={avatarPreview} alt={user.name} className="w-full h-full rounded-full object-cover ring-4 ring-sidebar-bg" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-white"
                                    aria-label="Change profile photo"
                                >
                                    <PhotoIcon className="w-8 h-8" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-secondary-text">{user.position}</p>
                        <p className="text-sm text-secondary-text mt-2">{user.email}</p>
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="lg:col-span-2">
                     <div className="bg-card-bg p-6 rounded-2xl border border-border-color">
                         <div className="flex items-center space-x-3 mb-6">
                            <KeyIcon className="w-6 h-6 text-accent-blue"/>
                            <h3 className="text-xl font-bold text-white">Change Password</h3>
                         </div>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-1">Current Password</label>
                                <input type="password" name="currentPassword" className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-1">New Password</label>
                                <input type="password" name="newPassword" className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-1">Confirm New Password</label>
                                <input type="password" name="confirmPassword" className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" required />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;