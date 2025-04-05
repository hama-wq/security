// src/app/auth/login-with-phone/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { supabase } from "../../lib/supabaseClient";

export default function LoginWithPhonePage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPhoneValid = (value: string) => /^\+?[1-9]\d{1,14}$/.test(value);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!phone || !password) {
      setErrorMsg(t("enter_phone_and_password") || "Please enter both phone number and password.");
      return;
    }

    if (!isPhoneValid(phone)) {
      setErrorMsg(t("invalid_phone") || "❌ Invalid phone number format (use E.164 like +1234567890)");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) {
      setErrorMsg(`❌ ${error.message}`);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {t("login_with_phone") || "Login with Phone"}
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="tel"
          placeholder={t("phone") || "Phone Number (e.g., +1234567890)"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        <input
          type="password"
          placeholder={t("password") || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          required
        />
        {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? (t("logging_in") || "Logging In...") : (t("login") || "Log In")}
        </button>
      </form>
    </div>
  );
}
