import React from "react";
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
// import SingleProductPage from "./components/SingleProductPage/SingleProductPage";

const App = () => {
  return (
    <div>
      <Router>
        <ScrollOnTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/book/:id" element={<SingleBookPage />} />
          <Route path="/authors" element={<AuthorPage />} />
          <Route path="/author/:id" element={<SingleAuthorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
