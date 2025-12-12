import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import CreatorApprovals from "./pages/CreatorApprovals";
import Reports from "./pages/Reports";
import Announcements from "./pages/Announcements";
import Subscriptions from "./pages/Subscriptions";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Simple conditional rendering - no complex routing
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/creator-approvals" element={<CreatorApprovals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/announcement" element={<Announcements />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
