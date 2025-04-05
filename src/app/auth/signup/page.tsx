// src/app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Email or phone number
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // For phone, we use E.164 format (e.g., +9647712331141)
  const isValidPhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

  // Function to check if phone is already registered using our backend API
  const checkPhoneRegistered = async (phone: string) => {
    try {
      const res = await fetch("http://localhost:3002/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      // If the phone is already registered, the API returns success=false and an error message.
      return data.success;
    } catch (error: any) {
      setErrorMsg(error.message);
      return false;
    }
  };

  // Function to send OTP for phone sign up
  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch("http://localhost:3002/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.success) {
        return true;
      } else {
        setErrorMsg(data.error || "Failed to send OTP.");
        return false;
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      return false;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!identifier || !password || !fullName) {
      setErrorMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (isValidEmail(identifier)) {
      // Sign up using email
      const { error } = await supabase.auth.signUp({ email: identifier, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/auth/login");
      }
    } else if (isValidPhone(identifier)) {
      // First check if the phone is already registered
      const phoneAvailable = await checkPhoneRegistered(identifier);
      if (!phoneAvailable) {
        setErrorMsg("Phone number is already registered.");
        setLoading(false);
        return;
      }
      // For phone sign up, send OTP if not already sent
      if (!isOtpSent) {
        const sent = await sendOtp(identifier);
        if (sent) {
          setIsOtpSent(true);
          setErrorMsg("OTP sent to your phone. Please enter the OTP below.");
        }
      } else {
        if (otp.length !== 6) {
          setErrorMsg("Please enter the 6-digit OTP sent to your phone.");
          setLoading(false);
          return;
        }
        // After OTP is (assumed) verified, proceed with phone-based sign up.
        const { error } = await supabase.auth.signUp({ phone: identifier, password });
        if (error) {
          setErrorMsg(error.message);
        } else {
          router.push("/auth/login");
        }
      }
    } else {
      setErrorMsg("Invalid email or phone number format.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{t("create_account") || "Create Account"}</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder={t("full_name") || "Full Name"}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        <input
          type="text"
          placeholder={t("email_or_phone") || "Email or Phone Number"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        {isOtpSent && isValidPhone(identifier) && (
          <input
            type="text"
            placeholder={t("enter_otp") || "Enter OTP"}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        )}
        <input
          type="password"
          placeholder={t("password") || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Creating Account..." : t("signup") || "Sign Up"}
        </button>
      </form>
      {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}
    </div>
  );
}
