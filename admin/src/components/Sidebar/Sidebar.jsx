import React, { useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineLibraryBooks, MdDashboard } from "react-icons/md";
import { FaBook, FaUserEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { BiSolidCategory } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [active, setActive] = useState("Dashboard");
  const navItems = [
    { name: "Dashboard", icon: <MdDashboard size={20} />, path: "/" },
    {
      name: "Books",
      icon: <MdOutlineLibraryBooks size={20} />,
      path: "/books",
    },
    { name: "Authors", icon: <FaUserEdit size={20} />, path: "/authors" },
    { name: "Users", icon: <FaUserGroup size={20} />, path: "/users" },
    {
      name: "Categories",
      icon: <BiSolidCategory size={20} />,
      path: "/categories",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0e1a1c] text-white border-r border-[#123033]
      transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-5 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-3.5 text-lg bg-amber-300 text-black rounded-lg">
            <FaBook />
          </div>
          {isOpen && <h1 className="text-xl font-bold">Admin</h1>}
        </div>

        {isOpen && (
          <button>
            <IoClose className="hover:text-amber-300" size={20} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="text-gray-400 text-xs font-bold px-4 mb-2 tracking-wider uppercase">
          Menu
        </div>
      )}

      {/* Menu items */}
      <nav className="mt-3 flex flex-col gap-1">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            onClick={() => setActive(item.name)}
            className={({ isActive, isPending }) =>
              isPending
                ? "pending"
                : isActive
                  ? "flex items-center gap-3 p-3 mx-4 rounded-lg bg-amber-400 text-[#0e1a1c]"
                  : "flex items-center gap-3 p-3 mx-4 rounded-lg text-gray-200 hover:bg-[#163a39] hover:text-amber-200"
            }
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4">
        {isOpen ? (
          <>
            <p className="text-sm text-gray-300">Signed in as</p>
            <p className="font-semibold">Deepak Sharma</p>
          </>
        ) : (
          <p className="text-center text-lg">DS</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
