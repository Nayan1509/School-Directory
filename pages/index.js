import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-blue-700 mb-4"
      >
        School Directory
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-gray-600 mb-10 max-w-xl"
      >
        Easily add and browse schools in a clean, modern interface.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex gap-6"
      >
        <Link
          href="/addSchool"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          Add School
        </Link>

        <Link
          href="/showSchools"
          className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition transform hover:scale-105"
        >
          View Schools
        </Link>
      </motion.div>
    </div>
  );
}
