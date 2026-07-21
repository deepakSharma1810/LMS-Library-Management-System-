import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-[#0e1a1c] text-gray-300 border-t border-[#1f3a3e]">
      <div className="max-w-7xl mx-auto py-14 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight">
              Library System
            </h2>

            <p className="text-sm text-gray-400 leading-relaxed">
              Manage books, authors, members, and borrowing records all in one
              place. Empowering readers since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              {["Home", "Catalog", "My Account", "Help Center"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <HiOutlineLocationMarker
                  className="text-emerald-400 mt-0.5 shrink-0"
                  size={16}
                />
                <span>123 Library Lane, Knowledge City</span>
              </li>

              <li className="flex items-center gap-2">
                <HiOutlineMail
                  className="text-emerald-400 shrink-0"
                  size={16}
                />
                <a
                  href="mailto:support@librarysystem.com"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  support@librarysystem.com
                </a>
              </li>

              <li className="flex items-center gap-2">
                <HiOutlinePhone
                  className="text-emerald-400 shrink-0"
                  size={16}
                />
                <a
                  href="tel:+919876543210"
                  className="hover:text-emerald-400 transition-colors duration-200"
                >
                  +91 9876543210
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">
              Follow Us
            </h3>

            <div className="flex gap-3">
              {[
                { icon: FaFacebookF, label: "Facebook" },
                { icon: FaTwitter, label: "Twitter" },
                { icon: FaInstagram, label: "Instagram" },
                { icon: FaLinkedinIn, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#162428] border border-[#1f3a3e] text-gray-400 hover:text-white hover:border-emerald-400/60 hover:bg-[#1a2f33] transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1f3a3e] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Library Management System. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <a
              href="#"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-emerald-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
