import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Client, PaymentPlan, Invoice, User, ContactMessage, PortfolioCase, Department, Group, Category } from '../types.ts';

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
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
    const [portfolioCases, setPortfolioCases] = useState<PortfolioCase[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    // Authentication state is managed by App.tsx, not persisted here

    // Auto-generate and reconcile subscription invoices whenever projects or plans change
    useEffect(() => {
        const generateAndSaveSubscriptionInvoices = async () => {
            const manualInvoices = invoices.filter(i => i.type === 'manual');
            const existingSubInvoices = invoices.filter(i => i.type === 'subscription');
            const generatedSubInvoices: Invoice[] = [];
            const newInvoicesToSave: Invoice[] = [];
            const today = new Date();

            const activeProjects = projects.filter(p => p.planId && p.startDate);

            activeProjects.forEach(project => {
                const plan = paymentPlans.find(p => p.id === project.planId);
                if (!plan) return;

                let cursorDate = new Date(project.startDate);
                
                // Generate invoices for all billing periods that have already started
                while (cursorDate < today) {
                    const issueDate = new Date(cursorDate);
                    const invoiceId = `inv-${project.id}-${issueDate.toISOString().slice(0, 10)}`;

                    const price = plan.price;

                    const dueDate = new Date(issueDate);
                    dueDate.setDate(dueDate.getDate() + 15);

                    // Check if an invoice for this period already exists
                    const existingInvoice = existingSubInvoices.find(inv => 
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

                    const invoiceData: Invoice = {
                        id: invoiceId,
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
                    };

                    generatedSubInvoices.push(invoiceData);

                    // If this invoice doesn't exist in database, mark it for saving
                    if (!existingInvoice) {
                        newInvoicesToSave.push(invoiceData);
                    }

                    cursorDate.setFullYear(cursorDate.getFullYear() + 1);
                }
            });
            
            // Save new subscription invoices to database
            if (newInvoicesToSave.length > 0) {
                console.log(`Saving ${newInvoicesToSave.length} new subscription invoices to database`);
                for (const invoice of newInvoicesToSave) {
                    try {
                        await invoiceAPI.create(invoice);
                        console.log(`Saved subscription invoice: ${invoice.invoiceNumber}`);
                    } catch (error) {
                        console.error(`Failed to save subscription invoice ${invoice.invoiceNumber}:`, error);
                    }
                }
            }
            
            const finalInvoices = [...manualInvoices, ...generatedSubInvoices];

            // Update state with all invoices
            setInvoices(finalInvoices);
        };

        if (projects.length > 0 && paymentPlans.length > 0) {
            generateAndSaveSubscriptionInvoices();
        }
    }, [projects, paymentPlans]);


    // Load all data from Firebase APIs
    const loadData = async () => {
        if (!isLoggedIn || !localStorage.getItem('auth_token')) {
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            if (userRole === 'admin') {
                // Load all data from Firebase - no fallbacks
                const [clientsData, projectsData, usersData, invoicesData, departmentsData, groupsData, categoriesData, plansData, portfolioData] = await Promise.all([
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
                
                setClients(Array.isArray(clientsData) ? clientsData : []);
                setProjects(Array.isArray(projectsData) ? projectsData : []);
                setUsers(Array.isArray(usersData) ? usersData : []);
                setInvoices(Array.isArray(invoicesData) ? invoicesData : []);
                setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
                setGroups(Array.isArray(groupsData) ? groupsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setPaymentPlans(Array.isArray(plansData) ? plansData : []);
                setPortfolioCases(Array.isArray(portfolioData) ? portfolioData : []);
                
                console.log('🔥 Firebase Data Loaded:');
                console.log('  📊 Projects:', projectsData.length);
                console.log('  👥 Clients:', clientsData.length);
                console.log('  💳 Plans:', plansData.length);
                console.log('  📋 Invoices:', invoicesData.length);
                console.log('All data loaded from Firebase successfully');
            } else {
                // For regular users, load user-specific data
                const [userProjectsData, userInvoicesData] = await Promise.all([
                    projectAPI.getUserProjects(),
                    invoiceAPI.getUserInvoices()
                ]);
                
                setProjects(Array.isArray(userProjectsData) ? userProjectsData : []);
                setInvoices(Array.isArray(userInvoicesData) ? userInvoicesData : []);
            }
        } catch (err) {
            console.error('Failed to load data from Firebase:', err);
            if (err instanceof Error && err.message.includes('Not authenticated')) {
                logout();
                return;
            }
            setError(err instanceof Error ? err.message : 'Failed to load data from Firebase');
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
                setProjects(prevProjects => prevProjects.map(p => p.id === projectData.id ? updatedProject : p));
            } else {
                const newProject = await projectAPI.create(projectWithCurrency);
                setProjects(prevProjects => [newProject, ...prevProjects]);
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
            throw err;
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
            throw err;
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
                setClients(prevClients => prevClients.map(c => c.id === clientData.id ? updatedClient : c));
            } else {
                const newClient = await clientAPI.create(clientData);
                setClients(prevClients => [newClient, ...prevClients]);
            }
        } catch (err) {
            console.error('Failed to save client:', err);
            setError(err instanceof Error ? err.message : 'Failed to save client');
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
                throw refreshError;
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
                setUsers(prevUsers => prevUsers.map(u => u.id === userData.id ? updatedUser : u));
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
                    setUsers(prevUsers => [newUser, ...prevUsers]);
                }
            }
        } catch (err) {
            console.error('Failed to save user:', err);
            setError(err instanceof Error ? err.message : 'Failed to save user');
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
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
                setPortfolioCases(prevCases => prevCases.map(c => c.id === caseData.id ? updatedCase : c));
            } else {
                const newCase = await portfolioAPI.create(caseData);
                setPortfolioCases(prevCases => [newCase, ...prevCases]);
            }
        } catch (err) {
            console.error('Failed to save portfolio case:', err);
            setError(err instanceof Error ? err.message : 'Failed to save portfolio case');
            throw err;
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
            throw err;
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
            throw err;
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
            throw err;
        } finally {
            setLoading(false);
        }
    };


    // Load data immediately when user logs in
    useEffect(() => {
        if (isLoggedIn && localStorage.getItem('auth_token')) {
            loadData();
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
