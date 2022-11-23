import { createContext, useEffect, useState } from 'react'
import { TranslationsProvider } from '@eo-locale/react'

interface LocaleState {
  language: string
  setLanguage: any
  languages: Record<string, string>
}

const LANGUAGES_MAP: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  nl: 'Nederlands',
}

let initLanguage = 'en'
if (navigator.language.startsWith('fr')) {
  initLanguage = 'fr'
}

async function loadMessages(lang: string) {
  let locales = []
  let messages

  switch (lang) {
    case 'en':
      messages = await import('../../lang/en.json')
      break
    case 'fr':
      messages = await import('../../lang/fr.json')
      break
    default:
      messages = await import('../../lang/en.json')
      break
  }

  locales.push({ language: lang, messages: messages.default })

  return locales as any[]
}

const defaultContext: LocaleState = {
  language: initLanguage,
  setLanguage: () => {},
  languages: LANGUAGES_MAP,
}

const LocaleContext = createContext(defaultContext)

const LocalizationProvider = (props: any) => {
  const [language, setLanguage] = useState(initLanguage)
  const [locales, setLocales] = useState<any[]>([])

  const ctx = {
    language,
    setLanguage,
    languages: LANGUAGES_MAP,
  }

  useEffect(() => {
    loadMessages(language).then((newLocales) => {
      setLocales(newLocales)
    })
  }, [language])

  if (locales.length > 0) {
    return (
      <LocaleContext.Provider value={ctx}>
        <TranslationsProvider language={language} locales={locales}>
          {props.children}
        </TranslationsProvider>
      </LocaleContext.Provider>
    )
  } else {
    return <div>Loading language...</div>
  }
}

export { LocaleContext, type LocaleState }
export default LocalizationProvider
