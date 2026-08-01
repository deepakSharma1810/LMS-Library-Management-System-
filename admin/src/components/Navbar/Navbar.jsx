import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ isOpen }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  const [openProfile, setOpenProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const initials =
    `${user?.fName?.[0] || ""}${user?.lName?.[0] || ""}`.toUpperCase();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin-signin", { replace: true });
  };

  return (
    <header
      className={`h-20 bg-[#0e1a1c] border-b border-[#2c4449]
      flex items-center justify-between px-6 fixed top-0 right-0 z-30
      transition-all duration-300
      ${isOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-20 w-[calc(100%-5rem)]"}`}
    >
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-bold text-[#dbf8fa]">Dashboard</h1>
      </div>

      {/* SEARCH */}
      <div className="hidden md:flex items-center bg-[#122125] border border-[#2c4449] rounded-lg px-3 py-2 w-80">
        <FiSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder:text-gray-500"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-amber-300 text-black flex items-center justify-center font-bold">
              {initials || <FiUser />}
            </div>

            <div className="hidden md:block text-left">
              <h3 className="text-sm font-semibold text-[#dbf8fa]">
                {user?.fName} {user?.lName}
              </h3>

              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 bg-[#162428] border border-[#2c4449] rounded-xl shadow-xl overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[#2c4449]">
                <h3 className="text-sm font-semibold text-[#dbf8fa]">
                  {user?.fName} {user?.lName}
                </h3>

                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={() => setOpenProfile(false)}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#122125] transition"
              >
                Profile
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                onClick={() => setOpenProfile(false)}
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-[#122125] transition"
              >
                Settings
              </Link>

              <hr className="border-[#2c4449]" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#122125] transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
