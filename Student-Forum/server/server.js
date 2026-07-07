require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple request logger to show Authorization header for demo
app.use((req, res, next) => {
  try {
    console.log('[server] incoming', req.method, req.url, 'Authorization:', req.headers.authorization || '<none>');
  } catch (e) {}
  next();
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const saceitSpecialties = [
  'Інженерія програмного забезпечення',
  'Менеджмент',
  'Торгівля (Комерційна діяльність та логістика)',
  'Туризм та рекреація',
  'Готельно-ресторанна справа та кейтеринг',
  'Кібербезпека та захист інформації',
  "Автоматизація, комп'ютерно-інтегровані технології та робототехніка",
];

const bookCatalog = {
  'Програмування': [
    { book_name: 'C++ Reference', book_author: 'cppreference', book_file: 'https://en.cppreference.com/w/' },
    { book_name: 'Python 3 Documentation', book_author: 'Python Software Foundation', book_file: 'https://docs.python.org/3/' },
  ],
  'Web-технології': [
    { book_name: 'MDN Web Docs', book_author: 'Mozilla', book_file: 'https://developer.mozilla.org/' },
    { book_name: 'HTML Living Standard', book_author: 'WHATWG', book_file: 'https://html.spec.whatwg.org/' },
  ],
  'Бази даних': [
    { book_name: 'MySQL 8.0 Reference Manual', book_author: 'Oracle', book_file: 'https://dev.mysql.com/doc/' },
    { book_name: 'PostgreSQL Documentation', book_author: 'PostgreSQL Global Development Group', book_file: 'https://www.postgresql.org/docs/' },
  ],
  "Комп'ютерна графіка": [
    { book_name: 'Blender Manual', book_author: 'Blender Foundation', book_file: 'https://docs.blender.org/manual/en/latest/' },
    { book_name: 'Krita Manual', book_author: 'Krita Foundation', book_file: 'https://docs.krita.org/' },
  ],
  'Кібербезпека': [
    { book_name: 'OWASP Top 10', book_author: 'OWASP', book_file: 'https://owasp.org/www-project-top-ten/' },
    { book_name: 'CIS Controls', book_author: 'Center for Internet Security', book_file: 'https://www.cisecurity.org/controls' },
  ],
  'Автоматизація': [
    { book_name: 'PLCopen Resources', book_author: 'PLCopen', book_file: 'https://plcopen.org/' },
    { book_name: 'Robotics Overview', book_author: 'NASA', book_file: 'https://www.nasa.gov/learning-resources/for-kids-and-students/what-is-robotics/' },
  ],
  'Менеджмент': [
    { book_name: 'Management Basics', book_author: 'OpenStax', book_file: 'https://openstax.org/' },
    { book_name: 'Project Management Guide', book_author: 'Atlassian', book_file: 'https://www.atlassian.com/work-management/project-management' },
  ],
  'Торгівля та логістика': [
    { book_name: 'Logistics Management', book_author: 'OpenLearn', book_file: 'https://www.open.edu/openlearn/' },
    { book_name: 'Supply Chain Basics', book_author: 'SAP', book_file: 'https://www.sap.com/products/scm.html' },
  ],
  'Туризм та рекреація': [
    { book_name: 'Tourism Resources', book_author: 'UNWTO', book_file: 'https://www.unwto.org/' },
    { book_name: 'Travel Industry Overview', book_author: 'IATA', book_file: 'https://www.iata.org/' },
  ],
  'Готельно-ресторанна справа': [
    { book_name: 'Hospitality Management', book_author: 'OpenStax', book_file: 'https://openstax.org/' },
    { book_name: 'Food Safety and Hospitality Basics', book_author: 'FAO', book_file: 'https://www.fao.org/' },
  ],
};

const paperSubjects = [
  'Програмування C++', 'Java', 'Python', 'Web-технології', 'Бази даних',
  "Комп'ютерні мережі", 'Кібербезпека', 'Менеджмент', 'Маркетинг',
  'Туризм та рекреація', 'Готельно-ресторанна справа',
];

function mapBookRows(rows, fallbackType) {
  return rows.map((row, index) => ({
    book_name: row.book_name ?? row.title ?? `${fallbackType} ${index + 1}`,
    book_author: row.book_author ?? row.author ?? 'SACEIT',
    book_file: row.book_file ?? row.file_url ?? row.url ?? '#',
    type: row.type ?? fallbackType,
  }));
}

function fallbackBooksForType(type) {
  const normalizedType = type || 'Програмування';
  const catalog = bookCatalog[normalizedType] || [
    { book_name: `${normalizedType} 1`, book_author: 'SACEIT', book_file: 'https://saceit.org.ua/specialities/' },
    { book_name: `${normalizedType} 2`, book_author: 'SACEIT', book_file: 'https://saceit.org.ua/specialities/' },
  ];
  return catalog.map((book) => ({ ...book, type: normalizedType }));
}

function mapPastPaperRows(rows, fallbackSubject, fallbackYear) {
  return rows.map((row, index) => ({
    paper_subject: row.paper_subject ?? row.subject ?? fallbackSubject,
    paper_year: row.paper_year ?? row.year ?? fallbackYear,
    paper_image: row.paper_image ?? row.file_url ?? row.url ?? `https://saceit.org.ua/page/${index + 1}/`,
  }));
}

function fallbackPastPapers(subject, year) {
  return [{ paper_subject: subject, paper_year: year, paper_image: 'https://saceit.org.ua/specialities/' }];
}

function buildTimetableRows(department, semester) {
  const isTech = Boolean(
    department && (
      saceitSpecialties.slice(0, 2).includes(department) ||
      department.includes('Інженерія') ||
      department.includes('Кібербезпека') ||
      department.includes('Автоматизація')
    )
  );

  const techSemester1 = [
    { Day: 'Понеділок', L1: 'Програмування C++', L2: 'Вища математика', L3: 'Англійська мова', L4: 'Інформатика', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Вівторок', L1: 'Українська мова', L2: 'Алгоритмізація', L3: 'Фізичне виховання', L4: 'Основи ІТ', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Середа', L1: 'Бази даних', L2: 'Web-технології', L3: 'Дискретна математика', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Четвер', L1: "Комп'ютерна графіка", L2: 'Операційні системи', L3: 'Апаратне забезпечення', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: "П'ятниця", L1: 'Кураторська година', L2: 'Практика', L3: '', L4: '', L5: '', L6: '', L7: '', L8: '' },
  ];

  const techSemester2 = [
    { Day: 'Понеділок', L1: 'Java', L2: 'Бази даних', L3: 'Англійська мова', L4: 'Охорона праці', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Вівторок', L1: 'Python', L2: 'Web-технології', L3: 'Вища математика', L4: 'Фізичне виховання', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Середа', L1: 'Кібербезпека', L2: 'Компютерні мережі', L3: 'Програмна інженерія', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Четвер', L1: 'Операційні системи', L2: 'Дискретна математика', L3: 'Практика', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: "П'ятниця", L1: 'Кураторська година', L2: 'Самостійна робота', L3: '', L4: '', L5: '', L6: '', L7: '', L8: '' },
  ];

  const businessSemester1 = [
    { Day: 'Понеділок', L1: 'Економічна теорія', L2: 'Менеджмент', L3: 'Англійська мова', L4: 'Інформатика', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Вівторок', L1: 'Українська мова', L2: 'Маркетинг', L3: 'Фізичне виховання', L4: 'Основи підприємництва', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Середа', L1: 'Бухоблік', L2: 'Логістика', L3: 'Етика ділового спілкування', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Четвер', L1: 'Туризм та рекреація', L2: 'Готельно-ресторанна справа', L3: 'Практика', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Пятниця', L1: 'Кураторська година', L2: 'Самостійна робота', L3: '', L4: '', L5: '', L6: '', L7: '', L8: '' },
  ];

  const businessSemester2 = [
    { Day: 'Понеділок', L1: 'Менеджмент', L2: 'Маркетинг', L3: 'Англійська мова', L4: 'Інформатика', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Вівторок', L1: 'Логістика', L2: 'Економіка підприємства', L3: 'Фізичне виховання', L4: 'Основи права', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Середа', L1: 'Торгівля та комерційна діяльність', L2: 'Туризм та рекреація', L3: 'Бухоблік', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: 'Четвер', L1: 'Готельно-ресторанна справа', L2: 'Охорона праці', L3: 'Практика', L4: '', L5: '', L6: '', L7: '', L8: '' },
    { Day: "П'ятниця", L1: 'Кураторська година', L2: 'Самостійна робота', L3: '', L4: '', L5: '', L6: '', L7: '', L8: '' },
  ];

  const sourceRows = semester === 2
    ? (isTech ? techSemester2 : businessSemester2)
    : (isTech ? techSemester1 : businessSemester1);

  return sourceRows;
}

function mapTimetableRows(rows) {
  const orderedDays = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];
  return orderedDays.map((dayName) => {
    const dayRows = rows.filter((row) => row.day_of_week === dayName);
    return {
      Day: dayName,
      L1: dayRows[0]?.subject || '',
      L2: dayRows[1]?.subject || '',
      L3: dayRows[2]?.subject || '',
      L4: dayRows[3]?.subject || '',
      L5: dayRows[4]?.subject || '',
      L6: dayRows[5]?.subject || '',
      L7: dayRows[6]?.subject || '',
      L8: dayRows[7]?.subject || '',
    };
  });
}

function parseQuestionTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (error) {
      return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
  }
  return [];
}

function buildQuestionsPayload(questionRows, answerRows) {
  const answersByQuestionId = answerRows.reduce((acc, answerRow) => {
    const questionId = answerRow.question_id;
    if (!acc[questionId]) acc[questionId] = [];
    acc[questionId].push({
      id: answerRow.id,
      question_id: answerRow.question_id,
      user_name: answerRow.user_name || 'Анонім',
      message: answerRow.message,
      created_at: answerRow.created_at,
    });
    return acc;
  }, {});

  return questionRows.map((questionRow) => ({
    id: questionRow.id,
    user_name: questionRow.user_name || 'Анонім',
    message: questionRow.message,
    tags: parseQuestionTags(questionRow.tags),
    created_at: questionRow.created_at,
    answers: answersByQuestionId[questionRow.id] || [],
  }));
}

// ============================================================
// AI CHATBOT ENGINE (Server-side)
// ============================================================

const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
const dayOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];

const timetableDb = {
  1: {
    'Понеділок': [
      { time: '8:00-9:00', subject: 'Програмування C++', room: '301' },
      { time: '9:00-10:00', subject: 'Вища математика', room: '205' },
      { time: '10:00-11:00', subject: 'Англійська мова', room: '412' },
      { time: '11:00-12:00', subject: 'Інформатика', room: '302' },
    ],
    'Вівторок': [
      { time: '8:00-9:00', subject: 'Українська мова', room: '101' },
      { time: '9:00-10:00', subject: 'Алгоритмізація', room: '301' },
      { time: '10:00-11:00', subject: 'Фізичне виховання', room: 'Спортзал' },
      { time: '11:00-12:00', subject: 'Основи ІТ', room: '303' },
    ],
    'Середа': [
      { time: '8:00-9:00', subject: 'Бази даних', room: '304' },
      { time: '9:00-10:00', subject: 'Web-технології', room: '301' },
      { time: '10:00-11:00', subject: 'Дискретна математика', room: '205' },
    ],
    'Четвер': [
      { time: '8:00-9:00', subject: "Комп'ютерна графіка", room: '305' },
      { time: '9:00-10:00', subject: 'Операційні системи', room: '301' },
      { time: '10:00-11:00', subject: 'Апаратне забезпечення', room: '306' },
    ],
    "П'ятниця": [
      { time: '8:00-9:00', subject: 'Кураторська година', room: '201' },
      { time: '9:00-10:00', subject: 'Практика', room: '301' },
    ],
  },
  2: {
    'Понеділок': [
      { time: '8:00-9:00', subject: 'Java', room: '301' },
      { time: '9:00-10:00', subject: 'Бази даних', room: '304' },
      { time: '10:00-11:00', subject: 'Англійська мова', room: '412' },
      { time: '11:00-12:00', subject: 'Охорона праці', room: '201' },
    ],
    'Вівторок': [
      { time: '8:00-9:00', subject: 'Python', room: '301' },
      { time: '9:00-10:00', subject: 'Web-технології', room: '301' },
      { time: '10:00-11:00', subject: 'Вища математика', room: '205' },
      { time: '11:00-12:00', subject: 'Фізичне виховання', room: 'Спортзал' },
    ],
    'Середа': [
      { time: '8:00-9:00', subject: 'Кібербезпека', room: '307' },
      { time: '9:00-10:00', subject: "Комп'ютерні мережі", room: '301' },
      { time: '10:00-11:00', subject: 'Програмна інженерія', room: '303' },
    ],
    'Четвер': [
      { time: '8:00-9:00', subject: 'Операційні системи', room: '301' },
      { time: '9:00-10:00', subject: 'Дискретна математика', room: '205' },
      { time: '10:00-11:00', subject: 'Практика', room: '301' },
    ],
    "П'ятниця": [
      { time: '8:00-9:00', subject: 'Кураторська година', room: '201' },
      { time: '9:00-10:00', subject: 'Самостійна робота', room: 'Читальна зала' },
    ],
  },
};

const jokes = [
  'Чому програмісти плутають Halloween з Різдвом? Тому що Oct 31 = Dec 25! 🎃🎄',
  'Програміст прийшов в магазин. Друка запитала: "Вам пакет?" Він відповів: "Ні, я просто глянути." І вийшов без покупок. 😄',
  'Є 3 способи написати безпоміковий код: жоден з них не працює. 😂',
  'Студент каже викладачу: "Я не списував, я просто перевіряв, чи мій друг теж не знає відповідь!" 🤓',
  'Якщо код працює — не чіпайте. Якщо не працює — все одно не чіпайте. Може само запрацює! 💻',
];

const motivations = [
  '💪 Кожен вивчений урок — це крок до успіху! Ти вже на правильному шляху!',
  '🌟 Пам\'ятай: всі великі програмісти колись не знали, що таке "Hello World". Ти зможеш!',
  '🚀 Складно — не означає неможливо. Розбий велике завдання на маленькі кроки!',
  '🎯 Фокус на процесі, а не на результаті. Результат прийде сам!',
  '📚 Навчання — це інвестиція в себе, яка завжди окупається!',
  '🔥 Ти вже тут, ти вже навчаєшся. Це вже більше, ніж робить більшість людей!',
];

const studyTips = {
  'програмування': '💡 Програмування вчиться через практику! Пиши код щодня, навіть 30 хвилин. Почни з малих проєктів — калькулятор, todo-list, гра.',
  'c++': '💡 C++: Почни з основ — змінні, цикли, функції. Потім вказателі та ООП. Компілюй код після кожної зміни!',
  'python': '💡 Python: Ідеальна для початку! Практикуйся на LeetCode або Codewars. Читай код інших на GitHub!',
  'java': '💡 Java: Зосередься на ООП — класи, інтерфейси, наслідування. Практикуйся з Maven/Gradle.',
  'web': '💡 Web: HTML → CSS → JavaScript — фундамент. Потім React або Vue. Створи свій перший сайт-портфоліо!',
  'бази даних': '💡 БД: Почни з SQL — SELECT, INSERT, UPDATE, DELETE. Потім JOIN та підзапити. Нормалізація — ключ!',
  'математика': '💡 Математика: Вчи формули через розуміння, а не зубріння. Розв\'язуй задачі щодно.',
  'кібербезпека': '💡 Кібербезпека: Вивчи основи мереж (TCP/IP, DNS). Практикуйся на TryHackMe. Читай OWASP Top 10!',
  'алгоритм': '💡 Алгоритми: Почни з сортування та пошуку. Вивчи Big O нотацію. Практикуйся на LeetEasy!',
};

function getNextDayName() {
  const today = new Date().getDay();
  const nextDay = today === 6 ? 1 : today + 1;
  return dayNames[nextDay];
}

function getTodayDayName() {
  return dayNames[new Date().getDay()];
}

function formatSchedule(lessons) {
  if (!lessons || lessons.length === 0) return '  Вихідний день 🎉';
  return lessons.map((l, i) => `  ${i + 1}. ${l.time} — ${l.subject} (${l.room})`).join('\n');
}

function detectIntent(text) {
  const lower = text.toLowerCase().trim();
  if (lower.match(/розклад|пар[аи]|занятт|урок|що завтра|що сьогодні|коли|яка пара|розклад на|пари на|schedule|timetable|class/)) return 'schedule';
  if (lower.match(/завтра|next day|tomorrow/)) return 'schedule_tomorrow';
  if (lower.match(/сьогодні|today|зараз|now/)) return 'schedule_today';
  if (lower.match(/понеділок|monday/)) return 'schedule_monday';
  if (lower.match(/вівторок|tuesday/)) return 'schedule_tuesday';
  if (lower.match(/середа|wednesday/)) return 'schedule_wednesday';
  if (lower.match(/четвер|thursday/)) return 'schedule_thursday';
  if (lower.match(/п'ятниця|пятниця|friday/)) return 'schedule_friday';
  if (lower.match(/підказ(ай|ати)|допомогти|help|порад(ь|и)|як вивчити|як здати|підготувати|study|exam|іспит|залік|контрольна/)) return 'study_help';
  if (lower.match(/програмування|c\+\+|python|java|web|бази даних|бд|кібербезпека|мереж|алгоритм|математика|предмет/)) return 'subject_info';
  if (lower.match(/привіт|хай|hello|hi|доброго дня|добрий день|hey|здоров/)) return 'greeting';
  if (lower.match(/дякую|thanks|thank|спасибі|дяк|мерсі/)) return 'thanks';
  if (lower.match(/хто ти|що ти|ти хто|who are you|about you|твої можливост|що вмієш|help me|команди/)) return 'bot_info';
  if (lower.match(/втомився|втомилась|стрес|важко|не можу|не встигаю|паніка|panic|stress|tired/)) return 'wellbeing';
  if (lower.match(/мотивація|мотивуй|надихни|не хочу вчитися|мотivation|inspire|lazy/)) return 'motivation';
  if (lower.match(/жарт|жартануть|розсміши|смішно|joke|funny|анекдот/)) return 'joke';
  return 'unknown';
}

function generateAIResponse(userMessage, userContext = {}) {
  const { course = 4 } = userContext;
  const intent = detectIntent(userMessage);
  const effectiveCourse = course <= 2 ? 1 : 2;
  const schedule = timetableDb[effectiveCourse] || timetableDb[1];

  switch (intent) {
    case 'greeting': {
      const hour = new Date().getHours();
      let timeGreeting = 'Доброго дня';
      if (hour < 12) timeGreeting = 'Доброго ранку';
      else if (hour < 18) timeGreeting = 'Доброго дня';
      else timeGreeting = 'Доброго вечора';
      return `${timeGreeting}! 👋 Я AI-помічник студента СТЕТІ. Можу підказати розклад, допомогти з навчанням, або просто поговорити. Що тебе цікавить?`;
    }
    case 'thanks':
      return 'Будь ласки! 😊 Звертайся, якщо будуть питання. Успіхів! 📚';
    case 'bot_info':
      return '🤖 Я — AI-помічник СТЕТІ!\n\nОсь що я вмію:\n📅 Розклад — "Що завтра?"\n📚 Поради — "Як вивчити Python?"\n💪 Мотивація — "Мотивуй мене"\n😄 Жарти — "Розсміши"\n🧘 Підтримка — "Я втомився"\n\nПросто напиши своє питання!';
    case 'schedule_today': {
      const today = getTodayDayName();
      const lessons = schedule[today];
      if (!lessons) return `Сьогодні ${today} — вихідний! 🎉`;
      return `📅 Сьогодні (${today}):\n${formatSchedule(lessons)}`;
    }
    case 'schedule_tomorrow': {
      const tomorrow = getNextDayName();
      const lessons = schedule[tomorrow];
      if (!lessons) return `Завтра ${tomorrow} — вихідний! 🎉`;
      return `📅 Завтра (${tomorrow}):\n${formatSchedule(lessons)}\n\nНе забудь підготувати все потрібне! 📚`;
    }
    case 'schedule_monday': return `📅 Понеділок:\n${formatSchedule(schedule['Понеділок'])}`;
    case 'schedule_tuesday': return `📅 Вівторок:\n${formatSchedule(schedule['Вівторок'])}`;
    case 'schedule_wednesday': return `📅 Середа:\n${formatSchedule(schedule['Середа'])}`;
    case 'schedule_thursday': return `📅 Четвер:\n${formatSchedule(schedule['Четвер'])}`;
    case 'schedule_friday': return `📅 П'ятниця:\n${formatSchedule(schedule["П'ятниця"])}`;
    case 'schedule': {
      let response = '📅 Розклад на тиждень:\n';
      for (const day of dayOrder) {
        response += `\n${day}:\n${formatSchedule(schedule[day])}\n`;
      }
      return response;
    }
    case 'study_help': {
      const lower = userMessage.toLowerCase();
      for (const [key, tip] of Object.entries(studyTips)) {
        if (lower.includes(key)) return tip + '\n\nХочеш поради з іншого предмету?';
      }
      return '📚 Поради:\n1. 📝 Веди конспекти\n2. ⏰ Pomodoro (25/5)\n3. 🔄 Повторюй через день\n4. 👥 Вчися в групі\n5. 💻 Практикуйся щоденно';
    }
    case 'subject_info': {
      const lower = userMessage.toLowerCase();
      for (const [key, tip] of Object.entries(studyTips)) {
        if (lower.includes(key)) return tip;
      }
      return '📖 Напиши конкретну назву предмету, і я дам поради з його вивчення!';
    }
    case 'wellbeing':
      return '🧘 Розумію, навчання буває важким:\n1. 💤 Спи 7-8 годин\n2. 🚶 Роби перерви\n3. 🍎 Харчуйся регулярно\n4. 📋 Плануй день\n5. 🤝 Проси допомогу\n\nПам\'ятай: ти не сам/а! 💪';
    case 'motivation':
      return motivations[Math.floor(Math.random() * motivations.length)];
    case 'joke':
      return jokes[Math.floor(Math.random() * jokes.length)];
    default:
      return '🤔 Цікаве питання! Я можу:\n📅 Розклад — "Що завтра?"\n📚 Поради — "Як вивчити C++?"\n💪 Мотивація — "Мотивуй"\n😄 Жарти — "Розсміши"\n\nСпробуй одну з команд! 🚀';
  }
}

// Error handling for pool
pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err);
});

// Test DB connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  }
}

async function ensureUserProfileColumns() {
  const connection = await pool.getConnection();
  try {
    const [specialtyColumns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'specialty'`
    );
    if (specialtyColumns.length === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN specialty VARCHAR(255) NULL');
    }
    const [courseColumns] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'course'`
    );
    if (courseColumns.length === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN course INT NULL');
    }
  } finally {
    connection.release();
  }
}

// ============================================================
// ROUTES
// ============================================================

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(422).json({ message: 'Email and password required' });
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = rows[0];
    if (user.password !== password) return res.status(404).json({ message: 'Invalid credentials' });
    res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name, specialty: user.specialty, course: user.course } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { name, email, user_password, confirm_password, specialty, course } = req.body;
    if (!name || !email || !user_password || !confirm_password || !specialty || !course) return res.status(422).json({ message: 'All fields required' });
    if (user_password !== confirm_password) return res.status(403).json({ message: 'Passwords do not match' });
    const connection = await pool.getConnection();
    const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) { connection.release(); return res.status(403).json({ message: 'User already exists' }); }
    await connection.query('INSERT INTO users (name, email, password, specialty, course) VALUES (?, ?, ?, ?, ?)', [name, email, user_password, specialty, Number(course)]);
    connection.release();
    res.status(200).json({ message: 'User registered successfully', user: { name, email, specialty, course: Number(course) } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CHANGE PASSWORD
app.post('/changePassword', async (req, res) => {
  try {
    const { email, user_password, confirmPassword } = req.body;
    if (!email || !user_password || !confirmPassword) return res.status(422).json({ message: 'All fields required' });
    if (user_password !== confirmPassword) return res.status(403).json({ message: 'Passwords do not match' });
    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [user_password, email]);
    connection.release();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE USER
app.post('/deleteUser', async (req, res) => {
  try {
    const { email, user_password } = req.body;
    if (!email || !user_password) return res.status(422).json({ message: 'Email and password required' });
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, user_password]);
    if (rows.length === 0) { connection.release(); return res.status(404).json({ message: 'Invalid email or password' }); }
    await connection.query('DELETE FROM users WHERE email = ?', [email]);
    connection.release();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET BOOKS
app.post('/books', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) return res.status(422).json({ message: 'Book type required' });
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM books WHERE type = ?', [type]);
      connection.release();
      const booksData = rows.length > 0 ? mapBookRows(rows, type) : fallbackBooksForType(type);
      res.status(200).json({ booksData });
    } catch (tableError) {
      connection.release();
      res.status(200).json({ booksData: fallbackBooksForType(type) });
    }
  } catch (error) {
    console.error('Books error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET TIMETABLE
app.post('/timetable', async (req, res) => {
  try {
    const { department, section, semester } = req.body;
    if (!department || !section || !semester) return res.status(422).json({ message: 'All fields required' });
    const connection = await pool.getConnection();
    let rows = [];
    try {
      const [dbRows] = await connection.query('SELECT * FROM timetable WHERE department = ? AND section = ? AND semester = ? ORDER BY id ASC', [department, section, semester]);
      rows = dbRows;
    } catch (queryError) { rows = []; }
    connection.release();
    const data = rows.length > 0 ? mapTimetableRows(rows) : buildTimetableRows(department, Number(semester));
    res.status(200).json({ data });
  } catch (error) {
    console.error('Timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET PAST PAPERS
app.post('/pastpapers', async (req, res) => {
  try {
    const { Year, subject } = req.body;
    if (!Year || !subject) return res.status(422).json({ message: 'Year and subject required' });
    const connection = await pool.getConnection();
    let rows = [];
    try {
      const [dbRows] = await connection.query('SELECT * FROM pastpapers WHERE year = ? AND subject = ?', [Year, subject]);
      rows = dbRows;
    } catch (queryError) { rows = []; }
    connection.release();
    const pastPaperData = rows.length > 0 ? mapPastPaperRows(rows, subject, Year) : fallbackPastPapers(subject, Year);
    res.status(200).json({ pastPaperData });
  } catch (error) {
    console.error('Past papers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// QUESTIONS
app.get('/questions', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [questionRows] = await connection.query('SELECT id, user_name, message, tags, created_at FROM questions ORDER BY created_at DESC, id DESC');
    const [answerRows] = await connection.query('SELECT id, question_id, user_name, message, created_at FROM question_answers ORDER BY created_at ASC, id ASC');
    connection.release();
    res.status(200).json({ questions: buildQuestionsPayload(questionRows, answerRows) });
  } catch (error) {
    console.error('Questions load error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/questions', async (req, res) => {
  try {
    const { user_name, message, tags } = req.body;
    if (!message || !message.trim()) return res.status(422).json({ message: 'Message required' });
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO questions (user_name, message, tags) VALUES (?, ?, ?)', [user_name && user_name.trim() ? user_name.trim() : 'Анонім', message.trim(), JSON.stringify(parseQuestionTags(tags))]);
    connection.release();
    res.status(201).json({ message: 'Question created successfully', id: result.insertId });
  } catch (error) {
    console.error('Question create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/questions/:questionId/answers', async (req, res) => {
  try {
    const { questionId } = req.params;
    const { user_name, message } = req.body;
    if (!message || !message.trim()) return res.status(422).json({ message: 'Message required' });
    const connection = await pool.getConnection();
    const [questionRows] = await connection.query('SELECT id FROM questions WHERE id = ?', [questionId]);
    if (questionRows.length === 0) { connection.release(); return res.status(404).json({ message: 'Question not found' }); }
    const [result] = await connection.query('INSERT INTO question_answers (question_id, user_name, message) VALUES (?, ?, ?)', [questionId, user_name && user_name.trim() ? user_name.trim() : 'Анонім', message.trim()]);
    connection.release();
    res.status(201).json({ message: 'Answer created successfully', id: result.insertId });
  } catch (error) {
    console.error('Answer create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================
// AI CHATBOT API
// ============================================================

// POST /api/chat — Send a message to the AI bot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(422).json({ message: 'Message required' });
    }

    const response = generateAIResponse(message, userContext || {});

    // Optionally save chat history to DB
    try {
      const connection = await pool.getConnection();
      await connection.query(
        'INSERT IF EXISTS INTO chat_history (user_message, bot_response, user_context, created_at) VALUES (?, ?, ?, NOW())',
        [message.trim(), response, JSON.stringify(userContext || {})]
      );
      connection.release();
    } catch (dbError) {
      // Silently fail — chat history is optional
    }

    res.status(200).json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/chat/quick-replies — Get quick reply suggestions
app.get('/api/chat/quick-replies', (req, res) => {
  res.status(200).json({
    quickReplies: [
      { label: '📅 Розклад на завтра', query: 'Що завтра?' },
      { label: '📅 Розклад на сьогодні', query: 'Що сьогодні?' },
      { label: '📅 Повний розклад', query: 'Покажи розклад' },
      { label: '💡 Поради з навчання', query: 'Дай поради з навчання' },
      { label: '💪 Мотивуй мене', query: 'Мотивуй мене' },
      { label: '😄 Розсміши мене', query: 'Розсміши мене' },
      { label: '🤖 Що ти вмієш?', query: 'Що ти вмієш?' },
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;

testConnection().then(() => ensureUserProfileColumns()).then(() => {
  app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ Database: ${process.env.DB_NAME}`);
    console.log(`✓ AI Chatbot: /api/chat`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
