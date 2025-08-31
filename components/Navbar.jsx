import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🏫 School Directory
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          <Link
            href="/addSchool"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Add School
          </Link>
          <Link
            href="/showSchools"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            View Schools
          </Link>
        </div>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-inner"
          >
            <div className="flex flex-col items-center gap-4 py-4">
              <Link
                href="/addSchool"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                Add School
              </Link>
              <Link
                href="/showSchools"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                View Schools
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
