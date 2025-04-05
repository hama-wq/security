// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // Email or phone number
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value);

  // Function to call the backend endpoint to send OTP for phone numbers
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!identifier) {
      setErrorMsg("❌ Please enter an email or phone number.");
      setLoading(false);
      return;
    }

    try {
      if (isEmail(identifier)) {
        // For email, use Supabase's built-in reset password method
        const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) {
          setErrorMsg(`❌ ${error.message}`);
        } else {
          setErrorMsg("✅ A password reset link has been sent to your email.");
        }
      } else if (isPhone(identifier)) {
        if (!isOtpSent) {
          const sent = await sendOtp(identifier);
          if (sent) {
            setIsOtpSent(true);
            setErrorMsg("OTP sent to your phone. Please enter the OTP below.");
          }
        } else {
          // After OTP is sent (and ideally verified on the backend), navigate to update password
          router.push("/auth/update-password?phone=" + encodeURIComponent(identifier));
        }
      } else {
        setErrorMsg("❌ Invalid email or phone number format.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(`❌ ${error.message}`);
      } else {
        setErrorMsg("❌ An unknown error occurred.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{t("forgot_password")}</h2>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <input
          type="text"
          placeholder={t("email_or_phone") || "Email or Phone Number"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        {isOtpSent && isPhone(identifier) && (
          <input
            type="text"
            placeholder={t("enter_otp") || "Enter OTP"}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : t("send_reset_link") || "Send Reset Link"}
        </button>
      </form>
      {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}
    </div>
  );
}
