export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** A piece of copy: either the same in every language, or one string per locale. */
export type Text = string | Record<Locale, string>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function t(text: Text, locale: Locale): string {
  return typeof text === "string" ? text : text[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "fr" : "en";
}
