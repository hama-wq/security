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
  const isValidPhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

  const checkPhoneRegistered = async (phone: string) => {
    try {
      const res = await fetch("http://localhost:3002/api/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return data.success;
    } catch (error: any) {
      setErrorMsg(error.message);
      return false;
    }
  };

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
      const { error } = await supabase.auth.signUp({ email: identifier, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/auth/login");
      }
    } else if (isValidPhone(identifier)) {
      const phoneAvailable = await checkPhoneRegistered(identifier);
      if (!phoneAvailable) {
        setErrorMsg("Phone number is already registered.");
        setLoading(false);
        return;
      }
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
    <div className="wrapper">
      <span className="bg-animate"></span>
      <span className="bg-animate2"></span>

      <div className="form-box register active">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>
          Sign Up
        </h2>
        <form onSubmit={handleSignup}>
          <div className="input-box animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties}>
            <input
              type="text"
              placeholder={t("full_name") || "Full Name"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <label>{t("full_name") || "Full Name"}</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
            <input
              type="text"
              placeholder={t("email_or_phone") || "Email or Phone Number"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <label>{t("email_or_phone") || "Email or Phone Number"}</label>
            <i className="bx bxs-envelope"></i>
          </div>
          {isOtpSent && isValidPhone(identifier) && (
            <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
              <input
                type="text"
                placeholder={t("enter_otp") || "Enter OTP"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <label>{t("enter_otp") || "Enter OTP"}</label>
            </div>
          )}
          <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
            <input
              type="password"
              placeholder={t("password") || "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>{t("password") || "Password"}</label>
            <i className="bx bxs-lock-alt"></i>
          </div>
          <button type="submit" className="btn animation" style={{ "--i": 21, "--j": 4 } as React.CSSProperties} disabled={loading}>
            {loading ? "Creating Account..." : t("signup") || "Sign Up"}
          </button>
          <div className="logreg-link animation" style={{ "--i": 22, "--j": 5 } as React.CSSProperties}>
            <p>
              <a href="/auth/login">{t("login") || "Login"}</a>
            </p>
          </div>
        </form>
      </div>

      <div className="info-text register active">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Welcome Back!</h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties}>
          Join us and stay secure online.
        </p>
      </div>
    </div>
  );
}
