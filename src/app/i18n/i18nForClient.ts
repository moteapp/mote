import i18next, { i18n } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { languages, unicodeCLDRtoBCP47 } from 'mote/base/common/i18n';
import { initReactI18next, useTranslation } from 'react-i18next';

export interface I18N {
    i18n: i18n;
    resources: Record<string, any>;
    t: i18n['t'];
}

export async function initI18n(defaultLanguage = 'en_US'): Promise<i18n> {
    const lng = unicodeCLDRtoBCP47(defaultLanguage);

    await i18next
        .use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    import(`./locales/${language}/${namespace}.json`)
            )
        )
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
            lng,
            fallbackLng: lng,
            supportedLngs: languages.map(unicodeCLDRtoBCP47),
            keySeparator: false,
            returnNull: false,
        })
        .catch((err) => {
            console.error('Failed to initialize i18n', err);
        });

    return i18next;
}

initI18n('zh_CN');

export function useClientTranslation() {
    return useTranslation();
}