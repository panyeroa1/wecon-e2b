import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, VendorApplication, User } from '../types';

// Collection references
const productsRef = collection(db, 'products');
const ordersRef = collection(db, 'orders');
const usersRef = collection(db, 'users');
const applicationsRef = collection(db, 'vendor_applications');

// Products
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const getProductsByVendor = async (vendorId: string): Promise<Product[]> => {
  const q = query(productsRef, where('vendorId', '==', vendorId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateProduct = async (id: string, data: Partial<Product>): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  const q = query(ordersRef, where('buyerId', '==', buyerId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const getOrdersByVendor = async (vendorId: string): Promise<Order[]> => {
  const q = query(ordersRef, where('vendorId', '==', vendorId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  const docRef = doc(db, 'orders', id);
  await updateDoc(docRef, { status, updatedAt: Timestamp.now() });
};

// Vendor Applications
export const getVendorApplications = async (): Promise<VendorApplication[]> => {
  const snapshot = await getDocs(applicationsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VendorApplication));
};

export const submitVendorApplication = async (application: Omit<VendorApplication, 'id' | 'status' | 'submittedAt'>): Promise<string> => {
  const docRef = await addDoc(applicationsRef, {
    ...application,
    status: 'pending',
    submittedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateApplicationStatus = async (id: string, status: VendorApplication['status']): Promise<void> => {
  const docRef = doc(db, 'vendor_applications', id);
  await updateDoc(docRef, { status, reviewedAt: Timestamp.now() });
};

// Users
export const getUserById = async (id: string): Promise<User | null> => {
  const docRef = doc(db, 'users', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as User;
  }
  return null;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<string> => {
  const docRef = await addDoc(usersRef, {
    ...user,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};
