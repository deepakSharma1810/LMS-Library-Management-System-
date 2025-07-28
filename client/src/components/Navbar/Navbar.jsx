import React from "react";
import { GoBell } from "react-icons/go";
import { CiMail, CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full border-b border-amber-50 bg-[#1b2e31]">
      <div className="max-w-full px-[40px] h-[12vh] flex flex-wrap md:flex-nowrap justify-between items-center">
        {/* Left Nav Links */}
        <ul className="flex flex-wrap text-base md:text-lg gap-2">
          <Link to="/">
            <li className="list-none px-4 py-2 cursor-pointer rounded hover:bg-[#53818aaf] text-[#dbf8fa] duration-200">
              Library
            </li>
          </Link>
          <Link to="/books">
            <li className="list-none px-4 py-2 cursor-pointer rounded text-[#dbf8fa] hover:bg-[#53818aaf] duration-200">
              Books
            </li>
          </Link>
          <Link to="/authors">
            <li className="list-none px-4 py-2 cursor-pointer rounded text-[#dbf8fa] hover:bg-[#53818aaf] duration-200">
              Authors
            </li>
          </Link>
        </ul>

        {/* Search + Icons */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4 mt-4 md:mt-0">
          {/* Hide search input on small screens, show icon instead */}
          <div className="block md:hidden">
            <CiSearch className="text-[#dbf8fa] cursor-pointer" size={24} />
          </div>

          <div className="hidden md:block relative w-full md:w-[300px] lg:w-[380px]">
            <CiSearch
              className="absolute left-4 top-3.5 text-[#dbf8fa]"
              size={22}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#234046] text-[#dbf8fa] outline-none pl-12 pr-4 py-2 rounded-sm border border-gray-400 text-base"
            />
          </div>

          <div className="flex items-center gap-2">
            <li className="list-none p-2 rounded hover:bg-[#53818aaf] cursor-pointer duration-200">
              <GoBell className="text-[#dbf8fa]" size={22} />
            </li>
            <li className="list-none p-2 rounded hover:bg-[#53818aaf] cursor-pointer duration-200">
              <CiMail className="text-[#dbf8fa]" size={22} />
            </li>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 mt-4 md:mt-0 pr-[10px]">
          <p className="text-base md:text-lg text-[#dbf8fa]">Deepak</p>
          <Link to="/signup">
            <img
              src=""
              alt="Profile"
              className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] border-2 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
