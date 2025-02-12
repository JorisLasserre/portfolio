import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaHome, FaBriefcase, FaUser, FaTools, FaEnvelope } from "react-icons/fa";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getLink = (id) => {
    return isHome ? `#${id}` : `/#${id}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-[#171717] text-white rounded-md focus:outline-none"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <a href={getLink("home")} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                <FaHome size={20} /> Accueil
              </a>
            </li>
            <li>
              <a href={getLink("experience")} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                <FaBriefcase size={20} /> Expérience
              </a>
            </li>
            <li>
              <a href={getLink("about")} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                <FaUser size={20} /> À propos
              </a>
            </li>
            <li>
              <Link to="/tools" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                <FaTools size={20} /> Outils
              </Link>
            </li>
            <li>
              <a href={getLink("contact")} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md">
                <FaEnvelope size={20} /> Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
