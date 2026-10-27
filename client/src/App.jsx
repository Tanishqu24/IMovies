import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ManagerLayout from './layouts/ManagerLayout';

// Common
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import MoviesPage from './pages/customer/MoviesPage';
import MovieDetailsPage from './pages/customer/MovieDetailsPage';
import TheatresPage from './pages/customer/TheatresPage';
import SeatSelectionPage from './pages/customer/SeatSelectionPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import BookingSuccessPage from './pages/customer/BookingSuccessPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import ProfilePage from './pages/customer/ProfilePage';
import AboutPage from './pages/customer/AboutPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminTheatresPage from './pages/admin/AdminTheatresPage';
import AdminScreensPage from './pages/admin/AdminScreensPage';
import AdminShowsPage from './pages/admin/AdminShowsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';

// Manager Pages
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage';
import ManagerTheatresPage from './pages/manager/ManagerTheatresPage';
import ManagerScreensPage from './pages/manager/ManagerScreensPage';
import ManagerShowsPage from './pages/manager/ManagerShowsPage';
import ManagerBookingsPage from './pages/manager/ManagerBookingsPage';
import ManagerRevenuePage from './pages/manager/ManagerRevenuePage';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#171D33',
            color: '#F8FAFC',
            border: '1px solid #27324A',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#171D33',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#171D33',
            },
          },
        }}
      />

      <Routes>
        {/* Customer Public & Authenticated Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailsPage />} />
          <Route path="theatres" element={<TheatresPage />} />
          <Route path="seat-selection/:showId" element={<SeatSelectionPage />} />
          <Route
            path="checkout/:showId"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="booking-success/:id"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <BookingSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Super Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="movies" element={<AdminMoviesPage />} />
          <Route path="theatres" element={<AdminTheatresPage />} />
          <Route path="screens" element={<AdminScreensPage />} />
          <Route path="shows" element={<AdminShowsPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
        </Route>

        {/* Theatre Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboardPage />} />
          <Route path="theatres" element={<ManagerTheatresPage />} />
          <Route path="screens" element={<ManagerScreensPage />} />
          <Route path="shows" element={<ManagerShowsPage />} />
          <Route path="bookings" element={<ManagerBookingsPage />} />
          <Route path="revenue" element={<ManagerRevenuePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;

