import React, { useState, useEffect } from "react";

import { useNotification } from "../../context/NotificationContext";

import { GoBell } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { HiMenu, HiX } from "react-icons/hi";
import { IoCartOutline } from "react-icons/io5";

import { Link } from "react-router-dom";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  // unread notification count
  // const [unreadCount, setUnreadCount] = useState(0);

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

  // const fetchUnreadCount = async () => {
  //   try {
  //     const res = await axios.get(
  //       "http://localhost:5000/notifications/unread-count",
  //     );
  //     console.log(res.data);
  //     setUnreadCount(res.data.unread);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUnreadCount();

  //   socket.on("new-notification", () => {
  //     setUnreadCount((prev) => prev + 1);
  //   });

  //   return () => {
  //     socket.off("new-notification");
  //   };
  // }, []);

  const { notificationCount } = useNotification();

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

            {/* Profile: hover shows (desktop), click toggles (mobile) */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <button className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#122125]">
                <CgProfile size={22} />
                <span className="hidden sm:inline">Deepak</span>
                <IoIosArrowDown
                  className={`transition-transform ${
                    showProfile ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop dropdown (visible on hover/click on wider screens) */}
              {showProfile && (
                <div className="absolute right-0 mt-0 w-44 bg-[#1b2e31] text-[#dbf8fa] rounded shadow-lg border overflow-hidden z-40">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 hover:bg-[#122125]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 hover:bg-[#122125]"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 hover:bg-[#122125]"
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowProfile(false)}
                    className="block px-4 py-2 hover:bg-[#122125]"
                  >
                    Wishlist
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#122125] text-red-500">
                    Logout
                  </button>
                </div>
              )}

              {/* Mobile profile dropdown (inside mobile drawer or as floating under button) */}
              {mobileProfileOpen && (
                <div className="absolute right-0 top-12 w-44 bg-[#0f2223]  rounded shadow-lg border border-gray-700 overflow-hidden z-40">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 hover:bg-[#13474a]"
                  >
                    Notifications
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#13474a] text-red-400">
                    Logout
                  </button>
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

            <div className="pt-2 border-t border-gray-800">
              {/* <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <CgProfile size={18} />
                  <span>Deepak</span>
                </div>
                <button
                  onClick={() => setMobileProfileOpen((prev) => !prev)}
                  className="p-1 rounded hover:bg-[#13474a]"
                >
                  <IoIosArrowDown />
                </button>
              </div> */}

              {/* Expandable mobile profile section */}
              {/* {mobileProfileOpen && (
                <div className="flex flex-col px-3 gap-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenu(false)}
                    className="px-2 py-2 rounded hover:bg-[#13474a]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/message"
                    onClick={() => setMobileMenu(false)}
                    className="px-2 py-2 rounded hover:bg-[#13474a]"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/notification"
                    onClick={() => setMobileMenu(false)}
                    className="px-2 py-2 rounded hover:bg-[#13474a]"
                  >
                    Notifications
                  </Link>
                  <button className="text-left px-2 py-2 rounded hover:bg-[#13474a] text-red-400">
                    Logout
                  </button>
                </div>
              )} */}
            </div>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;
