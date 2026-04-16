import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/Users/Users";
import Authors from "./components/Authors/Authors";
import Books from "./components/Books/Books";
import AddBooks from "./components/AddBooks/AddBooks";
import AddAuthor from "./components/AddAuthor/AddAuthor";
import AddUser from "./components/AddUser/AddUser";
import AdminSignup from "./components/AdminSignin/AdminSignin";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import EnterOtp from "./components/EnterOtp/EnterOtp";
import ConfirmPassword from "./components/ConfirmPassword/ConfirmPassword";
import AdminSettings from "./components/AdminSettings/AdminSettings";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import ScrollOnTop from "./components/ScrollOnTop";
import Category from "./components/Categorys/Category";
import AddCategory from "./components/AddCategory/AddCategory";

const App = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Router>
      <ScrollOnTop />
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main
        className={`${
          isOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 h-screen overflow-auto bg-gray-50`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add-book" element={<AddBooks />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/add-author" element={<AddAuthor />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/admin-signin" element={<AdminSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/enter-otp" element={<EnterOtp />} />
          <Route path="/confirm-password" element={<ConfirmPassword />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
