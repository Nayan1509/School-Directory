import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [preview, setPreview] = useState("");

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") formData.append("image", value[0]); // file input
      else formData.append(key, value);
    });

    const res = await fetch("/api/addSchool", {
      method: "POST",
      body: formData,
    });

    const out = await res.json();
    if (res.ok) {
      alert("School added successfully!");
      setPreview("");
      reset();
    } else {
      alert(out.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add School</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* School Name */}
        <div>
          <input
            {...register("name", { required: "School name is required" })}
            placeholder="School Name"
            className="w-full border rounded p-2"
          />
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <input
            {...register("address", { required: "Address is required" })}
            placeholder="Address"
            className="w-full border rounded p-2"
          />
          {errors.address && (
            <p className="text-red-600 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register("city", { required: "City is required" })}
              placeholder="City"
              className="w-full border rounded p-2"
            />
            {errors.city && (
              <p className="text-red-600 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("state", { required: "State is required" })}
              placeholder="State"
              className="w-full border rounded p-2"
            />
            {errors.state && (
              <p className="text-red-600 text-sm">{errors.state.message}</p>
            )}
          </div>
        </div>

        {/* Contact & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              {...register("contact", {
                required: "Contact is required",
                pattern: {
                  value: /^[0-9+\-\s]{7,20}$/,
                  message: "Invalid phone number",
                },
              })}
              placeholder="Contact Number"
              className="w-full border rounded p-2"
            />
            {errors.contact && (
              <p className="text-red-600 text-sm">{errors.contact.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("email_id", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              placeholder="Email Address"
              type="email"
              className="w-full border rounded p-2"
            />
            {errors.email_id && (
              <p className="text-red-600 text-sm">{errors.email_id.message}</p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "School image is required" })}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="w-full"
          />
          {errors.image && (
            <p className="text-red-600 text-sm">{errors.image.message}</p>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="h-40 border rounded object-cover"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Add School"}
        </button>
      </form>
    </div>
  );
}
