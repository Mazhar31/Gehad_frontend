export interface Group {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  company: string;
  email: string;
  mobile?: string;
  address?: string;
  avatarUrl: string;
  groupId?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  planId: string;
  departmentId: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  budget?: number;
  progress?: number;
  startDate: string;
  dashboardUrl?: string;
  currency: string;
  imageUrl?: string;
  projectType: 'Dashboard' | 'Add-ins';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'manual' | 'subscription';
  currency: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number | string;
  currency: string;
  features: string[];
  isPopular?: boolean;
  is_popular?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Fund {
    category: string;
    name: string;
    fundSize: string;
    returnPA: string;
    risk: string;
    riskColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  clientId: string;
  avatarUrl: string;
  role: 'superuser' | 'normal';
  password?: string;
  dashboardAccess?: 'view-only' | 'view-and-edit';
  projectIds?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface PortfolioCase {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

export interface Category {
  id: string;
  name: string;
}