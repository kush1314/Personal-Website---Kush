import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/experience", label: "Experience" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Minimal Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl px-8 py-4 shadow-2xl shadow-black/5">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="font-bold text-xl bg-gradient-to-r from-slate-800 to-gray-900 bg-clip-text text-transparent hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
            >
              KP
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm ${
                      active
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-black hover:bg-black/10 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -50 }}
              className="absolute top-24 left-1/2 transform -translate-x-1/2 w-80"
            >
              <div className="bg-white/95 backdrop-blur-sm border border-black/20 rounded-xl p-6 shadow-xl">
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block p-4 rounded-lg transition-all duration-300 font-mono ${
                          active
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:text-black hover:bg-black/10'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
