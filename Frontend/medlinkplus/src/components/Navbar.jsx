import React, { useEffect, useState } from "react";
import Logo from "../../public/Logo.jpg";
import Login from "./Login";
import Profilepic from "../../public/Profilepic.png";
import dropdown from "../../public/dropdown_icon.svg";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  // Renamed to be more general, as it controls visibility for all screen sizes
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setshowMenu] = useState(false); // For the main navigation menu on mobile
  const [token, settoken] = useState(true); // true for login and false for logout

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handlers for profile dropdown actions
  const handleLogout = () => {
    settoken(false);
    setIsProfileMenuOpen(false); // Close profile menu on logout
  };

  const handleProfileNavigation = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false); // Close profile menu after navigation
  };

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
        <a href="/faq" className="text-lg">
          FAQ
        </a>
      </li>
    </>
  );

  return (
    <>
      <div
        className={`max-w-screen container-auto mx:auto top-0 left-0 right-0 z-50 ${
          sticky
            ? "sticky-navbar shadow-md bg-base-400 duration-300 transition-all ease-in-out"
            : ""
        }`}
      >
        <div className="navbar shadow-sm">
          <div className="navbar-start">
            {/* Main navigation dropdown (for small screens) */}
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
                onClick={() => setshowMenu(!showMenu)} // Toggle main menu visibility
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
              {showMenu && ( // Conditionally render based on showMenu state
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-box z-10 mt-3 w-52 p-2 shadow" 
                >
                  {navItems}
                </ul>
              )}
            </div>
            <img
              onClick={() => navigate("/")}
              src={Logo}
              className="h-12 w-auto object contain cursor-pointer"
              alt="Logo"
            />
          </div>
          <div className="navbar-end space-x-2">
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">{navItems}</ul>
            </div>
            {/* Search bar (hidden on small screens) */}
            <div className="hidden md:block">
              <label className=" px-3 py-2 border rounded-md input">
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
            {/* User Profile / Login Section */}
            <div className="relative">
              {token ? (
                // Unified trigger for profile menu (click for both desktop and mobile)
                <div
                  className="flex items-center gap-2 cursor-pointer" // Removed 'group' as hover is no longer desired
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <img src={Profilepic} alt="User Profile" className="w-10 rounded-full" />
                  <img src={dropdown} alt="Dropdown" className="w-3" />

                  {/* Profile Dropdown (visible only when isProfileMenuOpen is true) */}
                  {isProfileMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 min-w-40 bg-stone-100 rounded-md shadow-lg text-base text-gray-600 font-medium z-30">
                      <div className="flex flex-col gap-3 p-4">
                        <p
                          onClick={() => handleProfileNavigation("Myprofile")}
                          className="hover:text-black cursor-pointer py-1"
                        >
                          User Profile
                        </p>
                        <p
                          onClick={() => handleProfileNavigation("Userappoint")}
                          className="hover:text-black cursor-pointer py-1"
                        >
                          User Appointments
                        </p>
                        <p
                          onClick={handleLogout}
                          className="hover:text-black cursor-pointer py-1"
                        >
                          Logout
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="bg-[#1c7856] text-black px-3 py-2 rounded-lg hover:bg-green-200 cursor-pointer duration-300"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  Login
                </button>
              )}
              <Login />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;