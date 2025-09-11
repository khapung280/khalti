import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { isLoggedIn, logout } from "../utils/auth";

const NAV_LINKS = [
  { to: "/", label: "Home", exact: true },
  { to: "/product", label: "Shop" },
  { to: "/About", label: "About" },
  { to: "/contact", label: "Contact" },
];

const SHOP_CATEGORIES = [
  { label: "All groceries", to: "/product" },
  { label: "Vegetables", to: "/product?category=Vegetables" },
  { label: "Fruits", to: "/product?category=Fruits" },
  { label: "Grains", to: "/product?category=Grains" },
  { label: "Dairy & Eggs", to: "/product?category=Dairy%20%26%20Eggs" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setIsOpen(false);
    setShopOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const navLinkClass = (to, exact = false) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive(to, exact)
        ? "text-emerald-700 bg-emerald-50"
        : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
    }`;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/product?q=${encodeURIComponent(q)}`);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200 group-hover:shadow-lg transition">
              <FaLeaf className="text-lg" />
            </span>
            <div className="hidden sm:block leading-tight">
              <span className="block text-base font-bold text-slate-900 group-hover:text-emerald-800 transition">
                Koshi Organic
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Agro Food
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={navLinkClass("/", true)}>
              Home
            </Link>

            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link to="/product" className={`${navLinkClass("/product")} flex items-center gap-1`}>
                Shop
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {shopOpen && (
                <div className="absolute top-full left-0 pt-2 w-52">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden">
                    {SHOP_CATEGORIES.map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/About" className={navLinkClass("/About")}>
              About
            </Link>
            <Link to="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </div>

          {/* Search — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2"
          >
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groceries..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition"
              />
            </div>
          </form>

          {/* Actions — desktop */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            {loggedIn ? (
              <>
                <Link
                  to="/product"
                  title="Favorites"
                  className="p-2.5 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-50 transition"
                >
                  <FiHeart className="w-5 h-5" />
                </Link>
                <Link
                  to="/Payment"
                  title="Cart & Checkout"
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                </Link>
                <Link
                  to="/product"
                  title="My account"
                  className="p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <FiUser className="w-5 h-5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-1 px-4 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <form onSubmit={handleSearch} className="p-4 border-b border-slate-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search groceries..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </form>

          <div className="px-3 py-2 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.to, link.exact)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Categories
            </p>
            {SHOP_CATEGORIES.slice(1).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 space-y-2">
            {loggedIn ? (
              <>
                <Link
                  to="/Payment"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl"
                >
                  <FiShoppingCart />
                  Cart & Checkout
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="block w-full py-3 text-center text-white font-semibold bg-emerald-600 rounded-xl"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-3 text-center text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
