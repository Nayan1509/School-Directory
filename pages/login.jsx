import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Login() {
  const [step, setStep] = useState("request"); // 'request'|'verify'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleRequest = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/requestOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error || "Failed to send OTP");
    toast.success("OTP sent to your email");
    setStep("verify");
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
    router.push("/addSchool");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        {step === "request" ? (
          <>
            <h2 className="text-xl font-bold mb-4">Login — Enter email</h2>
            <form onSubmit={handleRequest} className="space-y-4">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border p-3 rounded"
              />
              <button className="w-full py-2 bg-blue-600 text-white rounded">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Enter the 6-digit code</h2>
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full border p-3 rounded"
              />
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-blue-600 text-white rounded">
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="py-2 px-4 border rounded"
                >
                  Change email
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
