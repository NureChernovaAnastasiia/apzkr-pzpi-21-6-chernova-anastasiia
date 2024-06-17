import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Feedback Form": "Feedback Form",
      "Movie": "Movie",
      "Select a movie": "Select a movie",
      "Rating": "Rating",
      "Comment": "Comment",
      "Submit Review": "Submit Review"
    }
  },
  ua: {
    translation: {
      "Feedback Form": "Форма зворотного зв'язку",
      "Movie": "Фільм",
      "Select a movie": "Виберіть фільм",
      "Rating": "Рейтинг",
      "Comment": "Коментар",
      "Submit Review": "Надіслати відгук"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
