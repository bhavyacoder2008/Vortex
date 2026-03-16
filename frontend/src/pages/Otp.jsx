import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const navigate = useNavigate();
  const [Otp, setOtp] = useState(["", "", "", ""]); // 4 boxes
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e, i) => {
    const val = e.target.value;

    // Only numbers allowed
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...Otp];
    newOtp[i] = val;
    setOtp(newOtp);

    // Auto focus next
    if (val && i < 3) {
      inputsRef.current[i + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !Otp[i] && i > 0) {
      inputsRef.current[i - 1].focus();
    }
  };


  // Verify OTP
  const handleVerify = async () => {
    if (Otp.includes("") || Otp.length < 4) return;

    const otpStr = Otp.join("");
    const email = localStorage.getItem("email");
    if (!email) return alert("Email missing!");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/users/otpVerification",
        { otp: otpStr, email }, { withCredentials: true }
      );
      console.log(res.data);
      navigate("/addProfilePic");
    } catch (err) {
      console.error(err);
      //   alert("OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const allFilled = !Otp.includes("");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#13131f] border border-[#1e1e2e] rounded-2xl px-8 py-10 flex flex-col items-center gap-8">

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-[#2a2a40] flex items-center justify-center text-2xl select-none">
          🔐
        </div>

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6c6c8a] mb-2">
            Verification
          </p>
          <h2 className="text-2xl font-extrabold text-[#f0f0ff] tracking-tight">
            Enter{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              OTP
            </span>
          </h2>
          <p className="text-[#4a4a6a] text-sm mt-2">
            We sent a 4-digit code to your email
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-3">
          {Array(4)
            .fill()
            .map((_, i) => (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength="1"
                value={Otp[i]}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputsRef.current[i] = el)}
                className={`w-14 h-14 text-center text-xl font-bold bg-[#0e0e1a] border rounded-xl text-[#e8e8f0] outline-none transition-all duration-200 caret-violet-400
                  ${Otp[i]
                    ? "border-violet-500 shadow-[0_0_12px_rgba(167,139,250,0.25)]"
                    : "border-[#1e1e2e] focus:border-violet-700 focus:ring-2 focus:ring-violet-500/10"
                  }`}
              />
            ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={Otp.includes("") || loading}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200
            ${allFilled && !loading
              ? "bg-linear-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-[0_4px_20px_rgba(139,92,246,0.3)] cursor-pointer"
              : "bg-[#1a1a2a] text-[#3a3a55] cursor-not-allowed"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify OTP"
          )}
        </button>

      </div>
    </div>
  );
};

export default Otp;