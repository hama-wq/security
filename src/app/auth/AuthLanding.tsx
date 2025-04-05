"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

export default function UpdatePasswordPage(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("❌ Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setErrorMsg(`❌ ${error.message}`);
    } else {
      setSuccessMsg("✅ Password updated successfully. Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-gray-100 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {t("update_password") || "Update Password"}
        </h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder={t("new_password") || "New Password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white"
            required
          />
          <input
            type="password"
            placeholder={t("confirm_password") || "Confirm Password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-800 text-white"
            required
          />
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading
              ? t("updating") || "Updating..."
              : t("update_password") || "Update Password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
