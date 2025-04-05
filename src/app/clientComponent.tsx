"use client";

import { useState } from "react";
import LoginPage from "./auth/login/page";
import SignupPage from "./auth/signup/page";
import ForgotPasswordPage from "./auth/forgot-password/page";
import LoginWithPhonePage from "./auth/login-with-phone/page";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ClientComponent(): JSX.Element {
  const { i18n } = useTranslation();
  // Default view is login
  const [view, setView] = useState<"login" | "signup" | "forgot-password" | "login-with-phone" | "none">("login");

  const handleLanguageChange = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const renderPage = () => {
    switch (view) {
      case "login":
        return <LoginPage />;
      case "signup":
        return <SignupPage />;
      case "forgot-password":
        return <ForgotPasswordPage />;
      case "login-with-phone":
        return <LoginWithPhonePage />;
      default:
        return <div className="text-xl">Please select an option below.</div>;
    }
  };

  return (
    <div className="text-center mt-8 relative">
      {/* Language toggle box in the top-right corner */}
      <div
        onClick={handleLanguageChange}
        className="absolute top-4 right-4 cursor-pointer p-2 bg-gray-800 text-white rounded"
      >
        {i18n.language === "en" ? "en" : "ar"}
      </div>

      {/* Navigation buttons */}
      <div className="space-y-4">
        <button onClick={() => setView("login")} className="px-6 py-2 bg-blue-600 text-white rounded w-full">
          Login
        </button>
        <button onClick={() => setView("login-with-phone")} className="px-6 py-2 bg-blue-600 text-white rounded w-full">
          Login with Phone
        </button>
        <button onClick={() => setView("signup")} className="px-6 py-2 bg-green-600 text-white rounded w-full">
          Create Account
        </button>
        <button onClick={() => setView("forgot-password")} className="px-6 py-2 bg-red-600 text-white rounded w-full">
          Forgot Password?
        </button>
      </div>

      {/* Render the selected page */}
      <div className="mt-8">{renderPage()}</div>
    </div>
  );
}
