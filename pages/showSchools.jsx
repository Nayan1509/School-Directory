import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/getSchools")
      .then((res) => res.json())
      .then((data) => setSchools(data))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Schools</h1>

      {loading ? (
        // Skeleton Loader (3 cards)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : schools.length === 0 ? (
        <p className="text-gray-600">No schools found. Try adding one.</p>
      ) : (


        //Data Cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school, i) => (
            <motion.div
              key={school.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={school.image}
                alt={school.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {school.name}
                </h2>
                <p className="text-gray-600">{school.address}</p>
                <p className="text-gray-500 text-sm">
                  {school.city}, {school.state}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  📞 {school.contact} | ✉️ {school.email_id}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
