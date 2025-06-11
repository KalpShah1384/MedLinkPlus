import React from "react";
//import Logo from "../../public/Logo.jpg";
import Logo from "../../public/footer logo.svg"; 

function Footer() {
  return (
    <div>
      <hr />
      {/* Top Footer */}
      <footer className="footer sm:footer-horizontal bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10">
        <nav>
          <h6 className="footer-title text-green-500">SERVICES</h6>
          <a className="link link-hover">Help center</a>
          <a className="link link-hover">Talk to support</a>
          <a className="link link-hover">Feedback</a>
          <a className="link link-hover">System status</a>
        </nav>
        <nav>
          <h6 className="footer-title text-green-500">COMPANY</h6>
          <a className="link link-hover">Home</a>
          <a className="link link-hover">Contact Us</a>
          <a className="link link-hover">About Us</a>
          <a className="link link-hover">FAQ</a>
        </nav>
        <nav>
          <h6 className="footer-title text-green-500">LEGAL</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
          <a className="link link-hover">Data security</a>
        </nav>
      </footer>

      {/* Bottom Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-t border-[#d9d9d9] px-10 py-6 text-center flex flex-col items-center gap-3">
        <img
          src={Logo}
          alt="MediLink Plus Logo"
          className="h-12 w-auto object-contain"
        />
        <p className="text-sm md:text-base">
          © 2025 - All rights reserved by{" "}
          <strong className="text-[#1c7856]">MediLinkPlus</strong>.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
