
import React, { useRef } from 'react';
import { useData } from '../DataContext.tsx';

const SettingsPage: React.FC = () => {
  const { heroImage, setHeroImage } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await toBase64(file);
        setHeroImage(base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
        alert("There was an error uploading the image. Please try again.");
      }
    }
  };

  const handleReplaceImage = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    if (window.confirm('Are you sure you want to delete the hero image? This cannot be undone.')) {
        setHeroImage(null);
    }
  };

  return (
    <div className="text-white space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-secondary-text">Manage your application settings and preferences.</p>
      </div>

      <div className="bg-card-bg rounded-2xl p-6 border border-border-color">
          <h3 className="text-xl font-bold text-white mb-4">Landing Page Customization</h3>
          <div className="space-y-4">
              <label className="font-semibold text-secondary-text">Hero Image</label>
              {heroImage ? (
                  <div className="max-w-xl">
                      <img src={heroImage} alt="Hero Preview" className="rounded-lg border border-border-color" />
                  </div>
              ) : (
                  <div className="max-w-xl h-48 bg-dark-bg rounded-lg border-2 border-dashed border-border-color flex items-center justify-center">
                      <p className="text-secondary-text">No hero image set.</p>
                  </div>
              )}
              <div className="flex items-center space-x-4">
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                  />
                  <button onClick={handleReplaceImage} className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      {heroImage ? 'Replace Image' : 'Upload Image'}
                  </button>
                  {heroImage && (
                    <button onClick={handleDeleteImage} className="bg-red-600/50 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/70 transition-colors">
                        Delete Image
                    </button>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default SettingsPage;
