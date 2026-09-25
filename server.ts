import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { productsData, initialReviews } from './src/data/perfumes';
import { Product, Order, Review, User } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database store seeded with realistic data
let products: Product[] = [...productsData];
let reviews: Review[] = [...initialReviews];
let users: User[] = [
  {
    id: 'user-1',
    name: 'Avesh Khan',
    email: 'aveshkhan069@gmail.com',
    role: 'customer',
    joinedDate: 'January 2026',
    savedAddresses: [
      {
        fullName: 'Avesh Khan',
        phone: '+91 98765 43210',
        email: 'aveshkhan069@gmail.com',
        address: '42, Hill Road, Bandra West',
        apartment: 'Apt 4B, Sea View Towers',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400050',
        country: 'India'
      }
    ]
  },
  {
    id: 'admin-1',
    name: 'AURA Concierge Admin',
    email: 'admin@auraperfumes.com',
    role: 'admin',
    joinedDate: 'December 2025'
  }
];

let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AURA-89412',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    items: [
      {
        productId: 'aura-noir',
        productName: 'AURA Noir',
        brand: 'AURA',
        size: '100ml',
        price: 1999,
        quantity: 1,
        image: '/src/assets/images/products/aura-noir_1.jpg'
      },
      {
        productId: 'citrus-dream',
        productName: 'Citrus Dream',
        brand: 'AURA',
        size: '50ml',
        price: 1799,
        quantity: 1,
        image: '/src/assets/images/products/citrus-dream_1.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Avesh Khan',
      phone: '+91 98765 43210',
      email: 'aveshkhan069@gmail.com',
      address: '42, Hill Road, Bandra West',
      apartment: 'Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050',
      country: 'India'
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    subtotal: 3798,
    discount: 0,
    shippingFee: 0,
    tax: 0,
    grandTotal: 3798,
    estimatedDelivery: 'Delivered on March 22, 2026',
    userId: 'user-1'
  }
];

// ==========================
// REST API ROUTES
// ==========================

// 1. GET /api/products
app.get('/api/products', (req, res) => {
  const { category, brand, minPrice, maxPrice, search, sort, featured, bestseller, newArrival } = req.query;

  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (brand && brand !== 'All') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.fragranceFamily.toLowerCase().includes(q) ||
      p.topNotes.some(n => n.toLowerCase().includes(q)) ||
      p.heartNotes.some(n => n.toLowerCase().includes(q)) ||
      p.baseNotes.some(n => n.toLowerCase().includes(q))
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter(p => p.isFeatured);
  }

  if (bestseller === 'true') {
    filtered = filtered.filter(p => p.isBestseller);
  }

  if (newArrival === 'true') {
    filtered = filtered.filter(p => p.isNewArrival);
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  res.json({
    success: true,
    total: filtered.length,
    products: filtered
  });
});

// 2. GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Fragrance not found' });
  }

  // Get related products
  const related = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.fragranceFamily === product.fragranceFamily))
    .slice(0, 4);

  // Get reviews
  const productReviews = reviews.filter(r => r.productId === product.id);

  res.json({
    success: true,
    product,
    related,
    reviews: productReviews
  });
});

// 3. POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'customer',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    savedAddresses: []
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: `aura-token-${newUser.id}`,
    user: newUser
  });
});

// 4. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // For demo purposes, if user enters any valid email we can auto-login or return user
    if (email.includes('@')) {
      const demoUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: email.includes('admin') ? 'admin' : 'customer',
        joinedDate: 'March 2026',
        savedAddresses: []
      };
      users.push(demoUser);
      return res.json({
        success: true,
        message: 'Logged in successfully',
        token: `aura-token-${demoUser.id}`,
        user: demoUser
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    message: 'Welcome back to AURA Perfumes',
    token: `aura-token-${user.id}`,
    user
  });
});

// 5. GET /api/users/profile
app.get('/api/users/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('aura-token-', '');
  const user = users.find(u => u.id === userId) || users[0];

  res.json({ success: true, user });
});

// 6. POST /api/orders
app.post('/api/orders', (req, res) => {
  const { items, shippingAddress, paymentMethod, subtotal, discount, shippingFee, tax, grandTotal, userId } = req.body;

  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ success: false, message: 'Missing order details' });
  }

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `AURA-${randomNum}`,
    createdAt: new Date().toISOString(),
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid',
    orderStatus: 'Confirmed',
    subtotal,
    discount: discount || 0,
    shippingFee: shippingFee || 0,
    tax: tax || 0,
    grandTotal,
    estimatedDelivery: 'Estimated delivery: 3-5 business days',
    userId: userId || 'user-1'
  };

  orders.unshift(newOrder);

  // Update stock counts
  items.forEach((item: any) => {
    const prod = products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    order: newOrder
  });
});

// 7. GET /api/orders
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  let userOrders = orders;
  if (userId) {
    userOrders = orders.filter(o => o.userId === userId);
  }
  res.json({
    success: true,
    orders: userOrders
  });
});

// 8. POST /api/reviews
app.post('/api/reviews', (req, res) => {
  const { productId, userName, rating, title, comment } = req.body;
  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'All review fields are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    rating: Number(rating),
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    title: title || 'Verified Purchase Review',
    comment,
    verified: true
  };

  reviews.unshift(newReview);

  // Update product rating
  const prod = products.find(p => p.id === productId);
  if (prod) {
    const prodReviews = reviews.filter(r => r.productId === productId);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewCount = prodReviews.length;
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for your review',
    review: newReview
  });
});

// 9. POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
  }
  res.json({
    success: true,
    message: 'Thank you. Your concierge inquiry has been received. Our fragrance specialist will reply within 24 hours.'
  });
});

// 10. POST /api/newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }
  res.json({
    success: true,
    message: 'Welcome to the AURA Inner Circle. Check your inbox for your bespoke welcome gift.'
  });
});

// 11. Admin Routes
app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders: orders.slice(0, 5)
    }
  });
});

app.post('/api/admin/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `aura-${Date.now()}`,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
    images: req.body.images?.length ? req.body.images : [],
    rating: req.body.rating || 5.0,
    reviewCount: req.body.reviewCount || 1
  };
  products.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, product: products[index] });
});

app.delete('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

app.put('/api/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  order.orderStatus = orderStatus;
  res.json({ success: true, order });
});

// Vite Middleware for Full-Stack dev mode vs Static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[AURA Perfumes] Server running on port ${PORT}`);
  });
}

startServer();
