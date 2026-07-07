import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultLang = typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'uk') : 'uk';

const translations = {
  en: {
    nav: { home: 'Home', books: 'Books', pastPapers: 'Past Papers', timetable: 'Timetable', login: 'Login', register: 'Register' },
    login: { title: 'Login', email: 'Email', password: 'Password', back: 'Back', submit: 'Login', register_prompt: "Don't have an account?", register_link: 'Create account' },
    register: { title: 'Create account', name: 'Name', email: 'Email', password: 'Password', confirm_password: 'Confirm password', specialty: 'Specialty', course: 'Course', back: 'Back', submit: 'Register' },
    profile: { title: 'Profile', about: 'Project overview', subtitle: 'A web platform for student social interaction in professional education.', open_timetable: 'Open timetable', view_qa: 'View Q&A', key_strengths: 'Key strengths', subjects_title: 'Subjects for course', practical_focus: 'Practical focus', specialty_label: 'Specialty', course_label: 'Course', name_label: 'Student profile', no_subjects: 'No subjects for this course yet' },
    profileHighlights: {
      academic_focus_title: 'Academic focus',
      academic_focus_text: 'Timetable, course planning, and daily organization in one place.',
      materials_title: 'Learning materials',
      materials_text: 'Books, sample tests, and structured resources at hand.',
      qa_title: 'Questions and answers',
      qa_text: 'All questions and answers in one place for knowledge sharing.',
      concept_title: 'Project concept',
      concept_text: 'A single student platform — practical, consistent, and convenient.'
    },
    chat: { title: 'AI Assistant', status_online: 'online', placeholder: 'Ask about schedule, studies, or just say hi...', send: 'Send', copy: 'Copy', create_question: 'Create question', no_messages: "No messages — be first!", specialty_course: 'Specialty / course' }
  },
  uk: {
    nav: { home: 'Головна', books: 'Книги', pastPapers: 'Збірники', timetable: 'Розклад', login: 'Увійти', register: 'Реєстрація' },
    login: { title: 'Вхід', email: 'Електронна пошта', password: 'Пароль', back: 'Назад', submit: 'Увійти', register_prompt: 'Немає акаунта?', register_link: 'Створити акаунт' },
    register: { title: 'Реєстрація', name: 'Ім\'я', email: 'Електронна пошта', password: 'Пароль', confirm_password: 'Підтвердіть пароль', specialty: 'Спеціальність', course: 'Курс', back: 'Назад', submit: 'Зареєструватися' },
    profile: { title: 'Профіль', about: 'Про проєкт', subtitle: 'Веб‑платформа для соціальної взаємодії студентів професійної освіти.', open_timetable: 'Відкрити розклад', view_qa: 'Переглянути Q&A', key_strengths: 'Ключові переваги', subjects_title: 'Предмети курсу', practical_focus: 'Практична спрямованість', specialty_label: 'Спеціальність', course_label: 'Курс', name_label: 'Профіль студента', no_subjects: 'Для цього курсу ще немає предметів' },
    profileHighlights: {
      academic_focus_title: 'Академічний фокус',
      academic_focus_text: 'Розклад, планування курсу та щоденна організація в одному місці.',
      materials_title: 'Навчальні матеріали',
      materials_text: 'Книги, зразки контрольних та структуровані ресурси під рукою.',
      qa_title: 'Запитання та відповіді',
      qa_text: 'Усі питання та відповіді в одному місці для обміну знаннями.',
      concept_title: 'Концепція проєкту',
      concept_text: 'Єдина студентська платформа — послідовна, практична та зручна.'
    },
    chat: { title: 'AI-помічник', status_online: 'онлайн', placeholder: 'Запитай про розклад, навчання, або просто напиши привіт...', send: 'Відправити', copy: 'Копіювати', create_question: 'Створити питання', no_messages: 'Немає повідомлень — напиши першим!', specialty_course: 'Спеціальність / курс' }
  }
};

const LanguageContext = createContext({ lang: defaultLang, t: (k) => k, setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }, [lang]);

  const t = (path) => {
    const parts = path.split('.');
    let cur = translations[lang] || translations.uk;
    for (let p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return path;
    }
    return cur;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export default LanguageContext;
