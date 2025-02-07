import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import PageTransition from './components/common/PageTransition';
import { logout } from './features/auth/authSlice';
import { isTokenExpired } from './utils/tokenUtils';
import socketService from './services/socketService';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CreateEventPage = React.lazy(() => import('./pages/CreateEventPage'));
const EventDetailsPage = React.lazy(() => import('./pages/EventDetailsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const EditEventPage = React.lazy(() => import('./pages/EditEventPage'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [dispatch]);

  useEffect(() => {
    // Connect to socket when user is authenticated
    if (isAuthenticated) {
      const socket = socketService.connect();

      // Listen for global event updates
      socket.on('eventUpdate', (data) => {
        // Handle global event updates if needed
      });

      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/events/:id" element={<PageTransition><EventDetailsPage /></PageTransition>} />

            {/* Protected Routes */}
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <PageTransition><CreateEventPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><ProfilePage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageTransition><SettingsPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <ProtectedRoute>
                  <PageTransition><EditEventPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* Not Found Route */}
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />

            {/* New Route */}
            <Route 
              path="/users/:userId" 
              element={
                <PageTransition>
                  <UserProfilePage />
                </PageTransition>
              } 
            />
          </Routes>
        </Suspense>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
