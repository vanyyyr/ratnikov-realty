"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type Locale, translations, type TranslationKey } from "./i18n";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: <K extends TranslationKey>(section: K) => (typeof translations)["ru"][K];
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru");

  const t = useCallback(
    <K extends TranslationKey>(section: K): (typeof translations)["ru"][K] =>
      translations[locale][section] as (typeof translations)["ru"][K],
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}