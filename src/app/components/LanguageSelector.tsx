"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSelector(): JSX.Element {
  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div
      onClick={handleLanguageToggle}
      className="cursor-pointer p-2 bg-gray-800 text-white rounded"
    >
      {i18n.language === "en" ? "en" : "ar"}
    </div>
  );
}
