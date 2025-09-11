import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import AddSchoolForm from "@/components/AddSchoolForm";
import EditSchoolForm from "@/components/EditSchoolForm";
import { FiMenu } from "react-icons/fi";
import { GridLoader } from "react-spinners";

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Authentication check
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) router.replace("/login");
        else setUser(data.user);
      })
      .finally(() => setChecking(false));
  }, []);

  // Fetch schools
  const fetchSchools = () => {
    fetch("/api/getSchools")
      .then((res) => res.json())
      .then((data) => setSchools(data || []))
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchSchools();
  }, [user]);

  // Logout
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    toast.success("Logged out");
    router.replace("/login");
  };

  // Delete school
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this school? This school's data will be erased from database."
      )
    )
      return;

    try {
      const res = await fetch(`/api/deleteSchool?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      toast.success("School deleted successfully");
      setSchools((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GridLoader
          color="#3527de"
          loading={true}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-blue-700 text-white p-4">
        <button onClick={() => setSidebarOpen(true)}>
          <FiMenu size={24} />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      {/* Sidebar with animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar panel */}
            <motion.aside
              className="fixed inset-y-0 left-0 z-40 w-64 bg-blue-700 text-white flex flex-col p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
              {user && (
                <div className="mb-6">
                  <p className="text-sm">Logged in as:</p>
                  <p className="font-semibold break-words">{user.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="mt-auto py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        {user && (
          <div className="mb-6">
            <p className="text-sm">Logged in as:</p>
            <p className="font-semibold break-words">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="mt-auto py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 md:ml-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Schools in Database
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-100 border-2 border-blue-400 text-black rounded-lg hover:bg-blue-300"
          >
            ➕ Add School
          </button>
        </div>

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
          <p>No schools found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.address}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedSchool(school);
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(school.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Edit School Modal */}
      <AnimatePresence>
        {showEditModal && selectedSchool && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Edit School</h2>
                <EditSchoolForm
                  school={selectedSchool}
                  onSuccess={() => {
                    fetchSchools();
                    setShowEditModal(false);
                  }}
                  onClose={() => setShowEditModal(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add School Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal / Drawer */}
            <motion.div
              className={`fixed z-50 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg
                    md:max-w-md md:h-full md:top-0 md:right-0 md:rounded-l-lg`}
              initial={{
                y: window.innerWidth < 768 ? "100%" : 0,
                x: window.innerWidth >= 768 ? "100%" : 0,
              }}
              animate={{ y: 0, x: 0 }}
              exit={{
                y: window.innerWidth < 768 ? "100%" : 0,
                x: window.innerWidth >= 768 ? "100%" : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Add New School</h2>
              <AddSchoolForm
                onSuccess={() => {
                  fetchSchools();
                  setShowAddModal(false);
                }}
                onClose={() => setShowAddModal(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
