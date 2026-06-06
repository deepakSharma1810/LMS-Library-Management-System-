import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import TopLoader from "./components/TopLoader/TopLoader";

import BookPage from "./components/Books/BookPage";
import AuthorPage from "./components/Authors/AuthorPage";
import LoginPage from "./components/Login/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
import SingleBookPage from "./components/SingleBookPage/SingleBookPage";
import SingleAuthorPage from "./components/SingleAuthorPage/SingleAuthorPage";
import NotificationPage from "./components/NotificationPage/NotificationPage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import CartPage from "./components/CartPage/CartPage";
import OrderPage from "./components/OrderPage/OrderPage";
import ScrollOnTop from "./components/ScrollOnTop";
import WishlistPage from "./components/Wishlist/WishlistPage";
import BookReaderPage from "./components/BookReaderPage/BookReaderPage";

import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import EnterOtp from "./components/EnterOtp/EnterOtp";
import ConfirmPassword from "./components/ConfirmPassword/ConfirmPassword";
import SearchPage from "./components/SearchPage/SearchPage";

import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);

    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <TopLoader loading={pageLoading} />

      <ScrollOnTop />
      <Navbar />

      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 Not Found</h1>} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/read/:id"
          element={
            <ProtectedRoute>
              <BookReaderPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<MainPage />} />
        <Route path="/books" element={<BookPage />} />
        <Route path="/book/:id" element={<SingleBookPage />} />
        <Route path="/authors" element={<AuthorPage />} />
        <Route path="/author/:id" element={<SingleAuthorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/confirm-password" element={<ConfirmPassword />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
