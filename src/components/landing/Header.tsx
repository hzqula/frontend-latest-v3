"use client";
import { useState, useRef } from "react";
import NavLink from "./Navlink";
import { Button } from "./Button";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  return (
    <header className="h-24 fixed z-50 w-full bg-primary-600 px-4 py-4">
      <div className="flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="logo" width={48} height={48} />
          <div className="flex flex-col justify-center">
            <a href="/" className="text-xl font-bold font-display text-white">
              LATEST
            </a>
            <a
              href="https://unri.ac.id"
              className="text-white text-sm sm:text-base font-normal -mt-1"
            >
              S1 Teknik Lingkungan
            </a>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            textColor="white"
            afterColor="white"
            hover="animate-left"
            padding="default"
            href="/"
          >
            Beranda
          </NavLink>

          {/* Panduan Dropdown */}
          <NavLink
            textColor="white"
            afterColor="white"
            hover="animate-left"
            padding="default"
            href="/"
          >
            <div className="relative group" ref={dropdownRef}>
              <button
                type="button"
                className="text-white hover:text-white px-4 py-2 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => e.preventDefault()}
              >
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-white after:transition-all after:duration-300">
                  Panduan
                </span>
                <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out">
                <div className="py-1 text-sm">
                  <a
                    href="/panduan/sop"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    SOP
                  </a>
                  <a
                    href="/panduan/format-penulisan-ta"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Format Penulisan TA
                  </a>
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink
            textColor="white"
            afterColor="white"
            hover="animate-left"
            padding="default"
            href="/galeri"
          >
            Galeri
          </NavLink>
          <NavLink
            textColor="white"
            afterColor="white"
            hover="animate-left"
            padding="default"
            href="/"
          >
            Kalender Akademik
          </NavLink>
          <NavLink
            textColor="white"
            afterColor="white"
            hover="animate-left"
            padding="default"
            href="/"
          >
            Kontak
          </NavLink>
        </nav>

        {/* Login Button */}
        <div className="hidden md:block">
          <Button onClick={() => navigate("/login")} variant="outline-white">
            Login
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 bg-primary-700 p-4 rounded-lg">
          <a href="/" className="block text-white">
            Beranda
          </a>
          <div className="block">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer text-white">
                Panduan
                <ChevronDown className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 pl-4 space-y-1">
                <a href="/panduan/sop" className="block text-white text-sm">
                  SOP
                </a>
                <a
                  href="/panduan/format-penulisan-ta"
                  className="block text-white text-sm"
                >
                  Format Penulisan TA
                </a>
              </div>
            </details>
          </div>
          <a href="/galeri" className="block text-white">
            Galeri
          </a>
          <a href="/" className="block text-white">
            Kalender Akademik
          </a>
          <a href="/" className="block text-white">
            Kontak
          </a>
          <Button
            onClick={() => navigate("/login")}
            variant="outline-white"
            className="w-full"
          >
            Login
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
