"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient";

// Optional: Page Transition Animation
import { motion } from "framer-motion";

export default function ForgotPasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value);

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

  // Handle "Back to Login" navigation with animation
  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* Background Gradient Blur */}
      <div className="fixed inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-20"></div>

      <div className="wrapper relative z-10">
        <span className="bg-animate"></span>
        <span className="bg-animate2"></span>

        <div className="form-box login">
          <h2
            className="animation"
            style={{ "--i": 0, "--j": 21 } as React.CSSProperties}
          >
            {t("forgot_password")}
          </h2>

          <form onSubmit={handleResetPassword}>
            <div className="input-box animation" style={{ "--i": 1, "--j": 22 } as React.CSSProperties}>
              <input
                type="text"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            {isOtpSent && (
              <div className="input-box animation" style={{ "--i": 2, "--j": 23 } as React.CSSProperties}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            )}

            {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}

            <button
              type="submit"
              className="btn animation mt-4"
              style={{ "--i": 3, "--j": 24 } as React.CSSProperties}
              disabled={loading}
            >
              {loading ? "Loading..." : isOtpSent ? "Verify OTP" : "Send Reset Link / OTP"}
            </button>
          </form>

          {/* Back to Login Link with Same Design */}
          <motion.p
            className="text-center text-sm mt-4 cursor-pointer text-[#0ef] font-semibold"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={handleBackToLogin}
          >
            {t("back_to_login") || "Back to Login"}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
