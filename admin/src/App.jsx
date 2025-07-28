import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./components/Users/Users";
import Authors from "./components/Authors/Authors";
import Books from "./components/Books/Books";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
