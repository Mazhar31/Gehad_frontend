/**
 * API Utility Functions
 * Ensures consistent trailing slash handling to prevent HTTP redirects
 */

/**
 * Ensures a path ends with a trailing slash for resource endpoints
 * @param path - The API path
 * @returns Path with trailing slash if it's a resource endpoint
 */
export function ensureTrailingSlash(path: string): string {
  // Don't add slash to specific endpoints that don't need it
  const noSlashEndpoints = [
    '/auth/',
    '/health',
    '/docs',
    '/redoc',
    '/upload/image',
    '/upload/dashboard',
    '/dashboard/stats',
    '/dashboard/recent-projects'
  ];
  
  // Check if path matches any no-slash patterns
  const shouldNotHaveSlash = noSlashEndpoints.some(endpoint => 
    path.includes(endpoint) || path.endsWith('/login') || path.endsWith('/me')
  );
  
  if (shouldNotHaveSlash) {
    return path;
  }
  
  // Add trailing slash for resource endpoints
  if (!path.endsWith('/') && !path.includes('?')) {
    return path + '/';
  }
  
  return path;
}

/**
 * Builds a complete API URL with proper trailing slash handling
 * @param baseUrl - The base API URL
 * @param endpoint - The endpoint path
 * @returns Complete URL with proper slash handling
 */
export function buildApiUrl(baseUrl: string, endpoint: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedEndpoint = ensureTrailingSlash(endpoint);
  return `${normalizedBase}${normalizedEndpoint}`;
}