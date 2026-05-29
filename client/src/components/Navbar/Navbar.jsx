import React, { useState, useEffect, use } from "react";

import { useNotification } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";

import { MdDarkMode, MdLightMode } from "react-icons/md";

import { GoBell } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { IoCartOutline } from "react-icons/io5";

import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileMenu(false);
        setMobileProfileOpen(false);
        setShowProfile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { notificationCount } = useNotification();

  // Protected navigation
  const handleProtectedNavigation = (path) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  // Logout
  const handleLogout = () => {
    // remove auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // redirect to login
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="w-full border-b bg-[#1b2e31] text-[#dbf8fa] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-15">
          {/* LEFT: Logo + links (links hidden on xs) */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-semibold">
              MyBookStore
            </Link>

            <nav className="hidden sm:flex items-center gap-2">
              <Link
                to="/books"
                className="px-3 py-1.5 rounded hover:bg-[#122125]"
              >
                Books
              </Link>
              <Link
                to="/authors"
                className="px-3 py-1.5 rounded hover:bg-[#122125]"
              >
                Authors
              </Link>
            </nav>
          </div>

          {/* CENTER: Search (hidden on small screens) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-xl flex ">
              {/* Search hidden on screens smaller than md */}
              <div className="hidden md:flex items-center bg-[#234046] rounded-sm border border-gray-600 px-2 py-1 w-full">
                <CiSearch size={20} />
                <input
                  type="text"
                  placeholder="Search books, authors..."
                  className="bg-transparent w-full ml-2 outline-none placeholder:text-[#bfecec]"
                  aria-label="Search"
                />
              </div>
              {/* Bell icon: hidden on small screens */}
              <Link
                to="/notifications"
                className="hidden z-0 md:inline-flex px-2 py-1.5 rounded hover:bg-[#122125] ml-2 relative"
              >
                <GoBell
                  size={22}
                  // className={unreadCount > 0 ? "animate-bounce" : ""}
                />

                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                    {notificationCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* RIGHT: Icons + Profile */}
          <div className="flex items-center gap-3">
            {/* Cart: visible on sm and up */}
            <Link
              to="/cart"
              className="hidden sm:inline-flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#122125]"
            >
              <IoCartOutline size={20} />
              <span className="hidden md:inline">Cart</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-[#122125]"
            >
              {theme === "dark" ? (
                <MdLightMode size={20} />
              ) : (
                <MdDarkMode size={20} />
              )}
            </button>

            {/* Profile: hover shows (desktop), click toggles (mobile) */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <button className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#122125]">
                <CgProfile size={22} />
                <span className="hidden sm:inline">
                  {user?.fName || "Sign in"}
                </span>
                {/* <IoIosArrowDown
                  className={`transition-transform ${
                    showProfile ? "rotate-180" : ""
                  }`}
                /> */}
              </button>

              {/* Desktop dropdown (visible on hover/click on wider screens) */}
              {showProfile && (
                <div className="absolute right-0 mt-0 w-44 bg-[#1b2e31] text-[#dbf8fa] rounded shadow-lg border overflow-hidden z-40">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleProtectedNavigation("/profile");
                    }}
                    className="w-full text-left block px-4 py-2 hover:bg-[#122125]"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleProtectedNavigation("/orders");
                    }}
                    className="w-full text-left block px-4 py-2 hover:bg-[#122125]"
                  >
                    Orders
                  </button>
                  <Link
                    to="/notifications"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 hover:bg-[#122125]"
                  >
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      handleProtectedNavigation("/wishlist");
                    }}
                    className="w-full text-left block px-4 py-2 hover:bg-[#122125]"
                  >
                    Wishlist
                  </button>
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#122125] text-red-500 cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#122125] text-amber-300 cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}

              {/* Mobile profile dropdown (inside mobile drawer or as floating under button) */}
              {mobileProfileOpen && (
                <div className="absolute right-0 top-12 w-44 bg-[#0f2223]  rounded shadow-lg border border-gray-700 overflow-hidden z-40">
                  <div
                    onClick={() => {
                      setMobileProfileOpen(false);
                      handleProtectedNavigation("/profile");
                    }}
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    My Profile
                  </div>
                  <div
                    onClick={() => {
                      setMobileProfileOpen(false);
                      handleProtectedNavigation("/orders");
                    }}
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    Orders
                  </div>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    Notifications
                  </Link>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-[#122125] text-red-500 cursor-pointer"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-left px-4 py-2 hover:bg-[#122125] text-amber-300 cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="sm:hidden p-2 rounded hover:bg-[#122125]"
              onClick={() => setMobileMenu((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER: slides in from right */}
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${
            mobileMenu
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenu(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#102324] z-40 transform transition-transform duration-300 ease-in-out
            ${mobileMenu ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className="text-lg font-semibold">Menu</div>
            <button
              onClick={() => setMobileMenu(false)}
              aria-label="Close menu"
              className="p-2 rounded hover:bg-[#162b31]"
            >
              <HiX size={22} />
            </button>
          </div>

          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className="block px-3 py-2 rounded hover:bg-[#162b31]"
            >
              Library
            </Link>
            <Link
              to="/books"
              onClick={() => setMobileMenu(false)}
              className="block px-3 py-2 rounded hover:bg-[#162b31]"
            >
              Books
            </Link>
            <Link
              to="/authors"
              onClick={() => setMobileMenu(false)}
              className="block px-3 py-2 rounded hover:bg-[#162b31]"
            >
              Authors
            </Link>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;
