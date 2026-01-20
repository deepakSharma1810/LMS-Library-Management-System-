import React, { useState } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = ({ isOpen, setIsOpen }) => {
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header
      className={`h-20 bg-[#0e1a1c] border-b border-[#2c4449]
      flex items-center justify-between px-6 fixed top-0 right-0 z-30
      transition-all duration-300
      ${isOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-20 w-[calc(100%-5rem)]"}`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#dbf8fa]">Dashboard</h1>
      </div>

      {/* CENTER – SEARCH */}
      <div className="hidden md:flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-1.5 w-80">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-white ml-2 w-full"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative">
        {/* Notification */}
        <button className="relative text-gray-300 hover:text-amber-300">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 bg-amber-300 text-black text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <div
            // onClick={() => setOpenProfile(!openProfile)}
            onMouseEnter={() => setOpenProfile(true)}
            onMouseLeave={() => setOpenProfile(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-amber-300 relative cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-amber-300 text-black flex items-center justify-center font-bold">
              DS
            </div>
            {/* DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 mt-36 w-44 bg-[#1b2e31] border border-[#2c4449] rounded-lg shadow-lg overflow-hidden z-50">
                <Link to="/profile">
                  <button className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#122125]">
                    Profile
                  </button>
                </Link>
                <Link to="/settings">
                  <button className="w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#122125]">
                    Settings
                  </button>
                </Link>
                <button className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:bg-[#122125]">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
