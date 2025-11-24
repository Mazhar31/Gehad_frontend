/**
 * Utility functions for handling image URLs with cache-busting
 */

/**
 * Adds a cache-busting parameter to an image URL
 * @param imageUrl - The original image URL
 * @returns The image URL with cache-busting parameter
 */
export const addCacheBuster = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '';
  }
  
  // If URL already has query parameters, append with &
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}v=${Date.now()}`;
};

/**
 * Removes existing cache-busting parameters and adds a new one
 * @param imageUrl - The original image URL
 * @returns The image URL with fresh cache-busting parameter
 */
export const refreshCacheBuster = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '';
  }
  
  // Remove existing cache-busting parameters (t=, v=, _=, cache=)
  const cleanUrl = imageUrl.replace(/[?&](t|v|_|cache)=[^&]*/g, '');
  
  // Remove trailing ? or & if they exist
  const baseUrl = cleanUrl.replace(/[?&]$/, '');
  
  // Add new cache-busting parameter
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}v=${Date.now()}`;
};

/**
 * Gets a fallback image URL for different types
 * @param type - The type of image (avatar, project, portfolio, etc.)
 * @returns A fallback image URL
 */
export const getFallbackImage = (type: 'avatar' | 'project' | 'portfolio' | 'logo'): string => {
  switch (type) {
    case 'avatar':
      return 'https://i.pravatar.cc/150';
    case 'project':
      return 'https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/assets/app-placeholder.png';
    case 'portfolio':
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    case 'logo':
      return 'https://i.pravatar.cc/150';
    default:
      return 'https://i.pravatar.cc/150';
  }
};

/**
 * Safely gets an image URL with cache-busting and fallback
 * @param imageUrl - The original image URL
 * @param type - The type of image for fallback
 * @returns A safe image URL with cache-busting
 */
export const getSafeImageUrl = (
  imageUrl: string | null | undefined, 
  type: 'avatar' | 'project' | 'portfolio' | 'logo'
): string => {
  if (!imageUrl) {
    return getFallbackImage(type);
  }
  
  return addCacheBuster(imageUrl);
};