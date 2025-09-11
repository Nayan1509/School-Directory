import { useState } from "react";
import toast from "react-hot-toast";

export default function AddSchoolForm({ onSuccess, onClose }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      toast.success(data.message || "School added successfully!");

      // Clear form
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        contact: "",
        email_id: "",
        image: null,
      });

      if (onSuccess) onSuccess(); // let parent refresh list
      if (onClose) onClose(); // close modal
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Contact */}
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

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        {loading ? "Saving..." : "Add School"}
      </button>
    </form>
  );
}
