import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import ScrollOnTop from "./components/ScrollOnTop";

import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/Users/Users";
import Authors from "./components/Authors/Authors";
import Books from "./components/Books/Books";
import AddBooks from "./components/AddBooks/AddBooks";
import AddAuthor from "./components/AddAuthor/AddAuthor";
import AddUser from "./components/AddUser/AddUser";
import Category from "./components/Categorys/Category";
import AddCategory from "./components/AddCategory/AddCategory";

import LoginForm from "./components/Login/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import EnterOtp from "./components/EnterOtp/EnterOtp";
import ConfirmPassword from "./components/ConfirmPassword/ConfirmPassword";
import AdminSettings from "./components/AdminSettings/AdminSettings";
import Profile from "./components/Profile/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { token } = useAuth();
  const location = useLocation();

  // Public/Auth pages
  const authPages = [
    "/admin-signin",
    "/admin-signup",
    "/forgot-password",
    "/enter-otp",
    "/confirm-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  // Sidebar + Navbar only on protected/admin pages
  const showAdminLayout = token && !isAuthPage;

  return (
    <Router>
      <ScrollOnTop />
      {/* ================= ADMIN SIDEBAR ================= */}
      {showAdminLayout && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}

      {/* ================= ADMIN NAVBAR ================= */}
      {showAdminLayout && <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />}

      <main
        className={`
          ${showAdminLayout ? (isOpen ? "ml-64" : "ml-20") : ""}
          transition-all
          duration-300
          min-h-screen
          overflow-auto
          bg-gray-50
        `}
      >
        <Routes>
          {/* Root URL → Admin Login */}
          <Route path="/" element={<Navigate to="/admin-signin" replace />} />

          {/* Admin Login */}
          <Route path="/admin-signin" element={<LoginForm />} />

          {/* Public Routes */}
          <Route path="/admin-signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/enter-otp" element={<EnterOtp />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-book"
            element={
              <ProtectedRoute>
                <AddBooks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/authors"
            element={
              <ProtectedRoute>
                <Authors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-author"
            element={
              <ProtectedRoute>
                <AddAuthor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-user"
            element={
              <ProtectedRoute>
                <AddUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-category"
            element={
              <ProtectedRoute>
                <AddCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
