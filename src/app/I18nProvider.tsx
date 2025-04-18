"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ReactNode } from "react";

export default function I18nProvider({ children }: { children: ReactNode }): JSX.Element {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
