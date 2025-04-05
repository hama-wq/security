"use client";

import { useTranslation } from 'react-i18next';

export default function SelectLanguagePage(): JSX.Element {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{t('select_language')}</h2>
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="w-full p-2 border rounded"
      >
        <option value="en">{t('english')}</option>
        <option value="ar">{t('arabic')}</option>
      </select>
    </div>
  );
}
