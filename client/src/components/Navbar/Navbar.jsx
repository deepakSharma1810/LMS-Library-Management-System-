import React, { useState, useEffect } from "react";
import { useNotification } from "../../context/NotificationContext";
import { useTheme } from "../../context/ThemeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { notificationCount } = useNotification();

  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape key closes everything
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  const handleProtectedNavigation = (path) => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { state: { from: path } });
    else navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (closeMobile = false) => {
    if (search.trim()) {
      navigate(`/search?q=${search}`);
      setSearch("");
      if (closeMobile) setMobileMenu(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? "bg-[#122125] text-amber-300"
        : "text-[#dbf8fa] hover:bg-[#1e3840] hover:text-amber-300"
    }`;

  return (
    <header
      className={`w-full bg-[#1b2e31] text-[#dbf8fa] sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled
          ? "shadow-lg shadow-black/30 border-b border-white/5"
          : "border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* ── LEFT: Logo + Nav ── */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-[#dbf8fa] hover:text-amber-300 transition-colors duration-200"
            >
              MyBookStore
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link to="/books" className={navLinkClass("/books")}>
                Books
              </Link>
              <Link to="/authors" className={navLinkClass("/authors")}>
                Authors
              </Link>
            </nav>
          </div>

          {/* ── CENTER: Search ── */}
          <div className="flex-1 flex items-center justify-center max-w-xl mx-auto">
            <div className="hidden md:flex items-center w-full bg-[#152528] border border-white/10 hover:border-amber-300/30 focus-within:border-amber-300/50 rounded-xl px-3 py-2 gap-2 transition-colors duration-200">
              <CiSearch size={18} className="text-[#7a9ea0] flex-shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search books, authors..."
                className="bg-transparent w-full text-sm outline-none text-[#dbf8fa] placeholder:text-[#7a9ea0]"
                aria-label="Search"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[#7a9ea0] hover:text-[#dbf8fa] text-xs transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: Icons ── */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Bell */}
            <Link
              to="/notifications"
              className="hidden md:inline-flex p-2 rounded-lg hover:bg-[#1e3840] relative transition-colors duration-200"
              aria-label="Notifications"
            >
              <GoBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-0.5 font-semibold">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#1e3840] text-sm transition-colors duration-200"
            >
              <IoCartOutline size={20} />
              <span className="hidden md:inline">Cart</span>
            </Link>

            {/* Theme toggle
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[#1e3840] transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <MdLightMode size={20} />
              ) : (
                <MdDarkMode size={20} />
              )}
            </button> */}

            {/* Profile dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1e3840] transition-colors duration-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-amber-300/30"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#1e3840] border border-amber-300/20 flex items-center justify-center">
                    <CgProfile size={18} />
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.fName || "Sign in"}
                </span>
              </button>

              {/* Desktop dropdown */}
              {showProfile && (
                <div className="absolute right-0  w-48 bg-[#152528] border border-white/10 rounded-xl shadow-xl shadow-black/30 overflow-hidden z-40">
                  {user && (
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-sm font-semibold text-[#dbf8fa] truncate">
                        {user.fName} {user.lName}
                      </p>
                      <p className="text-[11px] text-[#7a9ea0] truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  )}
                  {[
                    { label: "My Profile", path: "/profile" },
                    { label: "Orders", path: "/orders" },
                    { label: "Notifications", path: "/notifications" },
                    { label: "Wishlist", path: "/wishlist" },
                  ].map(({ label, path }) => (
                    <button
                      key={path}
                      onClick={() => {
                        setShowProfile(false);
                        handleProtectedNavigation(path);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#1e3840] hover:text-amber-300 transition-colors duration-150"
                    >
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-white/8">
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#1e3840] transition-colors duration-150"
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("/login");
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-amber-300 hover:bg-[#1e3840] transition-colors duration-150"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-[#1e3840] transition-colors duration-200"
              onClick={() => setMobileMenu((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenu ? <HiX size={22} /> : <HiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          mobileMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenu(false)}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0f1f22] z-40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/8 flex-shrink-0">
          <span className="font-bold text-[#dbf8fa]">MyBookStore</span>
          <button
            onClick={() => setMobileMenu(false)}
            className="p-1.5 rounded-lg hover:bg-[#1e3840] transition-colors"
            aria-label="Close menu"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Drawer body */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2">
          {/* Search */}
          <div className="flex items-center bg-[#152528] border border-white/10 rounded-xl px-3 py-2.5 gap-2 mb-2">
            <CiSearch size={18} className="text-[#7a9ea0] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search books, authors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(true)}
              className="bg-transparent w-full text-sm outline-none text-white placeholder:text-[#7a9ea0]"
            />
          </div>

          {/* Nav links */}
          {[
            { label: "Library", path: "/" },
            { label: "Books", path: "/books" },
            { label: "Authors", path: "/authors" },
            { label: "Cart", path: "/cart" },
            { label: "Notifications", path: "/notifications" },
          ].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenu(false)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive(path)
                  ? "bg-[#1e3840] text-amber-300"
                  : "text-[#dbf8fa] hover:bg-[#1e3840] hover:text-amber-300"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="border-t border-white/8 mt-2 pt-2 flex flex-col gap-1">
            {[
              { label: "My Profile", path: "/profile" },
              { label: "Orders", path: "/orders" },
              { label: "Wishlist", path: "/wishlist" },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => {
                  setMobileMenu(false);
                  handleProtectedNavigation(path);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[#dbf8fa] hover:bg-[#1e3840] hover:text-amber-300 transition-colors duration-150"
              >
                {label}
              </button>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenu(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-[#1e3840] transition-colors duration-150"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/login");
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-amber-300 hover:bg-[#1e3840] transition-colors duration-150"
              >
                Login
              </button>
            )}
          </div>
        </nav>

        {/* Drawer footer */}
        {user && (
          <div className="px-5 py-4 border-t border-white/8 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#1e3840] border border-amber-300/20 flex items-center justify-center flex-shrink-0">
              <CgProfile size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#dbf8fa] truncate">
                {user.fName} {user.lName}
              </p>
              <p className="text-[11px] text-[#7a9ea0] truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </aside>
    </header>
  );
};

export default Navbar;
