import { useState } from "react";
import { motion } from "framer-motion";

export default function AddSchool() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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

      setMessage({ type: "success", text: data.message });
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
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          ➕ Add New School
        </h1>

        {/* Inputs */}
        <input
          type="text"
          name="name"
          placeholder="School Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3 "
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
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="email"
          name="email_id"
          placeholder="Email ID"
          value={formData.email_id}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
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

        {/* Message */}
        {message && (
          <p
            className={`text-center font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </motion.form>
    </div>
  );
}
