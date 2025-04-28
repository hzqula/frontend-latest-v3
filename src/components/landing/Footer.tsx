import Logo from "../../assets/img/logo-white.png";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-600 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-20">
        {/* Navigation Links */}
        <div className="flex flex-col space-y-2 text-center">
          <a
            href="#"
            className="hover:text-primary-200 transition-all duration-300 hover:-translate-y-[5px]"
          >
            Beranda
          </a>
          <a
            href="#"
            className="hover:text-primary-200 transition-all duration-300 hover:-translate-y-[5px]"
          >
            Panduan
          </a>
          <a
            href="/galeri"
            className="hover:text-primary-200 transition-all duration-300 hover:-translate-y-[5px]"
          >
            Galeri
          </a>
          <a
            href="#"
            className="hover:text-primary-200 transition-all duration-300 hover:-translate-y-[5px]"
          >
            Kalender Akademik
          </a>
          <a
            href="#"
            className="hover:text-primary-200 transition-all duration-300 hover:-translate-y-[5px]"
          >
            Kontak
          </a>
        </div>

        {/* Logo and Title - Centered */}
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={Logo}
            alt="logo-unri"
            width={256}
            height={256}
            className="w-44 h-44 mb-4"
          />
          <h2 className="max-w-xs text-lg">
            TUGAS AKHIR PROGRAM STUDI TEKNIK LINGKUNGAN S-1 UNIVERSITAS RIAU
          </h2>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-start space-y-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-10 h-10" />
            <p>
              Kampus Bina Widya KM. 12,5 Simpang Baru, Kec.Tampan, Kota
              Pekanbaru, Riau 28293
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 " />
            <span className="">(0761) 63266</span>
          </div>
          <div className="flex items-center gap-2 transition-all duration-300 hover:-translate-y-[5px] hover:text-primary-200">
            <Mail className="w-5 h-5 " />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:tekniklingkungan@eng.unri.ac.id"
            >
              tekniklingkungan@eng.unri.ac.id
            </a>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center gap-10 space-x-4 mt-6 md:justify-center">
        <a
          href="#"
          target="_blank"
          className="inline-flex items-center justify-center w-12 h-12 bg-auto rounded-full border border-white transition-all duration-300 hover:-translate-y-[5px] hover:bg-primary-500"
        >
          <Instagram />
        </a>
        <a
          href="#"
          target="_blank"
          className="inline-flex items-center justify-center w-12 h-12 bg-auto rounded-full border border-white transition-all duration-300 hover:-translate-y-[5px] hover:bg-primary-500"
        >
          <Youtube />
        </a>
        <a
          href="#"
          target="_blank"
          className="inline-flex items-center justify-center w-12 h-12 bg-auto rounded-full border border-white transition-all duration-300 hover:-translate-y-[5px] hover:bg-primary-500"
        >
          <Facebook />
        </a>
      </div>

      {/* Divider line */}
      <div className="max-w-4xl mx-auto px-4 mt-8 border-t border-gray-300 opacity-50"></div>

      {/* Copyright */}
      <div className="max-w-xl mx-auto px-4 text-center mt-2">
        <p>
          &copy; 2025 Fakultas Teknik Universitas Riau. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
