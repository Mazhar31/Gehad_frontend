

import React, { useState, useRef, useEffect } from 'react';
import { UserCircleIcon, PhotoIcon, EnvelopeIcon, KeyIcon } from '../icons.tsx';

// Removed toBase64 function as we're now using Firebase Storage

interface SettingsPageProps {
    userProfile: {
        name: string;
        position: string;
        email: string;
        avatarUrl: string;
    };
    onProfileUpdate: (updatedProfile: SettingsPageProps['userProfile']) => void;
}


const SettingsPage: React.FC<SettingsPageProps> = ({ userProfile, onProfileUpdate }) => {
    const [profile, setProfile] = useState({ name: userProfile.name, position: userProfile.position });
    const [email, setEmail] = useState(userProfile.email);
    const [avatarPreview, setAvatarPreview] = useState<string>(userProfile.avatarUrl);
    const [notification, setNotification] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProfile({ name: userProfile.name, position: userProfile.position });
        setEmail(userProfile.email);
        setAvatarPreview(userProfile.avatarUrl);
    }, [userProfile]);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = { ...userProfile, ...profile };
        onProfileUpdate(updatedProfile);
        showNotification('Profile information updated successfully!');
    };
    
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedProfile = { ...userProfile, email: email };
        onProfileUpdate(updatedProfile);
        showNotification('Email address updated successfully!');
    };

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Password change requested.");
        showNotification('Password changed successfully!');
        e.currentTarget.reset();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            try {
                // Create preview URL
                const previewUrl = URL.createObjectURL(file);
                setAvatarPreview(previewUrl);
                
                // Upload to Firebase Storage using the new Firebase admin endpoint
                const formData = new FormData();
                formData.append('avatar', file);
                
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:8000/api/admin/firebase/profile', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });
                
                if (!response.ok) {
                    throw new Error('Upload failed');
                }
                
                const result = await response.json();
                const newAvatarUrl = result.data.avatar_url;
                
                // Update the profile with the new Firebase Storage URL
                const updatedProfile = { ...userProfile, avatarUrl: newAvatarUrl };
                onProfileUpdate(updatedProfile);
                setAvatarPreview(newAvatarUrl);
                showNotification('Profile photo updated!');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                showNotification('Failed to upload photo. Please try again.');
                // Reset preview on error
                setAvatarPreview(userProfile.avatarUrl);
            }
        }
    };


  return (
    <div className="text-white space-y-8">
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
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-secondary-text">Manage your profile and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
                <div className="flex items-center space-x-3 mb-6">
                    <UserCircleIcon className="w-6 h-6 text-accent-blue"/>
                    <h3 className="text-xl font-bold text-white">Profile Information</h3>
                </div>
                 <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Full Name</label>
                        <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">Position</label>
                        <input type="text" name="position" value={profile.position} onChange={handleProfileChange} className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold">Save Profile</button>
                    </div>
                </form>
            </div>
            <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
                <div className="flex items-center space-x-3 mb-6">
                    <PhotoIcon className="w-6 h-6 text-accent-blue"/>
                    <h3 className="text-xl font-bold text-white">Profile Photo</h3>
                </div>
                <div className="flex items-center space-x-4">
                     <img src={avatarPreview} alt="Admin" className="w-20 h-20 rounded-full object-cover" />
                     <div>
                         <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/20 font-semibold"
                        >
                            Change Photo
                        </button>
                        <p className="text-xs text-secondary-text mt-2">PNG, JPG up to 5MB.</p>
                     </div>
                </div>
            </div>
        </div>

        {/* Right Column: Security */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
                <div className="flex items-center space-x-3 mb-6">
                    <EnvelopeIcon className="w-6 h-6 text-accent-blue"/>
                    <h3 className="text-xl font-bold text-white">Change Email Address</h3>
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary-text mb-1">New Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" required />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold">Update Email</button>
                    </div>
                </form>
            </div>
             <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
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

export default SettingsPage;