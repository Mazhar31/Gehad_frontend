# API Configuration Management

This document explains how backend URLs are now centrally managed in the frontend application.

## Overview

Previously, backend URLs were hardcoded throughout the frontend files, making it difficult to change environments or update API endpoints. Now all backend URLs are centrally managed through environment variables and a configuration file.

## Configuration Structure

### 1. Environment Variables (.env files)

The primary backend URL is configured in environment files:

- `.env` - Development environment
- `.env.production` - Production environment

```bash
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### 2. Central Configuration File

**Location**: `config/api.ts`

This file provides:
- Centralized API configuration
- Helper functions for building URLs
- Type-safe endpoint definitions

```typescript
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    // All API endpoints defined here
    UPLOAD_IMAGE: '/upload/image',
    ADMIN_PROFILE: '/admin/firebase/profile',
    // ... more endpoints
  }
};
```

### 3. Helper Functions

- `getFullUrl(endpoint)` - Builds complete URL from base + endpoint
- `getUploadUrl()` - Returns the upload endpoint URL
- `getAdminProfileUrl()` - Returns the admin profile endpoint URL

## Updated Files

The following files have been updated to use the centralized configuration:

1. **services/api.ts** - Main API service file
2. **App.tsx** - Authentication and profile loading
3. **components/pages/ProjectsPage.tsx** - Project image uploads
4. **components/pages/SettingsPage.tsx** - Profile photo uploads
5. **components/pages/ClientsPage.tsx** - Client logo uploads
6. **components/pages/UserManagementPage.tsx** - User avatar uploads
7. **components/pages/PortfolioPage.tsx** - Portfolio image uploads
8. **vite.config.ts** - Build configuration

## Benefits

1. **Single Source of Truth**: All API URLs managed in one place
2. **Environment Flexibility**: Easy switching between dev/staging/production
3. **Maintainability**: No more hunting for hardcoded URLs in files
4. **Type Safety**: TypeScript support for endpoint definitions
5. **Consistency**: All API calls use the same configuration

## Usage Examples

### Basic API Call
```typescript
import { getFullUrl, API_CONFIG } from '../config/api';

const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.UPLOAD_IMAGE), {
  method: 'POST',
  // ... other options
});
```

### Using Helper Functions
```typescript
import { getUploadUrl, getAdminProfileUrl } from '../config/api';

// For uploads
const uploadResponse = await fetch(getUploadUrl(), { /* ... */ });

// For admin profile
const profileResponse = await fetch(getAdminProfileUrl(), { /* ... */ });
```

## Environment Setup

To change the backend URL for different environments:

1. **Development**: Update `.env` file
2. **Production**: Update `.env.production` file
3. **Runtime**: Set `VITE_API_BASE_URL` environment variable

## Migration Notes

- All hardcoded URLs have been removed from component files
- The fallback URL in `config/api.ts` ensures the app works even without environment variables
- No breaking changes to existing functionality
- All upload endpoints now use the centralized configuration

## Future Enhancements

Consider adding:
- API versioning support
- Multiple backend environment support
- Endpoint validation
- Request/response interceptors
- Automatic retry logic