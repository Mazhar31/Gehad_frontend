import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Client, Category, PaymentPlan, Invoice, User, ContactMessage } from '../types.ts';
import { 
    PROJECTS_DATA, 
    CLIENTS_DATA, 
    CATEGORIES_DATA, 
    PAYMENT_PLANS_DATA,
    INVOICES_DATA,
    USERS_DATA,
    CONTACT_MESSAGES_DATA
} from '../constants.ts';

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

interface DataContextType {
    projects: Project[];
    clients: Client[];
    categories: Category[];
    paymentPlans: PaymentPlan[];
    invoices: Invoice[];
    users: User[];
    contactMessages: ContactMessage[];
    handleSaveProject: (project: Project) => void;
    handleDeleteProject: (projectId: string) => void;
    handleSaveClient: (client: Client) => void;
    handleDeleteClient: (clientId: string) => void;
    handleSaveCategory: (category: Category) => void;
    handleDeleteCategory: (categoryId: string) => void;
    handleSavePlan: (plan: PaymentPlan) => void;
    handleDeletePlan: (planId: string) => void;
    handleSaveUser: (user: User) => void;
    handleDeleteUser: (userId: string) => void;
    handleSaveInvoice: (invoice: Invoice) => void;
    handleDeleteInvoice: (invoiceId: string) => void;
    handleSaveContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt'>) => void;
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
    const [categories, setCategories] = useState<Category[]>(() => getInitialState('app_categories', CATEGORIES_DATA));
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(() => getInitialState('app_payment_plans', PAYMENT_PLANS_DATA));
    const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialState('app_invoices', INVOICES_DATA));
    const [users, setUsers] = useState<User[]>(() => getInitialState('app_users', USERS_DATA));
    const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => getInitialState('app_contact_messages', CONTACT_MESSAGES_DATA));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getInitialState('app_isLoggedIn', false));
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(() => getInitialState('app_userRole', null));
    const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState('app_currentUser', null));

    // Effects to save state to localStorage whenever it changes
    useEffect(() => { localStorage.setItem('app_projects', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('app_clients', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('app_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('app_payment_plans', JSON.stringify(paymentPlans)); }, [paymentPlans]);
    useEffect(() => { localStorage.setItem('app_invoices', JSON.stringify(invoices)); }, [invoices]);
    useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('app_contact_messages', JSON.stringify(contactMessages)); }, [contactMessages]);
    useEffect(() => { localStorage.setItem('app_isLoggedIn', JSON.stringify(isLoggedIn)); }, [isLoggedIn]);
    useEffect(() => { localStorage.setItem('app_userRole', JSON.stringify(userRole)); }, [userRole]);
    useEffect(() => { localStorage.setItem('app_currentUser', JSON.stringify(currentUser)); }, [currentUser]);

    // Auto-generate and reconcile subscription invoices whenever projects or plans change
    useEffect(() => {
        setInvoices(prevInvoices => {
            const manualInvoices = prevInvoices.filter(i => i.type === 'manual');
            const generatedSubInvoices: Invoice[] = [];
            const today = new Date();

            const activeProjects = projects.filter(p => p.planId && p.startDate && p.status === 'Completed');

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


    // Project Handlers
    const handleSaveProject = (projectData: Project) => {
        const plan = paymentPlans.find(p => p.id === projectData.planId);
        const currency = plan ? plan.currency : 'USD'; // Default currency
        const projectWithCurrency = { ...projectData, currency };

        if (projectData.id && projects.some(p => p.id === projectData.id)) {
            setProjects(projects.map(p => p.id === projectData.id ? projectWithCurrency : p));
        } else {
            const newProject = { ...projectWithCurrency, id: `p-${Date.now()}` };
            setProjects([newProject, ...projects]);
        }
    };

    const handleDeleteProject = (projectId: string) => {
        setProjects(projects.filter(p => p.id !== projectId));
    };

    // Client Handlers
    const handleSaveClient = (clientData: Client) => {
        if (clientData.id && clients.some(c => c.id === clientData.id)) {
            setClients(clients.map(c => c.id === clientData.id ? clientData : c));
        } else {
            // Ensure new clients get a unique avatar if none is provided
            const newAvatar = clientData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`;
            const newClient = { ...clientData, id: `c-${Date.now()}`, avatarUrl: newAvatar };
            setClients([newClient, ...clients]);
        }
    };

    const handleDeleteClient = (clientId: string) => {
        setClients(clients.filter(c => c.id !== clientId));
    };
    
    // Category Handlers
    const handleSaveCategory = (categoryData: Category) => {
        if (categoryData.id && categories.some(c => c.id === categoryData.id)) {
            setCategories(categories.map(c => c.id === categoryData.id ? categoryData : c));
        } else {
            const newCategory = { ...categoryData, id: `cat-${Date.now()}` };
            setCategories([newCategory, ...categories]);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategories(categories.filter(c => c.id !== categoryId));
    };

    // Payment Plan Handlers
    const handleSavePlan = (planData: PaymentPlan) => {
        if (planData.id && paymentPlans.some(p => p.id === planData.id)) {
            setPaymentPlans(paymentPlans.map(p => p.id === planData.id ? planData : p));
        } else {
            const newPlan = { ...planData, id: `plan-${Date.now()}` };
            setPaymentPlans([newPlan, ...paymentPlans]);
        }
    };

    const handleDeletePlan = (planId: string) => {
        setPaymentPlans(paymentPlans.filter(p => p.id !== planId));
    };
    
    // User Handlers
    const handleSaveUser = (userData: User) => {
        if (userData.id && users.some(u => u.id === userData.id)) {
            setUsers(users.map(u => {
                if (u.id === userData.id) {
                    // If the provided password is empty or null, keep the existing one.
                    const newPassword = (userData.password && userData.password.trim() !== '') ? userData.password : u.password;
                    return { ...u, ...userData, password: newPassword };
                }
                return u;
            }));
        } else {
            const newUser = { 
                ...userData, 
                id: `u-${Date.now()}`, 
                avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
                dashboardAccess: userData.dashboardAccess || 'view-only',
                projectIds: userData.projectIds || [],
                // Set a default password if none is provided for a new user.
                password: userData.password || 'password'
            };
            setUsers([newUser, ...users]);
        }
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
    };

    // Invoice Handlers
    const handleSaveInvoice = (invoiceData: Invoice) => {
        if (invoiceData.id && invoices.some(i => i.id === invoiceData.id)) {
            setInvoices(invoices.map(i => i.id === invoiceData.id ? invoiceData : i));
        } else {
            const newInvoice = { ...invoiceData, id: `inv-${Date.now()}` };
            setInvoices([newInvoice, ...invoices]);
        }
    };

    const handleDeleteInvoice = (invoiceId: string) => {
        setInvoices(invoices.filter(i => i.id !== invoiceId));
    };

    // Contact Message Handler
    const handleSaveContactMessage = (messageData: Omit<ContactMessage, 'id' | 'createdAt'>) => {
        const newMessage: ContactMessage = {
            ...messageData,
            id: `msg-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        setContactMessages(prev => [newMessage, ...prev]);
        // The following console logs simulate the backend operations as requested.
        console.log('Message stored locally (simulating Google Cloud storage):', newMessage);
    };

    // Auth Handlers
    const login = (role: 'admin' | 'user', userEmail?: string) => {
        setIsLoggedIn(true);
        setUserRole(role);
        if (role === 'user' && userEmail) {
            const userToLogin = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());
            setCurrentUser(userToLogin || null);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentUser(null);
    };


    const value = {
        projects,
        clients,
        categories,
        paymentPlans,
        invoices,
        users,
        contactMessages,
        handleSaveProject,
        handleDeleteProject,
        handleSaveClient,
        handleDeleteClient,
        handleSaveCategory,
        handleDeleteCategory,
        handleSavePlan,
        handleDeletePlan,
        handleSaveUser,
        handleDeleteUser,
        handleSaveInvoice,
        handleDeleteInvoice,
        handleSaveContactMessage,
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