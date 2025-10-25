// FIX: Created type definitions for Client, Project, Invoice, Category, PaymentPlan, and Fund to resolve type errors throughout the application.

export interface Client {
  id: string;
  company: string;
  email: string;
  mobile?: string;
  address?: string;
  avatarUrl: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  planId: string;
  categoryId: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  budget?: number;
  progress?: number;
  startDate: string;
  dashboardUrl?: string;
  currency: string;
  imageUrl?: string;
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

export interface Category {
  id:string;
  name: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  isPopular: boolean;
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
  dashboardAccess?: 'view-only' | 'view-and-edit';
  projectIds?: string[];
}