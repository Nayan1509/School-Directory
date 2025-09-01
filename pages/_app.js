import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-4">
        <Component {...pageProps} />
        <Toaster
          position="top-center"
          containerStyle={{
            top: 80,
          }}
          toastOptions={{
            style: {
              fontSize: "1.2rem",
              padding: "16px 24px",
              borderRadius: "12px",
              fontWeight: "600",
              maxWidth: "500px",
            },
            success: {
              style: { background: "#4ade80", color: "#fff" }, // green
              iconTheme: { primary: "#fff", secondary: "#4ade80" },
            },
            error: {
              style: { background: "#f87171", color: "#fff" }, // red
              iconTheme: { primary: "#fff", secondary: "#f87171" },
            },
          }}
        />
      </main>
    </div>
  );
}
