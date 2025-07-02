import React, { useState, useEffect } from "react";
import Foot from "../../public/foot.svg";
//import phone from "../../public/phone.png";
import email from "../../public/email.png";
import location from "../../public/location.png";
import { useNavigate } from "react-router-dom";
//import { FaArrowUp } from "react-icons/fa";
//import dropdown from "../../public/dropdown_icon.svg";
function Footer() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const navigate = useNavigate();

  return (

    <div>
      {/* Main Footer Section */}
      <footer className="footer sm:footer-horizontal bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 flex flex-wrap justify-between">
        <aside className="max-w-xs mb-6 sm:mb-0">
          <img
            src={Foot}
            alt="Footer Illustration"
            className="mb-4 w-50 h-auto"
          />
          <p className="text-base md:text-sm   leading-relaxed mb-4">
            Transforming healthcare through technology.
            <br />
            Experience seamless, secure, and smarter healthcare management.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* <img src={phone} alt="Phone" className="w-5 h-5" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 512 512"
            >
              <path
                fill="#ababab"
                d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
              />
            </svg>
            <p className="text-sm">+91 98678 39223</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {/* <img src={email} alt="Email" className="w-5 h-5" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 512 512"
            >
              <path
                fill="#bababa"
                d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
              />
            </svg>
            <p className="text-sm">medilinkplus@gmail.com</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {/* <img src={location} alt="Location" className="w-5 h-5" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="15"
              viewBox="0 0 384 512"
            >
              <path
                fill="#bdbdbd"
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
              />
            </svg>
            <p className="text-sm">12, Shreejidham, Ellisbridge, Ahmedabad</p>
          </div>
        </aside>
        <nav className="min-w-[150px] mb-6 sm:mb-0">
          <h6 className="text-[#d9d9d9] font-bold text-lg mb-3">Services</h6>
          <a className="link link-hover block text-sm mb-1">
            Role-based modules{" "}
          </a>
          <a className="link link-hover block text-sm mb-1">Consultancy</a>
          <a className="link link-hover block text-sm mb-1">
            Online medicine ordering
          </a>
          <a className="link link-hover block text-sm mb-1">
            Digital record management
          </a>
        </nav>

        <nav className="min-w-[150px] mb-6 sm:mb-0">
          <h6 className="text-[#d9d9d9] font-bold text-lg mb-3">Company</h6>
          <a className="link link-hover block text-sm mb-1 " onClick={()=>navigate("/about")}>About us</a>
          <a className="link link-hover block text-sm mb-1" onClick={()=>navigate("/contact")}>Contact</a>
          <a className="link link-hover block text-sm mb-1">LinkedIn</a>
          <a className="link link-hover block text-sm mb-1">X(Twitter)</a>
        </nav>

        <nav className="min-w-[150px] mb-6 sm:mb-0">
          <h6 className="text-[#d9d9d9] font-bold text-lg mb-3">Legal</h6>
          <a className="link link-hover block text-sm mb-1" onClick={() => navigate('/legal/terms-of-use')}>Terms of use</a>
          <a className="link link-hover block text-sm mb-1" onClick={() => navigate('/legal/privacy-policy')}>Privacy policy</a>
          <a className="link link-hover block text-sm mb-1" onClick={() => navigate('/legal/cookie-policy')}>Cookie policy</a>
        </nav>
      </footer>

      {/* Bottom Bar */}
      <footer className="bg-slate-900 text-white text-center py-4 px-4 relative">
        <p className="text-sm md:text-base leading-relaxed">
          &copy; 2025{" "}
          <span className="text-[#1c7856] font-semibold text-base">
            MediLink Plus
          </span>
          . All rights reserved. Transforming{" "}
          <span className="text-[#1c7856]">healthcare</span> through{" "}
          <span className="text-[#1c6856] font-bold">technology</span>.
        </p>
      </footer>

      {/* Scroll to Top Button
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#1c7856] hover:bg-[#145c40] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )} */}
    </div>
  );
}

export default Footer;
