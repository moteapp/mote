import { supportedLanguages, unicodeBCP47toCLDR, unicodeCLDRtoBCP47 } from '@mote/base/common/i18n/i18n';
import i18n from 'i18next';
import backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

/**
 * Initializes i18n library, loading all available translations from the
 * API backend.
 *
 * @param defaultLanguage The default language to use if the user's language
 * is not supported.
 * @returns A promise resolving to the i18n instance
 */
export function initI18n(defaultLanguage = "en_US") {
    const lng = unicodeCLDRtoBCP47(defaultLanguage);

    void i18n
        .use(backend)
        .use(initReactI18next)
        .init({
            backend: {
                // this must match the path defined in routes. It's the path that the
                // frontend UI code will hit to load missing translations.
                loadPath: (languages: string[]) =>
                  `/locales/${unicodeBCP47toCLDR(languages[0])}.json`,
            },
            lng,
            fallbackLng: "en_US",
            supportedLngs: supportedLanguages.map(unicodeCLDRtoBCP47),
            keySeparator: false,
            returnNull: false,
        })
        .catch((err) => {
            console.error("Failed to initialize i18n", err);
        });
    return i18n;
}  