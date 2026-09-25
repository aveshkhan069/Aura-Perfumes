export type FragranceGender = 'Men' | 'Women' | 'Unisex';
export type FragranceFamily = 'Woody' | 'Floral' | 'Oriental' | 'Fresh' | 'Citrus' | 'Gourmand' | 'Aromatic';

export interface FragranceNoteGroup {
  name: string;
  notes: string[];
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: FragranceGender;
  gender: FragranceGender;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  size: string; // e.g. "100ml"
  availableSizes: { size: string; price: number; originalPrice: number }[];
  rating: number;
  reviewCount: number;
  fragranceFamily: FragranceFamily;
  concentration: string; // e.g. "Eau de Parfum", "Eau de Toilette", "Extrait de Parfum"
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  description: string;
  shortDescription: string;
  longevity: string; // e.g. "8-10 Hours"
  sillage: string; // e.g. "Moderate to Strong"
  season: string; // e.g. "Autumn / Winter / Evening"
  occasion: string; // e.g. "Formal, Date Night, Special Events"
  ingredients: string;
  images: string[];
  primaryImage?: string;
  stock: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  unitPrice: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'upi' | 'cod';
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Delivery';
  orderStatus: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  grandTotal: number;
  estimatedDelivery: string;
  userId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  joinedDate: string;
}
