import React, { useState, useRef } from 'react';
import { User } from '../../../types.ts';
import { PhotoIcon, KeyIcon } from '../../icons.tsx';
import { userAPI } from '../../../services/api';
import { getSafeImageUrl, refreshCacheBuster } from '../../../utils/imageUtils';

interface UserProfilePageProps {
    user: User;
    onSave: (user: User) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onSave }) => {
    const [avatarPreview, setAvatarPreview] = useState<string>(getSafeImageUrl(user.avatarUrl, 'avatar'));
    const [notification, setNotification] = useState<string | null>(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsAvatarLoading(true);
            try {
                const response = await userAPI.uploadAvatar(file);
                const newAvatarUrl = refreshCacheBuster(response.data.avatar_url);
                setAvatarPreview(newAvatarUrl);
                onSave({ ...user, avatarUrl: newAvatarUrl });
                showNotification('Profile photo updated successfully!');
            } catch (error: any) {
                console.error('Error uploading avatar:', error);
                showNotification(error.message || 'Error updating photo. Please try again.');
            } finally {
                setIsAvatarLoading(false);
            }
        }
    };

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };
    
    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showNotification('New passwords do not match!');
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            showNotification('New password must be at least 6 characters long!');
            return;
        }
        
        setIsPasswordLoading(true);
        try {
            await userAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            showNotification('Password changed successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Error changing password:', error);
            showNotification(error.message || 'Error changing password. Please try again.');
        } finally {
            setIsPasswordLoading(false);
        }
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
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
                            <img src={getSafeImageUrl(avatarPreview, 'avatar')} alt={user.name} className="w-full h-full rounded-full object-cover ring-4 ring-sidebar-bg" />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {isAvatarLoading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                ) : (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-white hover:text-accent-blue transition-colors"
                                        aria-label="Change profile photo"
                                        disabled={isAvatarLoading}
                                    >
                                        <PhotoIcon className="w-8 h-8" />
                                    </button>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                    className="hidden" 
                                    disabled={isAvatarLoading}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto mb-4"
                            disabled={isAvatarLoading}
                        >
                            {isAvatarLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <PhotoIcon className="w-4 h-4 mr-2" />
                            )}
                            Change Photo
                        </button>
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
                                <input 
                                    type="password" 
                                    name="currentPassword" 
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" 
                                    required 
                                    disabled={isPasswordLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" 
                                    required 
                                    disabled={isPasswordLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-text mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-dark-bg border border-border-color rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" 
                                    required 
                                    disabled={isPasswordLoading}
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                    type="submit" 
                                    className="bg-accent-blue px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    disabled={isPasswordLoading}
                                >
                                    {isPasswordLoading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    )}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;