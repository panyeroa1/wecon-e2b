import { Product, Order, VendorApplication, User, Courier } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Juan Dela Cruz', email: 'juan@sme.ph', role: 'buyer', orgId: 'o1' },
  { id: 'u2', name: 'Maria Santos', email: 'maria@supplyco.ph', role: 'vendor', orgId: 'o2' },
  { id: 'u3', name: 'Admin Staff', email: 'admin@wecon.ph', role: 'admin' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    vendorId: 'o2',
    vendorName: 'Manila Office Depot',
    name: 'A4 Copy Paper (500 sheets)',
    category: 'Office Supplies',
    price: 250,
    stock: 1000,
    minOrderQty: 5,
    leadTimeHours: 24,
    image: 'https://picsum.photos/400/300?random=1',
    description: 'High quality 70gsm multipurpose paper.',
  },
  {
    id: 'p2',
    vendorId: 'o2',
    vendorName: 'Manila Office Depot',
    name: 'Ergonomic Mesh Chair',
    category: 'Furniture',
    price: 4500,
    stock: 50,
    minOrderQty: 1,
    leadTimeHours: 48,
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Breathable mesh back with lumbar support.',
    isSponsored: true, // Marked as sponsored
  },
  {
    id: 'p3',
    vendorId: 'o3',
    vendorName: 'BuildRight Construction',
    name: 'Portland Cement (40kg)',
    category: 'Construction',
    price: 230,
    stock: 5000,
    minOrderQty: 50,
    leadTimeHours: 24,
    image: 'https://picsum.photos/400/300?random=3',
    description: 'General purpose cement for structural applications.',
  },
  {
    id: 'p4',
    vendorId: 'o4',
    vendorName: 'Fresh Farms Direct',
    name: 'Jasmine Rice (25kg)',
    category: 'Food Supplies',
    price: 1250,
    stock: 200,
    minOrderQty: 2,
    leadTimeHours: 12,
    image: 'https://picsum.photos/400/300?random=4',
    description: 'Premium grade Jasmine rice, fresh harvest.',
  },
];

export const MOCK_COURIERS: Courier[] = [
  {
    id: 'vendor-fleet',
    name: 'Supplier Own Fleet',
    type: 'express',
    baseRate: 0,
    estimatedDays: '1 day',
    description: 'Direct delivery from supplier.',
    isVendorFleet: true,
  },
  {
    id: 'wecon-express',
    name: 'WeConnect Express',
    type: 'express',
    baseRate: 500,
    estimatedDays: '1 day',
    description: 'Guaranteed 24h Delivery SLA',
  },
  {
    id: 'lbc',
    name: 'LBC Express',
    type: 'standard',
    baseRate: 250,
    estimatedDays: '2-3 days',
    description: 'Nationwide trusted courier',
  },
  {
    id: 'jnt',
    name: 'J&T Express',
    type: 'standard',
    baseRate: 180,
    estimatedDays: '2-4 days',
    description: 'Fast ecommerce logistics',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    buyerName: 'TechStart Inc.',
    totalAmount: 5000,
    status: 'pending',
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
    slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    items: [
       { ...MOCK_PRODUCTS[0], quantity: 20 },
    ],
    courierId: 'wecon-express'
  },
  {
    id: 'ord-1002',
    buyerName: 'Cafe Manila',
    totalAmount: 12500,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    items: [
       { ...MOCK_PRODUCTS[3], quantity: 10 },
    ],
    courierId: 'lbc',
    trackingNumber: '1452-9981-LBC'
  },
  {
    id: 'ord-1003',
    buyerName: 'TechStart Inc.',
    totalAmount: 23000,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
       { ...MOCK_PRODUCTS[2], quantity: 100 },
    ],
    courierId: 'jnt',
    trackingNumber: 'PH0998123881'
  },
];

export const MOCK_APPLICATIONS: VendorApplication[] = [
  {
    id: 'va-1',
    orgName: 'Steel Pro Industries',
    contactPerson: 'Ricardo Dalisay',
    email: 'rdalisay@steelpro.ph',
    tin: '123-456-789-000',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  },
];