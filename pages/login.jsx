import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [step, setStep] = useState("request"); // 'request' | 'verify'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0); // seconds left for resend
  const router = useRouter();

  // ⏱️ countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequest = async (e, isResend = false) => {
    e?.preventDefault();
    const res = await fetch("/api/requestOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to send OTP");
    toast.success(isResend ? "OTP resent!" : "OTP sent to your email");
    setStep("verify");
    setCooldown(60); // start 60s cooldown
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "OTP invalid");
    toast.success("Logged in");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Info Alert */}
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          ℹ️ You need to login to <strong>add or modify schools</strong>.
          Viewing schools is open for everyone.
        </div>

        {step === "request" ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Login with Email
            </h2>
            <form onSubmit={handleRequest} className="space-y-4">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02]">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
              Enter the 6-digit OTP
            </h2>
            <p className="text-sm text-center text-red-500 p-2">Check spam box for otp email.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 tracking-widest text-center font-mono"
              />
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-[1.02]">
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Change Email
                  </button>
                </div>

                {/* Resend OTP button with cooldown */}
                <button
                  type="button"
                  onClick={(e) => handleRequest(e, true)}
                  disabled={cooldown > 0}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    cooldown > 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
