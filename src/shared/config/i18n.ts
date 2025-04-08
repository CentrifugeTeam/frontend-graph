import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../lib/i18n/locales/en.json";
import ru from "../lib/i18n/locales/ru.json";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru", // Язык по умолчанию, если перевод не найден
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator", "htmlTag", "path", "subdomain"], // Порядок определения языка
      caches: ["cookie"], // Сохранение выбранного языка в куки
    },
  });

export default i18n;
