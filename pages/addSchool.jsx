import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

export default  function  AddSchool () {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.replace("/login");
        else setChecking(false);
      });
  }, []);

  if (checking) return <div className="p-8">Checking authentication...</div>;


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.email_id) {
      tempErrors.email_id = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
      tempErrors.email_id = "Enter a valid email address";
    }

    if (!formData.contact) {
      tempErrors.contact = "Contact number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.contact)) {
      tempErrors.contact = "Enter a valid contact number (10-15 digits)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.replace("/login"); // redirect to login page
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        body.append(key, value)
      );

      const res = await fetch("/api/addSchool", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      // toaster for success message
      toast.success(data.message || "School added successfully!");

      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        contact: "",
        email_id: "",
        image: null,
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700">
            ➕ Add New School
          </h1>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Inputs */}
        <input
          type="text"
          name="name"
          placeholder="School Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        {/* Contact Number */}
        <div>
          <input
            type="number"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
            className={`w-full border rounded-lg p-3 ${
              errors.contact ? "border-red-500" : ""
            }`}
          />
          {errors.contact && (
            <p className="text-red-600 text-sm mt-1">{errors.contact}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="text"
            name="email_id"
            placeholder="Email ID"
            value={formData.email_id}
            onChange={handleChange}
            required
            className={`w-full border rounded-lg p-3 ${
              errors.email_id ? "border-red-500" : ""
            }`}
          />
          {errors.email_id && (
            <p className="text-red-600 text-sm mt-1">{errors.email_id}</p>
          )}
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02]"
        >
          {loading ? "Saving..." : "Add School"}
        </button>

        {/* Global error (server-side only) */}
        {message?.type === "error" && (
          <p className="text-center font-medium text-red-600">{message.text}</p>
        )}
      </motion.form>
    </div>
  );
}
