"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // Email or phone number
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
    <div className="wrapper">
      <span className="bg-animate"></span>
      <span className="bg-animate2"></span>

      <div className="form-box login">
        <h2 className="animation" style={{ "--i": 0, "--j": 21 } as React.CSSProperties}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="input-box animation" style={{ "--i": 1, "--j": 22 } as React.CSSProperties}>
            <input
              type="text"
              placeholder={t("email_or_phone") || "Email or Phone Number"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <label>{t("email_or_phone") || "Email or Phone Number"}</label>
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box animation" style={{ "--i": 2, "--j": 23 } as React.CSSProperties}>
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
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
          <button
            type="submit"
            className="btn animation"
            style={{ "--i": 3, "--j": 24 } as React.CSSProperties}
            disabled={loading}
          >
            {loading ? "Logging In..." : t("login") || "Log In"}
          </button>
          <div className="logreg-link animation" style={{ "--i": 4, "--j": 25 } as React.CSSProperties}>
            <p>
              <a href="/auth/forgot-password">{t("forgot_password") || "Forgot Password?"}</a>
            </p>
            <p>
              <a href="/auth/signup">{t("create_account") || "Create Account"}</a>
            </p>
          </div>
        </form>
      </div>

      <div className="info-text login">
        <h2 className="animation" style={{ "--i": 0, "--j": 20 } as React.CSSProperties}>
          Welcome Back!
        </h2>
        <p className="animation" style={{ "--i": 1, "--j": 21 } as React.CSSProperties}>
          Please log in to continue.
        </p>
      </div>
    </div>
  );
}
