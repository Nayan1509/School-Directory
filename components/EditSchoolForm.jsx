import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function EditSchoolForm({ school, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    id: school?.id || "",
    name: school?.name || "",
    address: school?.address || "",
    city: school?.city || "",
    state: school?.state || "",
    contact: school?.contact || "",
    email_id: school?.email_id || "",
    image: school?.image || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (school) {
      setFormData({
        id: school.id || "",
        name: school.name || "",
        address: school.address || "",
        city: school.city || "",
        state: school.state || "",
        contact: school.contact || "",
        email_id: school.email_id || "",
        image: school.image || "",
      });
    }
  }, [school]);

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

      const res = await fetch(`/api/updateSchool?id=${school.id}`, {
        method: "PUT",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("School updated successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/*School ID */}
        <h1 className="font-medium">ID: {formData.id}</h1>

        {/* School Name */}
        <div>
          <label className="block font-medium mb-1">School Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* School Image + Address (side by side on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">School Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* City + State (side by side on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        {/* Contact + Email (side by side on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Contact Number</label>
            <input
              type="text"
              name="contact"
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
          <div>
            <label className="block font-medium mb-1">Email ID</label>
            <input
              type="email"
              name="email_id"
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
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update School"}
        </button>
      </form>
    </div>
  );
}
