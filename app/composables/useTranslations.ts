import { translations } from '~/utils/translations'

export const useTranslations = () => {
    const locale = useState<string>('locale', () => 'en')

    const t = (key: string) => {
        const keys = key.split('.')
        let value: unknown = translations[locale.value as keyof typeof translations]

        for (const k of keys) {
            if (value && (value as Record<string, unknown>)[k]) {
                value = (value as Record<string, unknown>)[k]
            } else {
                return key // Fallback to key if not found
            }
        }

        return value
    }

    return {
        t,
        locale
    }
}
