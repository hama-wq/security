"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";

// ----------------------
// LoginForm Component
// ----------------------
export function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\+?[1-9]\d{1,14}$/.test(phone);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (!identifier) {
      setErrorMsg("Please enter an email or phone number.");
      setLoading(false);
      return;
    }

    let result;
    if (isValidEmail(identifier)) {
      result = await supabase.auth.signInWithPassword({ email: identifier, password });
    } else if (isValidPhone(identifier)) {
      result = await supabase.auth.signInWithPassword({ phone: identifier, password });
    } else {
      setErrorMsg("Invalid email or phone number format.");
      setLoading(false);
      return;
    }

    if (result.error) {
      setErrorMsg(result.error.message);
    } else if (result.data?.user) {
      router.push("/auth/select-language");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <h2 className="animation" style={{ "--i": 0, "--j": 21 } as React.CSSProperties}>Login</h2>
      <div className="input-box animation" style={{ "--i": 1, "--j": 22 } as React.CSSProperties}>
        <input
          type="text"
          placeholder="Email / Phone Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <label>Email / Phone Number</label>
        <i className="bx bxs-user"></i>
      </div>
      <div className="input-box animation" style={{ "--i": 2, "--j": 23 } as React.CSSProperties}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
        <i className="bx bxs-lock-alt"></i>
      </div>
      {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
      <button
        type="submit"
        className="btn animation"
        style={{ "--i": 3, "--j": 24 } as React.CSSProperties}
        disabled={loading}
      >
        {loading ? "Logging In..." : "Log In"}
      </button>
      <div className="logreg-link animation" style={{ "--i": 4, "--j": 25 } as React.CSSProperties}>
        <p>
          <a href="/auth/forgot-password">
            Forgot Password?
          </a>
        </p>
        <p>
          Don't have an account?{" "}
          <a
            href="#"
            className="register-link"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToSignup();
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </form>
  );
}

// ----------------------
// SignupForm Component
// ----------------------
export function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
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
    <form onSubmit={handleSignup}>
      <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>Sign Up</h2>
      <div className="input-box animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label>Full Name</label>
        <i className="bx bxs-user"></i>
      </div>
      <div className="input-box animation" style={{ "--i": 19, "--j": 2 } as React.CSSProperties}>
        <input
          type="text"
          placeholder="Email / Phone Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <label>Email / Phone Number</label>
        <i className="bx bxs-envelope"></i>
      </div>
      {isOtpSent && isValidPhone(identifier) && (
        <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label>Enter OTP</label>
        </div>
      )}
      <div className="input-box animation" style={{ "--i": 20, "--j": 3 } as React.CSSProperties}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
        <i className="bx bxs-lock-alt"></i>
      </div>
      <button
        type="submit"
        className="btn animation"
        style={{ "--i": 21, "--j": 4 } as React.CSSProperties}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </button>
      <div className="logreg-link animation" style={{ "--i": 22, "--j": 5 } as React.CSSProperties}>
        <p>
          Already have an account?{" "}
          <a
            href="#"
            className="login-link"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
          >
            Login
          </a>
        </p>
      </div>
      {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}
    </form>
  );
}

// ----------------------
// Main AuthLanding Component
// ----------------------
export default function AuthLanding(): JSX.Element {
  // State to toggle between login (false) and signup (true)
  const [active, setActive] = useState(false);

  return (
    <div className={`wrapper ${active ? "active" : ""}`}>
      {/* Background animated spans */}
      <span className="bg-animate"></span>
      <span className="bg-animate2"></span>

      {/* Login Form */}
      <div className="form-box login">
        <LoginForm onSwitchToSignup={() => setActive(true)} />
      </div>

      {/* Signup Form */}
      <div className="form-box register">
        <SignupForm onSwitchToLogin={() => setActive(false)} />
      </div>

      {/* Info Text for Login */}
      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 } as React.CSSProperties}>
          Welcome Back!
        </h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 } as React.CSSProperties}>
          Please log in to continue.
        </p>
      </div>

      {/* Info Text for Signup */}
      <div className="info-text register">
        <h2 className="animation" style={{ "--i": 17, "--j": 0 } as React.CSSProperties}>
          Create an Account
        </h2>
        <p className="animation" style={{ "--i": 18, "--j": 1 } as React.CSSProperties}>
          Sign up to enjoy the full features.
        </p>
      </div>
    </div>
  );
}
