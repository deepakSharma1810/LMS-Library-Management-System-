import React from "react";
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./components/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookPage from "./components/Books/BookPage";
import AuthorPage from "./components/Authors/AuthorPage";
import LoginPage from "./components/Login/LoginPage";
import SignUpPage from "./components/SignUpPage/SignUpPage";
// import SingleProductPage from "./components/SingleProductPage/SingleProductPage";

const App = () => {
  return (
    <div>
      <Router>
        {/* <SingleProductPage /> */}
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/books" element={<BookPage />} />
          <Route path="/authors" element={<AuthorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
