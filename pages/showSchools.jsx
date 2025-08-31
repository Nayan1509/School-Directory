import { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/getSchools")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading schools...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schools</h1>

      {schools.length === 0 ? (
        <p>No schools found. Try adding one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div
              key={school.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              {school.image ? (
                <img
                  src={`/schoolImages/${school.image}`}
                  alt={school.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg">{school.name}</h2>
                <p className="text-sm text-gray-600">{school.address}</p>
                <p className="text-sm text-gray-600">{school.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
