// src/app/auth/login/page.tsx
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-blue-600">Be-safe online</h1>
          <p className="text-lg text-gray-700 mt-2">Log into Be-safe online</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder={t("email_or_phone") || "Email or Phone Number"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            placeholder={t("password") || "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white"
            required
          />
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={loading}>
            {loading ? "Logging In..." : t("login") || "Log In"}
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
            {t("forgot_password") || "Forgot Password?"}
          </a>
        </div>
        <div className="mt-4 text-center">
          <a href="/auth/signup" className="text-green-600 hover:underline">
            {t("create_account") || "Create Account"}
          </a>
        </div>
      </div>
    </div>
  );
}
