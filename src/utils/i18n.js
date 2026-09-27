const translations = {
  en: {
    "search.placeholder": "Search apps, files, settings...",
    "settings.title": "Settings",
    "settings.subtitle": "Personalize your virtual OS",
    "settings.language.english": "English",
    "settings.language.german": "Deutsch",
    "desktop.welcome.eyebrow": "INNOXATION",
    "desktop.welcome.title": "Welcome.",
    "desktop.welcome.body": "This is Jacob's virtual computer.",
  },
  de: {
    "search.placeholder": "Suche Apps, Dateien, Einstellungen...",
    "settings.title": "Einstellungen",
    "settings.subtitle": "Personalisieren Sie Ihr virtuelles OS",
    "settings.language.english": "Englisch",
    "settings.language.german": "Deutsch",
    "desktop.welcome.eyebrow": "INNOXATION",
    "desktop.welcome.title": "Willkommen.",
    "desktop.welcome.body": "Dies ist Jacobs virtueller Computer.",
  },
};

function getLang() {
  try {
    const l = localStorage.getItem("innox_lang");
    return l === "de" ? "de" : "en";
  } catch (e) {
    return "en";
  }
}

export default function t(key) {
  const lang = getLang();
  return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
}
