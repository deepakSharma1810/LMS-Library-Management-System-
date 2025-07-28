import React, { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { MdOutlineLibraryBooks, MdDashboard } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const navItems = [
    { name: "Dashboard", icon: <MdDashboard size={20} />, path: "/" },
    { name: "Users", icon: <FiUsers size={20} />, path: "/users" },
    { name: "Authors", icon: <FaUserEdit size={20} />, path: "/authors" },
    {
      name: "Books",
      icon: <MdOutlineLibraryBooks size={20} />,
      path: "/books",
    },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } min-h-screen bg-white border-r shadow-md transition-all duration-300 ease-in-out flex flex-col relative`}
    >
      {/* Logo Area (fixed position and size) */}
      <div
        className="flex items-center justify-between px-4 py-5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-[#6C63FF] text-white p-[10px] rounded-xl text-xl">
            📊
          </div>
          {isOpen && (
            <h1 className="text-xl font-bold text-[#6C63FF] tracking-wide">
              Admin
            </h1>
          )}
        </div>

        {/* Close Icon (only when open) */}
        {isOpen && (
          <button className="text-gray-600 hover:text-[#6C63FF]">
            <IoClose size={20} />
          </button>
        )}
      </div>

      {/* Menu Label */}
      {isOpen && (
        <div className="text-gray-400 text-xs font-bold px-6 mb-2 tracking-wider uppercase">
          Menu
        </div>
      )}

      {/* Navigation */}
      <div className="flex flex-col gap-1 px-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 p-3 mx-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              active === item.name
                ? "bg-[#6C63FF] text-white"
                : "text-gray-700 hover:bg-[#e8e6ff] hover:text-[#6C63FF]"
            } ${!isOpen ? "justify-center" : ""}`}
          >
            {item.icon}
            {isOpen && item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
