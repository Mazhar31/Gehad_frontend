# API Integration Documentation

## Overview

The frontend has been fully integrated with the backend APIs while maintaining backward compatibility with local data storage. The application gracefully falls back to local data when API calls fail, ensuring a smooth user experience.

## Architecture

### API Service Layer (`/services/api.ts`)
- Centralized API client with proper error handling
- Automatic token management for authenticated requests
- Consistent response handling across all endpoints

### Authentication Service (`/services/auth.ts`)
- Handles login, 2FA verification, and token management
- Automatic token validation on app startup
- Secure token storage in localStorage

### Data Context Integration (`/components/DataContext.tsx`)
- All CRUD operations now use real APIs with local fallback
- Automatic data loading when user logs in
- Error handling with user-friendly messages
- Loading states for better UX

## API Endpoints Integrated

### Authentication
- ✅ `POST /api/auth/admin/login` - Admin login
- ✅ `POST /api/auth/user/login` - User login
- ✅ `POST /api/auth/admin/verify-2fa` - Admin 2FA verification
- ✅ `POST /api/auth/user/verify-2fa` - User 2FA verification
- ✅ `GET /api/auth/me` - Get current user info

### Dashboard
- ✅ `GET /api/admin/dashboard/stats` - Dashboard statistics
- ✅ `GET /api/admin/dashboard/recent-projects` - Recent projects

### Admin APIs
- ✅ `GET /api/admin/clients` - List clients
- ✅ `POST /api/admin/clients` - Create client
- ✅ `PUT /api/admin/clients/{id}` - Update client
- ✅ `DELETE /api/admin/clients/{id}` - Delete client
- ✅ `GET /api/admin/projects` - List projects
- ✅ `POST /api/admin/projects` - Create project
- ✅ `PUT /api/admin/projects/{id}` - Update project
- ✅ `DELETE /api/admin/projects/{id}` - Delete project
- ✅ `GET /api/admin/users` - List users
- ✅ `POST /api/admin/users` - Create user
- ✅ `PUT /api/admin/users/{id}` - Update user
- ✅ `DELETE /api/admin/users/{id}` - Delete user
- ✅ `GET /api/admin/invoices` - List invoices
- ✅ `POST /api/admin/invoices` - Create invoice
- ✅ `PUT /api/admin/invoices/{id}` - Update invoice
- ✅ `DELETE /api/admin/invoices/{id}` - Delete invoice
- ✅ `GET /api/admin/departments` - List departments
- ✅ `POST /api/admin/departments` - Create department
- ✅ `PUT /api/admin/departments/{id}` - Update department
- ✅ `DELETE /api/admin/departments/{id}` - Delete department
- ✅ `GET /api/admin/groups` - List groups
- ✅ `POST /api/admin/groups` - Create group
- ✅ `PUT /api/admin/groups/{id}` - Update group
- ✅ `DELETE /api/admin/groups/{id}` - Delete group
- ✅ `GET /api/admin/categories` - List categories
- ✅ `POST /api/admin/categories` - Create category
- ✅ `PUT /api/admin/categories/{id}` - Update category
- ✅ `DELETE /api/admin/categories/{id}` - Delete category
- ✅ `GET /api/admin/payment-plans` - List payment plans
- ✅ `POST /api/admin/payment-plans` - Create payment plan
- ✅ `PUT /api/admin/payment-plans/{id}` - Update payment plan
- ✅ `DELETE /api/admin/payment-plans/{id}` - Delete payment plan
- ✅ `GET /api/admin/portfolio` - List portfolio cases
- ✅ `POST /api/admin/portfolio` - Create portfolio case
- ✅ `PUT /api/admin/portfolio/{id}` - Update portfolio case
- ✅ `DELETE /api/admin/portfolio/{id}` - Delete portfolio case

### User APIs
- ✅ `GET /api/user/projects` - Get user's assigned projects
- ✅ `GET /api/user/projects/{id}` - Get project details
- ✅ `GET /api/user/addins` - Get user's assigned add-ins
- ✅ `GET /api/user/invoices` - Get user's invoices (superuser only)
- ✅ `PUT /api/user/invoices/{id}/pay` - Mark invoice as paid
- ✅ `PUT /api/user/profile` - Update user profile

### Public APIs
- ✅ `POST /api/contact` - Submit contact form
- ✅ `GET /api/portfolio/public` - Get public portfolio cases

## Error Handling Strategy

### 1. API-First with Graceful Fallback
- All operations attempt API calls first
- On failure, falls back to local data operations
- User is notified when using local data

### 2. User-Friendly Error Messages
- Network errors show "Using local data" warnings
- Authentication errors redirect to login
- Validation errors display specific field messages

### 3. Loading States
- Loading spinners during API calls
- Disabled buttons during form submissions
- Skeleton screens for data loading

### 4. Error Boundary
- React Error Boundary catches unexpected errors
- Provides reload option for recovery
- Logs errors for debugging

## Authentication Flow

### 1. App Startup
- Check for existing token in localStorage
- Validate token with `/api/auth/me`
- Auto-login if token is valid
- Clear invalid tokens

### 2. Login Process
- Determine admin vs user login based on email
- Handle 2FA if required
- Store token and user info on success
- Show appropriate error messages on failure

### 3. Token Management
- Automatic token inclusion in API headers
- Token refresh on expiration (if implemented)
- Secure logout with token cleanup

## Data Synchronization

### 1. Initial Load
- Load all data from APIs when user logs in
- Fall back to local data if APIs fail
- Show loading states during data fetch

### 2. CRUD Operations
- Optimistic updates for better UX
- API calls with local fallback
- Consistent state management

### 3. Real-time Updates
- Ready for WebSocket integration
- Event-driven data updates
- Conflict resolution strategies

## Configuration

### API Base URL
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Token Storage
- Stored in localStorage as 'auth_token'
- Automatically included in API headers
- Cleared on logout or token expiration

## Testing the Integration

### 1. With Backend Running
- Start the backend server on port 8000
- All API calls will work normally
- Real-time data synchronization

### 2. Without Backend
- Frontend works with local data
- Yellow warning messages indicate API failures
- All functionality remains available

### 3. Mixed Scenarios
- Some APIs working, others failing
- Graceful degradation per endpoint
- User informed of current status

## Future Enhancements

### 1. WebSocket Integration
- Real-time data updates
- Live collaboration features
- Instant notifications

### 2. Offline Support
- Service worker implementation
- Data caching strategies
- Sync when online

### 3. Advanced Error Recovery
- Automatic retry mechanisms
- Queue failed requests
- Background synchronization

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend URL
   - Check browser console for specific CORS messages

2. **Authentication Failures**
   - Verify backend is running on correct port
   - Check token format and expiration
   - Clear localStorage if needed

3. **API Timeouts**
   - Check network connectivity
   - Verify backend health
   - Review API response times

### Debug Mode
Enable debug logging by setting:
```typescript
localStorage.setItem('debug', 'true');
```

This will show detailed API call logs in the browser console.