
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { Toaster } from "@/components/ui/toaster"
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Home from './pages/Home';
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/AdminDashboard';
// import SellerDashboard from './pages/SellerDashboard';
// import NotFound from './pages/NotFound';
// import RequireAuth from './components/auth/RequireAuth';
// import RequireAdmin from './components/auth/RequireAdmin';
// import RequireSeller from './components/auth/RequireSeller';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Orders from './pages/Orders';
// import OrderDetail from './pages/OrderDetail';
// import Users from './pages/Users';
// import Categories from './pages/Categories';
// import CreateCategory from './pages/CreateCategory';
// import EditCategory from './pages/EditCategory';
// import ProductsAdmin from './pages/ProductsAdmin';
// import CreateProduct from './pages/CreateProduct';
// import EditProduct from './pages/EditProduct';
// import Sellers from './pages/Sellers';
// import SellerDetail from './pages/SellerDetail';
// import CreateSeller from './pages/CreateSeller';
// import EditSeller from './pages/EditSeller';
// import Customers from './pages/Customers';
// import CustomerDetail from './pages/CustomerDetail';
// import CreateCustomer from './pages/CreateCustomer';
// import EditCustomer from './pages/EditCustomer';
// import SellerProducts from './pages/SellerProducts';
// import SellerOrders from './pages/SellerOrders';
// import AnalyticsDashboard from './pages/AnalyticsDashboard';
// import Settings from './pages/Settings';
// import UnfinishedOrders from './pages/UnfinishedOrders';
// import { useAbandonedCartTracker } from '@/hooks/useAbandonedCartTracker';

// function App() {
//   // Initialize abandoned cart tracking
//   useAbandonedCartTracker();

//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/" element={<Home />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/products/:id" element={<ProductDetail />} />

//           {/* Authenticated routes */}
//           <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
//           <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
//           <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
//            <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
//           <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />

//           {/* Admin routes */}
//           <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
//           <Route path="/admin/users" element={<RequireAdmin><Users /></RequireAdmin>} />
//           <Route path="/admin/categories" element={<RequireAdmin><Categories /></RequireAdmin>} />
//           <Route path="/admin/categories/create" element={<RequireAdmin><CreateCategory /></RequireAdmin>} />
//           <Route path="/admin/categories/edit/:id" element={<RequireAdmin><EditCategory /></RequireAdmin>} />
//           <Route path="/admin/products" element={<RequireAdmin><ProductsAdmin /></RequireAdmin>} />
//           <Route path="/admin/products/create" element={<RequireAdmin><CreateProduct /></RequireAdmin>} />
//           <Route path="/admin/products/edit/:id" element={<RequireAdmin><EditProduct /></RequireAdmin>} />
//            <Route path="/admin/sellers" element={<RequireAdmin><Sellers /></RequireAdmin>} />
//           <Route path="/admin/sellers/:id" element={<RequireAdmin><SellerDetail /></RequireAdmin>} />
//           <Route path="/admin/sellers/create" element={<RequireAdmin><CreateSeller /></RequireAdmin>} />
//           <Route path="/admin/sellers/edit/:id" element={<RequireAdmin><EditSeller /></RequireAdmin>} />
//            <Route path="/admin/customers" element={<RequireAdmin><Customers /></RequireAdmin>} />
//           <Route path="/admin/customers/:id" element={<RequireAdmin><CustomerDetail /></RequireAdmin>} />
//           <Route path="/admin/customers/create" element={<RequireAdmin><CreateCustomer /></RequireAdmin>} />
//           <Route path="/admin/customers/edit/:id" element={<RequireAdmin><EditCustomer /></RequireAdmin>} />
//           <Route path="/admin/analytics" element={<RequireAdmin><AnalyticsDashboard /></RequireAdmin>} />
//           <Route path="/admin/settings" element={<RequireAdmin><Settings /></RequireAdmin>} />
//           <Route path="/admin/unfinished-orders" element={<RequireAdmin><UnfinishedOrders /></RequireAdmin>} />

//           {/* Seller routes */}
//           <Route path="/seller" element={<RequireSeller><SellerDashboard /></RequireSeller>} />
//           <Route path="/seller/products" element={<RequireSeller><SellerProducts /></RequireSeller>} />
//           <Route path="/seller/orders" element={<RequireSeller><SellerOrders /></RequireSeller>} />

//           {/* Not found route */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//       <Toaster />
//     </AuthProvider>
//   );
// }

// export default App;
