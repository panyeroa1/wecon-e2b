export type UserRole = 'buyer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'buyer' | 'vendor';
  address: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minOrderQty: number;
  leadTimeHours: number; // For SLA calculation
  image: string;
  description: string;
  isSponsored?: boolean; // New field for ad visibility
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  buyerName: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
  slaDeadline: string; // ISO String
  items: CartItem[];
  courierId?: string;
  trackingNumber?: string;
}

export interface VendorApplication {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  tin: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Courier {
  id: string;
  name: string;
  type: 'express' | 'standard' | 'economy';
  baseRate: number;
  estimatedDays: string;
  description: string;
  isVendorFleet?: boolean; // New field to identify own fleet
}

export interface ChartData {
  name: string;
  value: number;
}