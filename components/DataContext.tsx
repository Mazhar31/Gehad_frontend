import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Client, PaymentPlan, Invoice, User, ContactMessage, PortfolioCase, Department, Group, Category } from '../types.ts';
import { 
    PROJECTS_DATA, 
    CLIENTS_DATA, 
    DEPARTMENTS_DATA,
    PAYMENT_PLANS_DATA,
    INVOICES_DATA,
    USERS_DATA,
    CONTACT_MESSAGES_DATA,
    PORTFOLIO_CASES_DATA,
    GROUPS_DATA,
    CATEGORIES_DATA,
} from '../constants.ts';
import {
    authAPI,
    dashboardAPI,
    clientAPI,
    projectAPI,
    userAPI,
    invoiceAPI,
    departmentAPI,
    groupAPI,
    categoryAPI,
    paymentPlanAPI,
    portfolioAPI,
    contactAPI,
    adminAPI
} from '../services/api';

// Helper to get initial state from localStorage or use default
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
    }
    return defaultValue;
};

// Helper to safely save to localStorage with quota checking
const safeSetItem = (key: string, value: any): boolean => {
    try {
        const serialized = JSON.stringify(value);
        // Check if the serialized data is too large (>4MB as safety margin)
        if (serialized.length > 4 * 1024 * 1024) {
            console.warn(`Data too large for localStorage: ${key}`);
            return false;
        }
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        if (error instanceof DOMException && error.code === 22) {
            console.error(`LocalStorage quota exceeded for key: ${key}`);
            // Try to clear some space by removing oldest data
            try {
                localStorage.removeItem('app_contact_messages');
                localStorage.removeItem('app_portfolio_cases');
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (retryError) {
                console.error('Failed to save even after clearing space:', retryError);
                return false;
            }
        }
        console.error(`Error saving to localStorage: ${key}`, error);
        return false;
    }
};

interface DataContextType {
    projects: Project[];
    clients: Client[];
    departments: Department[];
    groups: Group[];
    paymentPlans: PaymentPlan[];
    invoices: Invoice[];
    users: User[];
    contactMessages: ContactMessage[];
    portfolioCases: PortfolioCase[];
    // FIX: Added categories state and handlers to data context.
    categories: Category[];
    handleSaveProject: (project: Project) => Promise<void>;
    handleDeleteProject: (projectId: string) => Promise<void>;
    handleSaveClient: (client: Client) => Promise<void>;
    handleDeleteClient: (clientId: string) => Promise<void>;
    handleSaveDepartment: (department: Department) => Promise<void>;
    handleDeleteDepartment: (departmentId: string) => Promise<void>;
    handleSaveGroup: (group: Group) => Promise<void>;
    handleDeleteGroup: (groupId: string) => Promise<void>;
    handleSavePlan: (plan: PaymentPlan) => Promise<void>;
    handleDeletePlan: (planId: string) => Promise<void>;
    handleSaveUser: (user: User) => Promise<void>;
    handleDeleteUser: (userId: string) => Promise<void>;
    handleSaveInvoice: (invoice: Invoice) => Promise<void>;
    handleDeleteInvoice: (invoiceId: string) => Promise<void>;
    handleSaveContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt'>) => Promise<void>;
    handleSavePortfolioCase: (caseItem: PortfolioCase) => Promise<void>;
    handleDeletePortfolioCase: (caseId: string) => Promise<void>;
    handleSaveCategory: (category: Category) => Promise<void>;
    handleDeleteCategory: (categoryId: string) => Promise<void>;
    loadData: () => Promise<void>;
    error: string | null;
    loading: boolean;
    isLoggedIn: boolean;
    userRole: 'admin' | 'user' | null;
    currentUser: User | null;
    login: (role: 'admin' | 'user', userEmail?: string) => void;
    logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(() => getInitialState('app_projects', PROJECTS_DATA));
    const [clients, setClients] = useState<Client[]>(() => getInitialState('app_clients', CLIENTS_DATA));
    const [departments, setDepartments] = useState<Department[]>(() => getInitialState('app_departments', DEPARTMENTS_DATA));
    const [groups, setGroups] = useState<Group[]>(() => getInitialState('app_groups', GROUPS_DATA));
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(() => getInitialState('app_payment_plans', PAYMENT_PLANS_DATA));
    const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialState('app_invoices', INVOICES_DATA));
    const [users, setUsers] = useState<User[]>(() => getInitialState('app_users', USERS_DATA));
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => getInitialState('app_contact_messages', CONTACT_MESSAGES_DATA));
    const [portfolioCases, setPortfolioCases] = useState<PortfolioCase[]>(() => getInitialState('app_portfolio_cases', PORTFOLIO_CASES_DATA));
    // FIX: Added categories state.
    const [categories, setCategories] = useState<Category[]>(() => getInitialState('app_categories', CATEGORIES_DATA));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Effects to save state to localStorage whenever it changes
    useEffect(() => { safeSetItem('app_projects', projects); }, [projects]);
    useEffect(() => { safeSetItem('app_clients', clients); }, [clients]);
    useEffect(() => { safeSetItem('app_departments', departments); }, [departments]);
    useEffect(() => { safeSetItem('app_groups', groups); }, [groups]);
    useEffect(() => { safeSetItem('app_payment_plans', paymentPlans); }, [paymentPlans]);
    useEffect(() => { safeSetItem('app_invoices', invoices); }, [invoices]);
    useEffect(() => { safeSetItem('app_users', users); }, [users]);
    useEffect(() => { safeSetItem('app_contact_messages', contactMessages); }, [contactMessages]);
    useEffect(() => { safeSetItem('app_portfolio_cases', portfolioCases); }, [portfolioCases]);
    // FIX: Added useEffect for categories.
    useEffect(() => { safeSetItem('app_categories', categories); }, [categories]);
    // Authentication state is managed by App.tsx, not persisted here

    // Auto-generate and reconcile subscription invoices whenever projects or plans change
    useEffect(() => {
        setInvoices(prevInvoices => {
            const manualInvoices = prevInvoices.filter(i => i.type === 'manual');
            const generatedSubInvoices: Invoice[] = [];
            const today = new Date();

            const activeProjects = projects.filter(p => p.planId && p.startDate);

            activeProjects.forEach(project => {
                const plan = paymentPlans.find(p => p.id === project.planId);
                if (!plan) return;

                let cursorDate = new Date(project.startDate);
                
                // Generate invoices for all billing periods that have already started
                while (cursorDate < today) {
                    const issueDate = new Date(cursorDate);

                    const price = plan.price;

                    const dueDate = new Date(issueDate);
                    dueDate.setDate(dueDate.getDate() + 15);

                    // Check if an invoice for this period already exists and preserve its 'Paid' status
                    const existingInvoice = prevInvoices.find(inv => 
                        inv.projectId === project.id &&
                        inv.type === 'subscription' &&
                        new Date(inv.issueDate).getTime() === issueDate.getTime()
                    );

                    let status: Invoice['status'] = 'Pending';
                    if (dueDate < today) {
                        status = 'Overdue';
                    }

                    if (existingInvoice && existingInvoice.status === 'Paid') {
                        status = 'Paid';
                    }

                    generatedSubInvoices.push({
                        id: `inv-${project.id}-${issueDate.toISOString().slice(0, 10)}`,
                        invoiceNumber: `SUB-${project.id.toUpperCase()}-${issueDate.getFullYear()}${(issueDate.getMonth() + 1).toString().padStart(2, '0')}`,
                        clientId: project.clientId,
                        projectId: project.id,
                        issueDate: issueDate.toISOString().slice(0, 10),
                        dueDate: dueDate.toISOString().slice(0, 10),
                        items: [{
                            description: `${plan.name} Plan (Annual)`,
                            quantity: 1,
                            price: price,
                        }],
                        status: status,
                        type: 'subscription',
                        currency: plan.currency,
                    });

                    cursorDate.setFullYear(cursorDate.getFullYear() + 1);
                }
            });
            
            const finalInvoices = [...manualInvoices, ...generatedSubInvoices];

            // To prevent unnecessary re-renders, only update state if the invoices have actually changed
            const sortedPrev = [...prevInvoices].sort((a,b) => a.id.localeCompare(b.id));
            const sortedFinal = [...finalInvoices].sort((a,b) => a.id.localeCompare(b.id));

            if (JSON.stringify(sortedPrev) === JSON.stringify(sortedFinal)) {
                return prevInvoices;
            }
            
            return finalInvoices;
        });
    }, [projects, paymentPlans]);


    // Load all data from APIs
    const loadData = async () => {
        if (!isLoggedIn || !localStorage.getItem('auth_token')) {
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // Only load admin APIs if user is admin
            if (userRole === 'admin') {
                const results = await Promise.allSettled([
                    clientAPI.getAll(),
                    projectAPI.getAll(),
                    userAPI.getAll(),
                    invoiceAPI.getAll(),
                    departmentAPI.getAll(),
                    groupAPI.getAll(),
                    categoryAPI.getAll(),
                    paymentPlanAPI.getAll(),
                    portfolioAPI.getAll()
                ]);
                
                const [clientsResult, projectsResult, usersResult, invoicesResult, departmentsResult, groupsResult, categoriesResult, plansResult, portfolioResult] = results;
                
                // Only update state if API calls succeeded, otherwise keep local data
                if (clientsResult.status === 'fulfilled') setClients(Array.isArray(clientsResult.value) ? clientsResult.value : []);
                if (projectsResult.status === 'fulfilled') setProjects(Array.isArray(projectsResult.value) ? projectsResult.value : []);
                if (usersResult.status === 'fulfilled') setUsers(Array.isArray(usersResult.value) ? usersResult.value : []);
                if (invoicesResult.status === 'fulfilled') setInvoices(Array.isArray(invoicesResult.value) ? invoicesResult.value : []);
                if (departmentsResult.status === 'fulfilled') setDepartments(Array.isArray(departmentsResult.value) ? departmentsResult.value : []);
                if (groupsResult.status === 'fulfilled') setGroups(Array.isArray(groupsResult.value) ? groupsResult.value : []);
                if (categoriesResult.status === 'fulfilled') setCategories(Array.isArray(categoriesResult.value) ? categoriesResult.value : []);
                if (plansResult.status === 'fulfilled') setPaymentPlans(Array.isArray(plansResult.value) ? plansResult.value : []);
                if (portfolioResult.status === 'fulfilled') setPortfolioCases(Array.isArray(portfolioResult.value) ? portfolioResult.value : []);
                
                // Check if any API calls failed due to authentication issues
                const authFailures = results.filter(result => 
                    result.status === 'rejected' && 
                    result.reason?.message?.includes('Not authenticated')
                );
                
                if (authFailures.length > 0) {
                    // Authentication failed, logout user
                    console.warn('Authentication failed, logging out user');
                    logout();
                    return;
                }
                
                // Check for other failures (network issues, server down, etc.)
                const otherFailures = results.filter(result => 
                    result.status === 'rejected' && 
                    !result.reason?.message?.includes('Not authenticated')
                );
                
                if (otherFailures.length > 0) {
                    console.warn('Some API calls failed, using local data:', otherFailures.length, 'failures');
                    // Don't set error for network issues, just log and continue with local data
                }
            }
            // For regular users, don't load admin APIs - they'll use local data or user-specific APIs
        } catch (err) {
            console.error('Failed to load data:', err);
            // Don't set error for network issues in development
            if (err instanceof Error && err.message.includes('Backend server not available')) {
                console.warn('Backend not available, using local data');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            }
        } finally {
            setLoading(false);
        }
    };

    // Project Handlers
    const handleSaveProject = async (projectData: Project) => {
        setLoading(true);
        setError(null);
        
        try {
            const plan = paymentPlans.find(p => p.id === projectData.planId);
            const currency = plan ? plan.currency : 'USD';
            const projectWithCurrency = { ...projectData, currency };

            // Validate required fields before API call
            if (!projectWithCurrency.name || !projectWithCurrency.clientId || !projectWithCurrency.planId) {
                throw new Error('Missing required fields: name, client, or payment plan');
            }

            if (projectData.id && projects.some(p => p.id === projectData.id)) {
                const updatedProject = await projectAPI.update(projectData.id, projectWithCurrency);
                setProjects(projects.map(p => p.id === projectData.id ? updatedProject : p));
            } else {
                const newProject = await projectAPI.create(projectWithCurrency);
                setProjects([newProject, ...projects]);
            }
        } catch (err) {
            console.error('Failed to save project:', err);
            let errorMessage = 'Failed to save project';
            if (err instanceof Error) {
                if (err.message.includes('422')) {
                    errorMessage = 'Invalid project data. Please check all required fields.';
                } else if (err.message.includes('Missing required fields')) {
                    errorMessage = err.message;
                } else {
                    errorMessage = err.message;
                }
            }
            setError(errorMessage);
            // Fallback to local storage
            const plan = paymentPlans.find(p => p.id === projectData.planId);
            const currency = plan ? plan.currency : 'USD';
            const projectWithCurrency = { ...projectData, currency };
            
            if (projectData.id && projects.some(p => p.id === projectData.id)) {
                setProjects(projects.map(p => p.id === projectData.id ? projectWithCurrency : p));
            } else {
                const newProject = { ...projectWithCurrency, id: `p-${Date.now()}` };
                setProjects([newProject, ...projects]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await projectAPI.delete(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (err) {
            console.error('Failed to delete project:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete project');
            // Fallback to local storage
            setProjects(projects.filter(p => p.id !== projectId));
        } finally {
            setLoading(false);
        }
    };

    // Client Handlers
    const handleSaveClient = async (clientData: Client) => {
        setLoading(true);
        setError(null);
        
        try {
            if (clientData.id && clients.some(c => c.id === clientData.id)) {
                const updatedClient = await clientAPI.update(clientData.id, clientData);
                setClients(clients.map(c => c.id === clientData.id ? updatedClient : c));
            } else {
                const newClient = await clientAPI.create(clientData);
                setClients([newClient, ...clients]);
            }
        } catch (err) {
            console.error('Failed to save client:', err);
            setError(err instanceof Error ? err.message : 'Failed to save client');
            // Fallback to local storage
            if (clientData.id && clients.some(c => c.id === clientData.id)) {
                setClients(clients.map(c => c.id === clientData.id ? clientData : c));
            } else {
                const newAvatar = clientData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`;
                const newClient = { ...clientData, id: `c-${Date.now()}`, avatarUrl: newAvatar };
                setClients([newClient, ...clients]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClient = async (clientId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await clientAPI.delete(clientId);
            setClients(clients.filter(c => c.id !== clientId));
        } catch (err) {
            console.error('Failed to delete client:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete client');
            // Fallback to local storage
            setClients(clients.filter(c => c.id !== clientId));
        } finally {
            setLoading(false);
        }
    };
    
    // Department Handlers
    const handleSaveDepartment = async (departmentData: Department) => {
        setLoading(true);
        setError(null);
        
        try {
            if (departmentData.id && departments.some(d => d.id === departmentData.id)) {
                const updatedDepartment = await departmentAPI.update(departmentData.id, departmentData);
                setDepartments(departments.map(d => d.id === departmentData.id ? updatedDepartment : d));
            } else {
                const newDepartment = await departmentAPI.create(departmentData);
                setDepartments([newDepartment, ...departments]);
            }
        } catch (err) {
            console.error('Failed to save department:', err);
            setError(err instanceof Error ? err.message : 'Failed to save department');
            // Fallback to local storage
            if (departmentData.id && departments.some(d => d.id === departmentData.id)) {
                setDepartments(departments.map(d => d.id === departmentData.id ? departmentData : d));
            } else {
                const newDepartment = { ...departmentData, id: `dept-${Date.now()}` };
                setDepartments([newDepartment, ...departments]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (departmentId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await departmentAPI.delete(departmentId);
            setDepartments(departments.filter(d => d.id !== departmentId));
        } catch (err) {
            console.error('Failed to delete department:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete department');
            // Fallback to local storage
            setDepartments(departments.filter(d => d.id !== departmentId));
        } finally {
            setLoading(false);
        }
    };

    // Group Handlers
    const handleSaveGroup = async (groupData: Group) => {
        setLoading(true);
        setError(null);
        
        try {
            if (groupData.id && groups.some(g => g.id === groupData.id)) {
                const updatedGroup = await groupAPI.update(groupData.id, groupData);
                setGroups(groups.map(g => g.id === groupData.id ? updatedGroup : g));
            } else {
                const newGroup = await groupAPI.create(groupData);
                setGroups([newGroup, ...groups]);
            }
        } catch (err) {
            console.error('Failed to save group:', err);
            setError(err instanceof Error ? err.message : 'Failed to save group');
            // Fallback to local storage
            if (groupData.id && groups.some(g => g.id === groupData.id)) {
                setGroups(groups.map(g => g.id === groupData.id ? groupData : g));
            } else {
                const newGroup = { ...groupData, id: `g-${Date.now()}` };
                setGroups([newGroup, ...groups]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await groupAPI.delete(groupId);
            setGroups(groups.filter(g => g.id !== groupId));
            setClients(prevClients => prevClients.map(client => client.groupId === groupId ? { ...client, groupId: undefined } : client));
        } catch (err) {
            console.error('Failed to delete group:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete group');
            // Fallback to local storage
            setGroups(groups.filter(g => g.id !== groupId));
            setClients(prevClients => prevClients.map(client => client.groupId === groupId ? { ...client, groupId: undefined } : client));
        } finally {
            setLoading(false);
        }
    };

    // Payment Plan Handlers
    const handleSavePlan = async (planData: PaymentPlan) => {
        setLoading(true);
        setError(null);
        
        try {
            if (planData.id && paymentPlans.some(p => p.id === planData.id)) {
                const updatedPlan = await paymentPlanAPI.update(planData.id, planData);
                setPaymentPlans(paymentPlans.map(p => p.id === planData.id ? updatedPlan : p));
            } else {
                const newPlan = await paymentPlanAPI.create(planData);
                setPaymentPlans([newPlan, ...paymentPlans]);
            }
            // Refresh all payment plans from API to ensure data consistency
            try {
                const refreshedPlans = await paymentPlanAPI.getAll();
                setPaymentPlans(refreshedPlans);
            } catch (refreshError) {
                console.log('Failed to refresh payment plans, using current data');
            }
        } catch (err) {
            console.error('Failed to save payment plan:', err);
            setError(err instanceof Error ? err.message : 'Failed to save payment plan');
            // Fallback to local storage
            if (planData.id && paymentPlans.some(p => p.id === planData.id)) {
                setPaymentPlans(paymentPlans.map(p => p.id === planData.id ? planData : p));
            } else {
                const newPlan = { ...planData, id: `plan-${Date.now()}` };
                setPaymentPlans([newPlan, ...paymentPlans]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (planId: string) => {
        const plan = paymentPlans.find(p => p.id === planId);
        const planName = plan ? plan.name : 'this plan';
        
        if (!window.confirm(`Are you sure you want to delete ${planName}? This action cannot be undone.`)) {
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('Current payment plans before deletion:', paymentPlans.map(p => ({ id: p.id, name: p.name })));
            console.log('Attempting to delete payment plan:', planId);
            
            const result = await paymentPlanAPI.delete(planId);
            console.log('Payment plan delete API result:', result);
            
            // Add a small delay to ensure backend transaction is committed
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh payment plans from API to ensure sync with database
            try {
                console.log('Refreshing payment plans from API...');
                const refreshedPlans = await paymentPlanAPI.getAll();
                console.log('Refreshed payment plans:', refreshedPlans.map(p => ({ id: p.id, name: p.name })));
                setPaymentPlans(refreshedPlans);
                console.log('Payment plans state updated after deletion');
            } catch (refreshError) {
                console.error('Failed to refresh payment plans after deletion:', refreshError);
                // Fallback to local removal only if refresh fails
                setPaymentPlans(paymentPlans.filter(p => p.id !== planId));
            }
        } catch (err) {
            console.error('Failed to delete payment plan from API:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete payment plan');
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    // User Handlers
    const handleSaveUser = async (userData: User & { accountType?: 'admin' | 'user' }) => {
        setLoading(true);
        setError(null);
        
        try {
            if (userData.id && users.some(u => u.id === userData.id)) {
                // Update existing user
                const updatedUser = await userAPI.update(userData.id, userData);
                setUsers(users.map(u => u.id === userData.id ? updatedUser : u));
            } else {
                // Create new user or admin
                if (userData.accountType === 'admin') {
                    // Create admin account
                    const adminData = {
                        name: userData.name,
                        email: userData.email,
                        position: userData.position,
                        password: userData.password || 'password'
                    };
                    await adminAPI.create(adminData);
                    // Note: Admin accounts are not stored in the users list as they are separate entities
                    // Show success message but don't add to users state
                } else {
                    // Create regular user account
                    const newUser = await userAPI.create(userData);
                    setUsers([newUser, ...users]);
                }
            }
        } catch (err) {
            console.error('Failed to save user:', err);
            setError(err instanceof Error ? err.message : 'Failed to save user');
            // Fallback to local storage
            if (userData.id && users.some(u => u.id === userData.id)) {
                setUsers(users.map(u => {
                    if (u.id === userData.id) {
                        const newPassword = (userData.password && userData.password.trim() !== '') ? userData.password : u.password;
                        return { ...u, ...userData, password: newPassword };
                    }
                    return u;
                }));
            } else if (userData.accountType !== 'admin') {
                // Only add to users list if it's not an admin account
                const newUser = { 
                    ...userData, 
                    id: `u-${Date.now()}`, 
                    avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
                    dashboardAccess: userData.dashboardAccess || 'view-only',
                    projectIds: userData.projectIds || [],
                    password: userData.password || 'password'
                };
                setUsers([newUser, ...users]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await userAPI.delete(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete user');
            // Fallback to local storage
            setUsers(users.filter(u => u.id !== userId));
        } finally {
            setLoading(false);
        }
    };

    // Invoice Handlers
    const handleSaveInvoice = async (invoiceData: Invoice) => {
        setLoading(true);
        setError(null);
        
        try {
            if (invoiceData.id && invoices.some(i => i.id === invoiceData.id)) {
                const updatedInvoice = await invoiceAPI.update(invoiceData.id, invoiceData);
                setInvoices(invoices.map(i => i.id === invoiceData.id ? updatedInvoice : i));
            } else {
                const newInvoice = await invoiceAPI.create(invoiceData);
                setInvoices([newInvoice, ...invoices]);
            }
        } catch (err) {
            console.error('Failed to save invoice:', err);
            setError(err instanceof Error ? err.message : 'Failed to save invoice');
            // Fallback to local storage
            if (invoiceData.id && invoices.some(i => i.id === invoiceData.id)) {
                setInvoices(invoices.map(i => i.id === invoiceData.id ? invoiceData : i));
            } else {
                const newInvoice = { ...invoiceData, id: `inv-${Date.now()}` };
                setInvoices([newInvoice, ...invoices]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInvoice = async (invoiceId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await invoiceAPI.delete(invoiceId);
            setInvoices(invoices.filter(i => i.id !== invoiceId));
        } catch (err) {
            console.error('Failed to delete invoice:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete invoice');
            // Fallback to local storage
            setInvoices(invoices.filter(i => i.id !== invoiceId));
        } finally {
            setLoading(false);
        }
    };

    // Contact Message Handler
    const handleSaveContactMessage = async (messageData: Omit<ContactMessage, 'id' | 'createdAt'>) => {
        setLoading(true);
        setError(null);
        
        try {
            await contactAPI.submit(messageData);
            const newMessage: ContactMessage = {
                ...messageData,
                id: `msg-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            setContactMessages(prev => [newMessage, ...prev]);
        } catch (err) {
            console.error('Failed to save contact message:', err);
            setError(err instanceof Error ? err.message : 'Failed to save contact message');
            // Fallback to local storage
            const newMessage: ContactMessage = {
                ...messageData,
                id: `msg-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };
            setContactMessages(prev => [newMessage, ...prev]);
        } finally {
            setLoading(false);
        }
    };

    // Portfolio Case Handlers
    const handleSavePortfolioCase = async (caseData: PortfolioCase) => {
        setLoading(true);
        setError(null);
        
        try {
            if (caseData.id && portfolioCases.some(c => c.id === caseData.id)) {
                const updatedCase = await portfolioAPI.update(caseData.id, caseData);
                setPortfolioCases(portfolioCases.map(c => c.id === caseData.id ? updatedCase : c));
            } else {
                const newCase = await portfolioAPI.create(caseData);
                setPortfolioCases([newCase, ...portfolioCases]);
            }
        } catch (err) {
            console.error('Failed to save portfolio case:', err);
            setError(err instanceof Error ? err.message : 'Failed to save portfolio case');
            // Fallback to local storage
            if (caseData.id && portfolioCases.some(c => c.id === caseData.id)) {
                setPortfolioCases(portfolioCases.map(c => c.id === caseData.id ? caseData : c));
            } else {
                const newCase = { ...caseData, id: `pc-${Date.now()}` };
                setPortfolioCases([newCase, ...portfolioCases]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePortfolioCase = async (caseId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await portfolioAPI.delete(caseId);
            setPortfolioCases(portfolioCases.filter(c => c.id !== caseId));
        } catch (err) {
            console.error('Failed to delete portfolio case:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete portfolio case');
            // Fallback to local storage
            setPortfolioCases(portfolioCases.filter(c => c.id !== caseId));
        } finally {
            setLoading(false);
        }
    };

    // Category Handlers
    const handleSaveCategory = async (categoryData: Category) => {
        setLoading(true);
        setError(null);
        
        try {
            if (categoryData.id && categories.some(c => c.id === categoryData.id)) {
                const updatedCategory = await categoryAPI.update(categoryData.id, categoryData);
                setCategories(categories.map(c => c.id === categoryData.id ? updatedCategory : c));
            } else {
                const newCategory = await categoryAPI.create(categoryData);
                setCategories([newCategory, ...categories]);
            }
        } catch (err) {
            console.error('Failed to save category:', err);
            setError(err instanceof Error ? err.message : 'Failed to save category');
            // Fallback to local storage
            if (categoryData.id && categories.some(c => c.id === categoryData.id)) {
                setCategories(categories.map(c => c.id === categoryData.id ? categoryData : c));
            } else {
                const newCategory = { ...categoryData, id: `cat-${Date.now()}` };
                setCategories([newCategory, ...categories]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await categoryAPI.delete(categoryId);
            setCategories(categories.filter(c => c.id !== categoryId));
        } catch (err) {
            console.error('Failed to delete category:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete category');
            // Fallback to local storage
            setCategories(categories.filter(c => c.id !== categoryId));
        } finally {
            setLoading(false);
        }
    };


    // Load data when user logs in and has a valid token
    useEffect(() => {
        if (isLoggedIn && localStorage.getItem('auth_token')) {
            const timer = setTimeout(() => {
                loadData();
            }, 1000); // Increased delay to allow app to fully initialize
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, userRole]);

    // Auth Handlers
    const login = (role: 'admin' | 'user', userEmail?: string) => {
        console.log('🔑 Logging in user:', { role, userEmail });
        setIsLoggedIn(true);
        setUserRole(role);
        setError(null); // Clear any previous errors
        
        if (role === 'user' && userEmail) {
            let userToLogin = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
            
            // If user not found in local data, create a temporary user object
            if (!userToLogin) {
                console.log('👤 User not found in local data, creating temporary user');
                userToLogin = {
                    id: `temp-${Date.now()}`,
                    name: userEmail.split('@')[0], // Use email prefix as name
                    email: userEmail,
                    position: 'User',
                    clientId: 'temp-client',
                    role: 'normal',
                    dashboardAccess: 'view-only',
                    projectIds: [],
                    avatarUrl: `https://i.pravatar.cc/150?u=${userEmail}`,
                    password: ''
                };
            }
            
            setCurrentUser(userToLogin);
            console.log('👤 User set:', userToLogin?.name || 'Unknown');
        }
        console.log('✅ Login successful');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUser(null);
        setError(null);
        // Clear all authentication-related localStorage items
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('app_isLoggedIn');
        localStorage.removeItem('app_userRole');
        localStorage.removeItem('app_currentUser');
    };


    const value = {
        projects,
        clients,
        departments,
        groups,
        paymentPlans,
        invoices,
        users,
        contactMessages,
        portfolioCases,
        categories,
        handleSaveProject,
        handleDeleteProject,
        handleSaveClient,
        handleDeleteClient,
        handleSaveDepartment,
        handleDeleteDepartment,
        handleSaveGroup,
        handleDeleteGroup,
        handleSavePlan,
        handleDeletePlan,
        handleSaveUser,
        handleDeleteUser,
        handleSaveInvoice,
        handleDeleteInvoice,
        handleSaveContactMessage,
        handleSavePortfolioCase,
        handleDeletePortfolioCase,
        handleSaveCategory,
        handleDeleteCategory,
        loadData,
        error,
        loading,
        isLoggedIn,
        userRole,
        currentUser,
        login,
        logout,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
