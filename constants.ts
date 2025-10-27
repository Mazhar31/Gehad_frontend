// FIX: Created mock data for clients, projects, invoices, categories, and payment plans to resolve import errors and populate the application with data.
import { Client, Project, Invoice, Category, PaymentPlan, User, ContactMessage, PortfolioCase, Department, Group } from './types.ts';

export const GROUPS_DATA: Group[] = [
    { id: 'g-1', name: 'Global Tech' },
    { id: 'g-2', name: 'FinServ Associates' },
    { id: 'g-3', name: 'Creative Collective' },
];

export const CLIENTS_DATA: Client[] = [
  { id: 'c-1', company: 'Innovate Inc.', email: 'john.doe@innovate.com', mobile: '555-0101', address: '123 Innovation Dr, Techville, TX', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', groupId: 'g-1' },
  { id: 'c-2', company: 'Solutions Co.', email: 'jane.smith@solutions.co', mobile: '555-0102', address: '456 Market St, San Francisco, CA', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', groupId: 'g-2' },
  // FIX: Removed duplicate `avatarUrl` property.
  { id: 'c-3', company: 'Tech Giants', email: 'peter.jones@techgiants.com', mobile: '555-0103', address: '789 Enterprise Way, New York, NY', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', groupId: 'g-1' },
  { id: 'c-4', company: 'Web Wizards', email: 'mary.j@webwizards.io', mobile: '555-0104', address: '101 Dev Lane, Austin, TX', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

export const CATEGORIES_DATA: Category[] = [
    { id: 'cat-1', name: 'Web Development' },
    { id: 'cat-2', name: 'Mobile App Development' },
    { id: 'cat-3', name: 'UI/UX Design' },
    { id: 'cat-4', name: 'Marketing' },
];

export const DEPARTMENTS_DATA: Department[] = [
    { id: 'dept-1', name: 'Engineering' },
    { id: 'dept-2', name: 'Product' },
    { id: 'dept-3', name: 'Design' },
    { id: 'dept-4', name: 'Marketing & Sales' },
];

export const PAYMENT_PLANS_DATA: PaymentPlan[] = [
    { id: 'plan-1', name: 'Basic', price: 299, currency: 'USD', features: ['Up to 5 projects', 'Basic support', '2 collaborators'], isPopular: false },
    { id: 'plan-2', name: 'Pro', price: 999, currency: 'USD', features: ['Unlimited projects', 'Priority support', '10 collaborators', 'Advanced analytics'], isPopular: true },
    { id: 'plan-3', name: 'Enterprise', price: 2999, currency: 'USD', features: ['Unlimited everything', 'Dedicated support', 'Custom integrations'], isPopular: false },
];

export const PROJECTS_DATA: Project[] = [
  { id: 'p-1', name: 'E-commerce Platform', clientId: 'c-1', planId: 'plan-2', categoryId: 'cat-1', departmentId: 'dept-1', status: 'In Progress', budget: 50000, progress: 75, startDate: '2024-05-01', dashboardUrl: 'https://vercel.com/', currency: 'USD' },
  { id: 'p-2', name: 'Mobile Banking App', clientId: 'c-2', planId: 'plan-3', categoryId: 'cat-2', departmentId: 'dept-1', status: 'Completed', budget: 120000, progress: 100, startDate: '2023-11-15', dashboardUrl: 'https://example-dashboard.com/p2', currency: 'USD' },
  { id: 'p-3', name: 'Marketing Campaign', clientId: 'c-3', planId: 'plan-1', categoryId: 'cat-4', departmentId: 'dept-4', status: 'On Hold', budget: 15000, progress: 20, startDate: '2024-06-10', currency: 'USD' },
  { id: 'p-4', name: 'Design System', clientId: 'c-4', planId: 'plan-2', categoryId: 'cat-3', departmentId: 'dept-3', status: 'In Progress', budget: 80000, progress: 50, startDate: '2023-10-01', dashboardUrl: 'https://example-dashboard.com/p4', currency: 'USD' },
  { id: 'p-5', name: 'Internal Dashboard', clientId: 'c-1', planId: 'plan-2', categoryId: 'cat-1', departmentId: 'dept-2', status: 'Completed', budget: 35000, progress: 100, startDate: '2024-02-01', currency: 'USD' },
];

export const INVOICES_DATA: Invoice[] = [
  { 
    id: 'inv-1', invoiceNumber: 'INV-001', clientId: 'c-1', issueDate: '2024-06-15', dueDate: '2024-07-15', 
    items: [{ description: 'Initial Project Setup', quantity: 1, price: 12000 }], 
    status: 'Paid', type: 'manual', currency: 'USD'
  },
  { 
    id: 'inv-2', invoiceNumber: 'INV-002', clientId: 'c-2', issueDate: '2024-05-30', dueDate: '2024-06-30', 
    items: [{ description: 'Phase 1 Development', quantity: 1, price: 25000 }], 
    status: 'Pending', type: 'manual', currency: 'USD'
  },
  { 
    id: 'inv-3', invoiceNumber: 'INV-003', clientId: 'c-3', issueDate: '2024-05-01', dueDate: '2024-06-01', 
    items: [{ description: 'Social Media Assets', quantity: 1, price: 5000 }], 
    status: 'Overdue', type: 'manual', currency: 'USD'
  },
];

export const USERS_DATA: User[] = [
  { id: 'u-1', name: 'Alice Martin', email: 'alice.m@innovate.com', position: 'Project Manager', clientId: 'c-1', avatarUrl: 'https://i.pravatar.cc/150?u=u1', role: 'superuser', password: 'password', dashboardAccess: 'view-and-edit', projectIds: ['p-1', 'p-5'] },
  { id: 'u-2', name: 'Bob Johnson', email: 'bob.j@solutions.co', position: 'Lead Developer', clientId: 'c-2', avatarUrl: 'https://i.pravatar.cc/150?u=u2', role: 'normal', password: 'password', dashboardAccess: 'view-only', projectIds: ['p-2'] },
  { id: 'u-3', name: 'Charlie Brown', email: 'charlie.b@techgiants.com', position: 'UX Designer', clientId: 'c-3', avatarUrl: 'https://i.pravatar.cc/150?u=u3', role: 'normal', password: 'password', dashboardAccess: 'view-only', projectIds: ['p-3'] },
  { id: 'u-4', name: 'Diana Prince', email: 'diana.p@webwizards.io', position: 'QA Engineer', clientId: 'c-4', avatarUrl: 'https://i.pravatar.cc/150?u=u4', role: 'normal', password: 'password', dashboardAccess: 'view-only', projectIds: ['p-4'] },
];

export const PORTFOLIO_CASES_DATA: PortfolioCase[] = [
  {
    id: 'pc-1',
    category: 'E-commerce',
    title: 'Innovate Inc. Marketplace',
    description: 'A complete overhaul of a legacy e-commerce platform, boosting performance by 200% and increasing user engagement through a modern UI/UX design.',
    imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=800&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 'pc-2',
    category: 'Mobile App',
    title: 'Solutions Co. Banking App',
    description: 'Developed a secure and intuitive mobile banking application for iOS and Android, featuring biometric login and real-time transaction tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=800&auto=format&fit=crop',
    link: '#'
  },
  {
    id: 'pc-3',
    category: 'SaaS Platform',
    title: 'CloudFlow CRM',
    description: 'Built a scalable CRM platform from the ground up, enabling businesses to manage customer relationships with advanced analytics and automation tools.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=800&auto=format&fit=crop',
    link: '#'
  }
];

export const CONTACT_MESSAGES_DATA: ContactMessage[] = [];