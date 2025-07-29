import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../public/Logo.jpg";
import Profilepic from "../../public/Profilepic.png";
import dropdown from "../../public/dropdown_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);

  const { token, setToken, userData } = useContext(AppContext);
  const { cartItemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    clearCart();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = (
    <>
      <li>
        <a href="/" className="text-lg">
          Home
        </a>
      </li>
      <li>
        <a href="/contact" className="text-lg">
          Contact Us
        </a>
      </li>
      <li>
        <a href="/about" className="text-lg">
          About Us
        </a>
      </li>
      <li>
        <a href="/hospital" className="text-lg">
          Hospitals
        </a>
      </li>
      <li>
        <a href="/consultdoctor" className="text-lg">
          Consult Doctors
        </a>
      </li>
      <li>
        <a href="/medicines" className="text-lg">
          Medicines
        </a>
      </li>
      <li>
        <a href="/faq" className="text-lg">
          FAQ
        </a>
      </li>
    </>
  );

  return (
    <div
      className={`w-full left-0 right-0 z-50 ${
        sticky
          ? "sticky-navbar shadow-md bg-base-400 duration-300 transition-all ease-in-out"
          : ""
      }`}
    >
      <div className="navbar max-w-screen-2xl mx-auto px-4 w-full">
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            {showMenu && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                {navItems}
              </ul>
            )}
          </div>

          {/* Logo */}
          <img
            onClick={() => navigate("/")}
            src={Logo}
            className="h-12 w-auto object-contain cursor-pointer "
            alt="Logo"
          />
        </div>

        {/* Desktop Nav Items */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-4">
          {/* Cart Icon */}
          <div className="relative">
            <Link to="/cart" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="badge badge-sm indicator-item bg-[#1c7856] text-white border-0">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:block">
            <label className="px-3 py-2 border rounded-md input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" required placeholder="Search" />
            </label>
          </div>

          {/* Profile/Login Dropdown */}
          <div ref={dropdownRef}>
            {token && userData  ? (
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  <img
                    className="w-10 rounded-full"
                    src={userData.image}
                    alt="Profile"
                  />
                  <img className="w-3" src={dropdown} alt="Dropdown Icon" />
                </div>

                {showMenu && (
                  <div className="absolute top-full right-0 mt-2 flex flex-col gap-4 p-4 min-w-48 bg-stone-100 text-base font-medium text-gray-700 rounded shadow-lg z-50 transition duration-300">
                    <p
                      className="cursor-pointer hover:text-green-600"
                      onClick={() => {
                        navigate("/myprofile");
                        setShowMenu(false);
                      }}
                    >
                      My Profile
                    </p>
                    <p
                      className="cursor-pointer hover:text-green-600"
                      onClick={() => {
                        navigate("/userappoint");
                        setShowMenu(false);
                      }}
                    >
                      My Appointments
                    </p>
                    <p
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => {
                        navigate("/dashboard");
                        setShowMenu(false);
                      }}
                    >
                      Dashboard
                    </p>
                    <p
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-[#1c7856] text-white px-3 py-2 rounded-lg hover:bg-green-700 cursor-pointer duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
