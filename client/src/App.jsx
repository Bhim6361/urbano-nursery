import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import ServicesPage from './pages/ServicesPage';
import GardenersPage from './pages/GardenersPage';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import MyComplaints from './pages/MyComplaints';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NurseryDashboard from './pages/NurseryDashboard';
import GardenerDashboard from './pages/GardenerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const NotFound = () => (
  <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', color: 'var(--primary-900)', marginBottom: '1rem' }}>404</h1>
    <h2 style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>Botanical Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
      The garden path you are following seems to be overgrown or relocated.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Nursery Home
    </Link>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gardeners" element={<GardenersPage />} />
          <Route path="/book-service" element={<BookService />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor/nursery" element={<NurseryDashboard />} />
          <Route path="/vendor/gardener" element={<GardenerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
