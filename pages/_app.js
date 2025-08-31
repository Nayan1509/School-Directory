import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
