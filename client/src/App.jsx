import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import EnterOtp from "./components/EnterOtp/EnterOtp";
import ConfirmPassword from "./components/ConfirmPassword/ConfirmPassword";

const App = () => {
  return (
    <div>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
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
            </Routes>

            <Footer />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
