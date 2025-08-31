import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetch("/api/getSchools")
      .then((res) => res.json())
      .then((data) => setSchools(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Schools</h1>

      {schools.length === 0 ? (
        <p className="text-gray-600">No schools found. Try adding one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`/schoolImages/${school.image}`}
                alt={school.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {school.name}
                </h2>
                <p className="text-gray-600">{school.address}</p>
                <p className="text-gray-500 text-sm">{school.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
