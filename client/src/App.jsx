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

const App = () => {
  // const [notificationCount, setNotificationCount] = useState(0);

  // // FETCH INITIAL COUNT
  // const fetchUnreadCount = async () => {
  //   try {
  //     const res = await fetch(
  //       "http://localhost:5000/notifications/unread-count",
  //     );

  //     const data = await res.json();

  //     setNotificationCount(data.unread);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUnreadCount();

  //   // SOCKET LISTENER
  //   socket.on("new-notification", (data) => {
  //     console.log("Realtime notification:", data);

  //     setNotificationCount((prev) => prev + 1);
  //   });

  //   return () => {
  //     socket.off("new-notification");
  //   };
  // }, []);

  return (
    <div>
      <NotificationProvider>
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
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/read/:id" element={<BookReaderPage />} />
          </Routes>

          <Footer />
        </Router>
      </NotificationProvider>
    </div>
  );
};

export default App;
