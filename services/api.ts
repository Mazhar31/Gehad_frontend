import { 
  Client, 
  Project, 
  Invoice, 
  PaymentPlan, 
  User, 
  ContactMessage, 
  PortfolioCase, 
  Department, 
  Group, 
  Category 
} from '../types';
import { API_CONFIG } from '../config/api';
import { refreshCacheBuster } from '../utils/imageUtils';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Helper function for API calls with error handling
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
    console.log(`API call to ${endpoint} with token: ${token.substring(0, 20)}...`);
  } else {
    console.log(`API call to ${endpoint} without token`);
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Clear invalid token but don't throw immediately
        // Let the calling code handle the authentication failure
        const errorData = await response.json().catch(() => ({}));
        throw new Error('Not authenticated');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response.text() as unknown as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Backend server not available');
    }
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Auth APIs
export const authAPI = {
  adminLogin: async (email: string, password: string) => {
    return apiCall<{ success: boolean; data: { access_token: string; token_type: string; requires_2fa?: boolean }; message: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  userLogin: async (email: string, password: string) => {
    return apiCall<{ success: boolean; data: { access_token: string; token_type: string; requires_2fa?: boolean }; message: string }>('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  adminVerify2FA: async (token: string) => {
    return apiCall<{ access_token: string; token_type: string }>('/auth/admin/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  userVerify2FA: async (token: string) => {
    return apiCall<{ access_token: string; token_type: string }>('/auth/user/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  getCurrentUser: async () => {
    return apiCall<{ id: string; email: string; role: string; name?: string }>('/auth/me');
  },

  forgotPassword: async (email: string) => {
    return apiCall<{ message: string }>(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST',
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return apiCall<{ message: string }>(`/auth/reset-password?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`, {
      method: 'POST',
    });
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: async () => {
    return apiCall<{
      total_clients: number;
      total_projects: number;
      total_revenue: number;
      active_projects: number;
    }>('/admin/dashboard/stats');
  },

  getRecentProjects: async () => {
    return apiCall<Project[]>('/admin/dashboard/recent-projects');
  },
};

// Client APIs
export const clientAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/clients/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((client: any) => ({
      id: client.id,
      company: client.company,
      email: client.email,
      mobile: client.mobile,
      address: client.address,
      avatarUrl: refreshCacheBuster(client.avatar_url),
      groupId: client.group_id
    }));
    return transformedData;
  },

  create: async (client: Omit<Client, 'id'>) => {
    const response = await apiCall<{ success: boolean; data: any }>('/admin/clients/', {
      method: 'POST',
      body: JSON.stringify(client),
    });
    // Transform backend response to frontend format
    const clientData = response.data;
    return {
      id: clientData.id,
      company: clientData.company,
      email: clientData.email,
      mobile: clientData.mobile,
      address: clientData.address,
      avatarUrl: refreshCacheBuster(clientData.avatar_url),
      groupId: clientData.group_id
    };
  },

  update: async (id: string, client: Partial<Client>) => {
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
    // Transform backend response to frontend format
    const updatedClient = response.data;
    return {
      id: updatedClient.id,
      company: updatedClient.company,
      email: updatedClient.email,
      mobile: updatedClient.mobile,
      address: updatedClient.address,
      avatarUrl: refreshCacheBuster(updatedClient.avatar_url),
      groupId: updatedClient.group_id
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

// Project APIs
export const projectAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/projects/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((project: any) => ({
      id: project.id,
      name: project.name,
      clientId: project.client_id,
      planId: project.plan_id,
      departmentId: project.department_id,
      status: project.status,
      startDate: project.start_date,
      dashboardUrl: project.dashboard_url,
      imageUrl: refreshCacheBuster(project.image_url),
      projectType: project.project_type,
      currency: project.currency,
      progress: project.progress,
      dashboardInstanceId: project.dashboard_instance_id
    }));
    return transformedData;
  },

  create: async (project: Omit<Project, 'id'>) => {
    // Transform frontend field names to backend field names
    const backendProject = {
      name: project.name,
      client_id: project.clientId,
      plan_id: project.planId,
      department_id: project.departmentId,
      status: project.status,
      start_date: project.startDate,
      dashboard_url: project.dashboardUrl,
      image_url: project.imageUrl,
      project_type: project.projectType,
      currency: project.currency
    };
    const response = await apiCall<{ success: boolean; data: any }>('/admin/projects/', {
      method: 'POST',
      body: JSON.stringify(backendProject),
    });
    // Transform backend response to frontend format
    const projectData = response.data;
    return {
      id: projectData.id,
      name: projectData.name,
      clientId: projectData.client_id,
      planId: projectData.plan_id,
      departmentId: projectData.department_id,
      status: projectData.status,
      startDate: projectData.start_date,
      dashboardUrl: projectData.dashboard_url,
      imageUrl: refreshCacheBuster(projectData.image_url),
      projectType: projectData.project_type,
      currency: projectData.currency,
      progress: projectData.progress,
      dashboardInstanceId: projectData.dashboard_instance_id
    };
  },

  update: async (id: string, project: Partial<Project>) => {
    // Transform frontend field names to backend field names
    const backendProject: any = {};
    if (project.name) backendProject.name = project.name;
    if (project.clientId) backendProject.client_id = project.clientId;
    if (project.planId) backendProject.plan_id = project.planId;
    if (project.departmentId) backendProject.department_id = project.departmentId;
    if (project.status) backendProject.status = project.status;
    if (project.startDate) backendProject.start_date = project.startDate;
    if (project.dashboardUrl) backendProject.dashboard_url = project.dashboardUrl;
    if (project.imageUrl) backendProject.image_url = project.imageUrl;
    if (project.projectType) backendProject.project_type = project.projectType;
    if (project.currency) backendProject.currency = project.currency;
    if (project.dashboardInstanceId) backendProject.dashboard_instance_id = project.dashboardInstanceId;
    
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendProject),
    });
    // Transform backend response to frontend format
    const updatedProject = response.data;
    return {
      id: updatedProject.id,
      name: updatedProject.name,
      clientId: updatedProject.client_id,
      planId: updatedProject.plan_id,
      departmentId: updatedProject.department_id,
      status: updatedProject.status,
      startDate: updatedProject.start_date,
      dashboardUrl: updatedProject.dashboard_url,
      imageUrl: refreshCacheBuster(updatedProject.image_url),
      projectType: updatedProject.project_type,
      currency: updatedProject.currency,
      progress: updatedProject.progress,
      dashboardInstanceId: updatedProject.dashboard_instance_id
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // User project APIs
  getUserProjects: async () => {
    const response = await apiCall<{ success: boolean; data: Project[] }>('/admin/projects/user/my-projects');
    return response.data || [];
  },

  getUserProject: async (id: string) => {
    const response = await apiCall<{ success: boolean; data: Project }>(`/user/projects/${id}`);
    return response.data;
  },

  getUserAddins: async () => {
    const response = await apiCall<{ success: boolean; data: Project[] }>('/user/addins');
    return response.data || [];
  },
};

// User APIs
export const userAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/users/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      position: user.position,
      clientId: user.client_id,
      role: user.role,
      dashboardAccess: user.dashboard_access,
      projectIds: user.project_ids || [],
      avatarUrl: refreshCacheBuster(user.avatar_url),
      password: user.password
    }));
    return transformedData;
  },

  create: async (user: Omit<User, 'id'>) => {
    // Transform frontend field names to backend field names
    const backendUser = {
      name: user.name,
      email: user.email,
      position: user.position,
      client_id: user.clientId,
      role: user.role,
      dashboard_access: user.dashboardAccess,
      password: user.password || 'password',
      project_ids: user.projectIds || []
    };
    const response = await apiCall<{ success: boolean; data: any }>('/admin/users/', {
      method: 'POST',
      body: JSON.stringify(backendUser),
    });
    // Transform backend response to frontend format
    const userData = response.data;
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      position: userData.position,
      clientId: userData.client_id,
      role: userData.role,
      dashboardAccess: userData.dashboard_access,
      projectIds: userData.project_ids || [],
      avatarUrl: refreshCacheBuster(userData.avatar_url),
      password: userData.password
    };
  },

  update: async (id: string, user: Partial<User>) => {
    // Transform frontend field names to backend field names
    const backendUser: any = {};
    if (user.name) backendUser.name = user.name;
    if (user.email) backendUser.email = user.email;
    if (user.position) backendUser.position = user.position;
    if (user.clientId) backendUser.client_id = user.clientId;
    if (user.role) backendUser.role = user.role;
    if (user.dashboardAccess) backendUser.dashboard_access = user.dashboardAccess;
    if (user.password) backendUser.password = user.password;
    if (user.projectIds) backendUser.project_ids = user.projectIds;
    if (user.avatarUrl) backendUser.avatar_url = user.avatarUrl;
    
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendUser),
    });
    // Transform backend response to frontend format
    const updatedUser = response.data;
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      position: updatedUser.position,
      clientId: updatedUser.client_id,
      role: updatedUser.role,
      dashboardAccess: updatedUser.dashboard_access,
      projectIds: updatedUser.project_ids || [],
      avatarUrl: refreshCacheBuster(updatedUser.avatar_url),
      password: updatedUser.password
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  exportEmails: async () => {
    return apiCall<Blob>('/admin/users/export-emails', {
      headers: {
        'Accept': 'text/csv',
      },
    });
  },

  updateProfile: async (profile: Partial<User>) => {
    return apiCall<{ success: boolean; data: any; message: string }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiCall<{ success: boolean; message: string }>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/upload-avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// Invoice APIs
export const invoiceAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/invoices/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((invoice: any) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      clientId: invoice.client_id,
      projectId: invoice.project_id,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      status: invoice.status,
      type: invoice.type,
      currency: invoice.currency,
      items: invoice.items || []
    }));
    return transformedData;
  },

  create: async (invoice: Omit<Invoice, 'id'>) => {
    // Transform frontend field names to backend field names
    const backendInvoice = {
      client_id: invoice.clientId,
      project_id: invoice.projectId,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      status: invoice.status,
      type: invoice.type,
      currency: invoice.currency,
      items: invoice.items
    };
    const response = await apiCall<{ success: boolean; data: any }>('/admin/invoices/', {
      method: 'POST',
      body: JSON.stringify(backendInvoice),
    });
    // Transform backend response to frontend format
    const invoiceData = response.data;
    return {
      id: invoiceData.id,
      invoiceNumber: invoiceData.invoice_number,
      clientId: invoiceData.client_id,
      projectId: invoiceData.project_id,
      issueDate: invoiceData.issue_date,
      dueDate: invoiceData.due_date,
      status: invoiceData.status,
      type: invoiceData.type,
      currency: invoiceData.currency,
      items: invoiceData.items || []
    };
  },

  update: async (id: string, invoice: Partial<Invoice>) => {
    // Transform frontend field names to backend field names
    const backendInvoice: any = {};
    if (invoice.clientId) backendInvoice.client_id = invoice.clientId;
    if (invoice.projectId) backendInvoice.project_id = invoice.projectId;
    if (invoice.issueDate) backendInvoice.issue_date = invoice.issueDate;
    if (invoice.dueDate) backendInvoice.due_date = invoice.dueDate;
    if (invoice.status) backendInvoice.status = invoice.status;
    if (invoice.type) backendInvoice.type = invoice.type;
    if (invoice.currency) backendInvoice.currency = invoice.currency;
    if (invoice.items) backendInvoice.items = invoice.items;
    
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendInvoice),
    });
    // Transform backend response to frontend format
    const updatedInvoice = response.data;
    return {
      id: updatedInvoice.id,
      invoiceNumber: updatedInvoice.invoice_number,
      clientId: updatedInvoice.client_id,
      projectId: updatedInvoice.project_id,
      issueDate: updatedInvoice.issue_date,
      dueDate: updatedInvoice.due_date,
      status: updatedInvoice.status,
      type: updatedInvoice.type,
      currency: updatedInvoice.currency,
      items: updatedInvoice.items || []
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  send: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/invoices/${id}/send`, {
      method: 'POST',
    });
  },

  // User invoice APIs
  getUserInvoices: async () => {
    const response = await apiCall<{ success: boolean; data: Invoice[] }>('/users/invoices');
    return response.data || [];
  },

  payInvoice: async (id: string) => {
    const response = await apiCall<{ success: boolean; data: Invoice }>(`/user/invoices/${id}/pay`, {
      method: 'PUT',
    });
    return response.data;
  },
};

// Department APIs
export const departmentAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: Department[] }>('/admin/departments');
    return response.data || [];
  },

  create: async (department: Omit<Department, 'id'>) => {
    const response = await apiCall<{ success: boolean; data: Department }>('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(department),
    });
    return response.data;
  },

  update: async (id: string, department: Partial<Department>) => {
    const response = await apiCall<{ success: boolean; data: Department }>(`/admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(department),
    });
    return response.data;
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/departments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Group APIs
export const groupAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: Group[] }>('/admin/groups');
    return response.data || [];
  },

  create: async (group: Omit<Group, 'id'>) => {
    const response = await apiCall<{ success: boolean; data: Group }>('/admin/groups', {
      method: 'POST',
      body: JSON.stringify(group),
    });
    return response.data;
  },

  update: async (id: string, group: Partial<Group>) => {
    const response = await apiCall<{ success: boolean; data: Group }>(`/admin/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(group),
    });
    return response.data;
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/groups/${id}`, {
      method: 'DELETE',
    });
  },
};

// Category APIs
export const categoryAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: Category[] }>('/admin/categories');
    return response.data || [];
  },

  create: async (category: Omit<Category, 'id'>) => {
    const response = await apiCall<{ success: boolean; data: Category }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return response.data;
  },

  update: async (id: string, category: Partial<Category>) => {
    const response = await apiCall<{ success: boolean; data: Category }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
    return response.data;
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Payment Plan APIs
export const paymentPlanAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/payment-plans/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      features: plan.features,
      isPopular: plan.is_popular,
      is_popular: plan.is_popular
    }));
    return transformedData;
  },

  create: async (plan: Omit<PaymentPlan, 'id'>) => {
    // Transform frontend field names to backend field names
    const backendPlan = {
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      features: plan.features,
      is_popular: plan.isPopular || plan.is_popular || false
    };
    const response = await apiCall<{ success: boolean; data: any }>('/admin/payment-plans/', {
      method: 'POST',
      body: JSON.stringify(backendPlan),
    });
    // Transform backend response to frontend format
    const planData = response.data;
    return {
      id: planData.id,
      name: planData.name,
      price: planData.price,
      currency: planData.currency,
      features: planData.features,
      isPopular: planData.is_popular,
      is_popular: planData.is_popular
    };
  },

  update: async (id: string, plan: Partial<PaymentPlan>) => {
    // Transform frontend field names to backend field names
    const backendPlan: any = {};
    if (plan.name) backendPlan.name = plan.name;
    if (plan.price !== undefined) backendPlan.price = plan.price;
    if (plan.currency) backendPlan.currency = plan.currency;
    if (plan.features) backendPlan.features = plan.features;
    if (plan.isPopular !== undefined || plan.is_popular !== undefined) {
      backendPlan.is_popular = plan.isPopular || plan.is_popular || false;
    }
    
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/payment-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendPlan),
    });
    // Transform backend response to frontend format
    const updatedPlan = response.data;
    return {
      id: updatedPlan.id,
      name: updatedPlan.name,
      price: updatedPlan.price,
      currency: updatedPlan.currency,
      features: updatedPlan.features,
      isPopular: updatedPlan.is_popular,
      is_popular: updatedPlan.is_popular
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/payment-plans/${id}`, {
      method: 'DELETE',
    });
  },
};

// Portfolio APIs
export const portfolioAPI = {
  getAll: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/portfolio/');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((portfolioCase: any) => ({
      id: portfolioCase.id,
      category: portfolioCase.category,
      title: portfolioCase.title,
      description: portfolioCase.description,
      imageUrl: refreshCacheBuster(portfolioCase.image_url),
      link: portfolioCase.link
    }));
    return transformedData;
  },

  create: async (portfolioCase: Omit<PortfolioCase, 'id'>) => {
    const response = await apiCall<{ success: boolean; data: any }>('/admin/portfolio/', {
      method: 'POST',
      body: JSON.stringify(portfolioCase),
    });
    // Transform backend response to frontend format
    const caseData = response.data;
    return {
      id: caseData.id,
      category: caseData.category,
      title: caseData.title,
      description: caseData.description,
      imageUrl: refreshCacheBuster(caseData.image_url),
      link: caseData.link
    };
  },

  update: async (id: string, portfolioCase: Partial<PortfolioCase>) => {
    const response = await apiCall<{ success: boolean; data: any }>(`/admin/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioCase),
    });
    // Transform backend response to frontend format
    const updatedCase = response.data;
    return {
      id: updatedCase.id,
      category: updatedCase.category,
      title: updatedCase.title,
      description: updatedCase.description,
      imageUrl: refreshCacheBuster(updatedCase.image_url),
      link: updatedCase.link
    };
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/portfolio/${id}`, {
      method: 'DELETE',
    });
  },

  getPublic: async () => {
    const response = await apiCall<{ success: boolean; data: any[] }>('/admin/portfolio/public');
    // Transform backend snake_case to frontend camelCase
    const transformedData = (response.data || []).map((portfolioCase: any) => ({
      id: portfolioCase.id,
      category: portfolioCase.category,
      title: portfolioCase.title,
      description: portfolioCase.description,
      imageUrl: refreshCacheBuster(portfolioCase.image_url),
      link: portfolioCase.link
    }));
    return transformedData;
  },
};

// Contact APIs
export const contactAPI = {
  submit: async (message: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    return apiCall<{ message: string }>('/contact/', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },
};

// File Upload APIs
export const uploadAPI = {
  uploadImage: async (file: File, type: 'avatar' | 'logo' | 'project' | 'portfolio') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  uploadDashboard: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/dashboard`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  deleteFile: async (filename: string) => {
    return apiCall<{ message: string }>(`/upload/${filename}`, {
      method: 'DELETE',
    });
  },
};

// Admin Profile APIs
export const adminAPI = {
  create: async (admin: { name: string; email: string; position: string; password: string }) => {
    const response = await apiCall<{ success: boolean; data: any }>('/admin/admins', {
      method: 'POST',
      body: JSON.stringify(admin),
    });
    return response.data;
  },

  updateProfile: async (profile: any) => {
    return apiCall<any>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/profile/upload-avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiCall<{ message: string }>('/admin/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  updateFirebaseProfile: async (formData: FormData) => {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/firebase/profile`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Update failed: ${response.statusText}`);
    }

    return response.json();
  },
};

// Deploy APIs
export const deployAPI = {
  deployProject: async (projectId: string, dashboardFile: File) => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('dashboard_file', dashboardFile);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/deploy/project`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Deploy failed: ${response.statusText}`);
    }

    return response.json();
  },

  getDeploymentStatus: async (deploymentId: string) => {
    return apiCall<{ success: boolean; data: any }>(`/admin/deploy/status/${deploymentId}`);
  },

  deleteProjectDashboard: async (projectId: string) => {
    return apiCall<{ success: boolean; message: string }>(`/admin/deploy/project/${projectId}`, {
      method: 'DELETE',
    });
  },

  deploySubdomain: async (subdomain: string, dashboardFile: File) => {
    const formData = new FormData();
    formData.append('subdomain', subdomain);
    formData.append('dashboard_file', dashboardFile);

    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/deploy/subdomain`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Deploy failed: ${response.statusText}`);
    }

    return response.json();
  },
};