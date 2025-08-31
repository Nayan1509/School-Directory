import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">School Directory 🏫</h1>
      <p className="text-gray-600 mb-8">Manage and view schools easily</p>

      <div className="flex gap-4">
        <Link
          href="/addSchool"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          ➕ Add School
        </Link>

        <Link
          href="/showSchools"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          📖 View Schools
        </Link>
      </div>
    </div>
  );
}
