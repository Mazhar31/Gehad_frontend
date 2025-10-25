import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Client, Category, PaymentPlan, Invoice, User } from '../types.ts';
import { 
    PROJECTS_DATA, 
    CLIENTS_DATA, 
    CATEGORIES_DATA, 
    PAYMENT_PLANS_DATA,
    INVOICES_DATA,
    USERS_DATA
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

const heroImageDataBase64 = `data:image/png;base64,${[
    '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',
].join('')}`;


interface DataContextType {
    projects: Project[];
    clients: Client[];
    categories: Category[];
    paymentPlans: PaymentPlan[];
    invoices: Invoice[];
    users: User[];
    heroImage: string | null;
    setHeroImage: (image: string | null) => void;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>(() => getInitialState('app_projects', PROJECTS_DATA));
    const [clients, setClients] = useState<Client[]>(() => getInitialState('app_clients', CLIENTS_DATA));
    const [categories, setCategories] = useState<Category[]>(() => getInitialState('app_categories', CATEGORIES_DATA));
    const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(() => getInitialState('app_payment_plans', PAYMENT_PLANS_DATA));
    const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialState('app_invoices', INVOICES_DATA));
    const [users, setUsers] = useState<User[]>(() => getInitialState('app_users', USERS_DATA));
    const [heroImage, setHeroImage] = useState<string | null>(() => getInitialState('app_heroImage', heroImageDataBase64));


    // Effects to save state to localStorage whenever it changes
    useEffect(() => { localStorage.setItem('app_projects', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { localStorage.setItem('app_clients', JSON.stringify(clients)); }, [clients]);
    useEffect(() => { localStorage.setItem('app_categories', JSON.stringify(categories)); }, [categories]);
    useEffect(() => { localStorage.setItem('app_payment_plans', JSON.stringify(paymentPlans)); }, [paymentPlans]);
    useEffect(() => { localStorage.setItem('app_invoices', JSON.stringify(invoices)); }, [invoices]);
    useEffect(() => { localStorage.setItem('app_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('app_heroImage', JSON.stringify(heroImage)); }, [heroImage]);


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
            setUsers(users.map(u => u.id === userData.id ? userData : u));
        } else {
            const newUser = { 
                ...userData, 
                id: `u-${Date.now()}`, 
                avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
                dashboardAccess: userData.dashboardAccess || 'view-only',
                projectIds: userData.projectIds || [],
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


    const value = {
        projects,
        clients,
        categories,
        paymentPlans,
        invoices,
        users,
        heroImage,
        setHeroImage,
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