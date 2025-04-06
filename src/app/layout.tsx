// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import I18nProvider from "./I18nProvider";
import LanguageSelector from "./components/LanguageSelector";
import Head from "next/head";

export const metadata = {
  title: "Security App",
  description: "A secure, futuristic app with sleek authentication",
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="A secure, futuristic app with sleek authentication" />
        <meta charSet="UTF-8" />
        <title>Security App</title>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      </Head>
      <body>
        <I18nProvider>
          {/* Fixed language toggle in the top-right */}
          <LanguageSelector />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
