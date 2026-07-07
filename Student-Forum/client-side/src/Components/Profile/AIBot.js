import React from 'react';

// ============================================================
// AI BOT ENGINE — Smart Student Assistant
// ============================================================

const timetableData = {
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

const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
const dayOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];

function getNextDayName() {
  const today = new Date().getDay();
  const nextDay = today === 6 ? 1 : today + 1;
  return dayNames[nextDay];
}

function getTodayDayName() {
  const today = new Date().getDay();
  return dayNames[today];
}

function formatSchedule(lessons) {
  if (!lessons || lessons.length === 0) return '  Вихідний день 🎉';
  return lessons.map((l, i) => `  ${i + 1}. ${l.time} — ${l.subject} (${l.room})`).join('\n');
}

function detectIntent(text) {
  const lower = text.toLowerCase().trim();

  // Schedule queries
  if (lower.match(/розклад|пар[аи]|занятт|урок|що завтра|що сьогодні|коли|яка пара|розклад на|пари на|schedule|timetable|class/)) {
    return 'schedule';
  }
  if (lower.match(/завтра|next day|tomorrow/)) {
    return 'schedule_tomorrow';
  }
  if (lower.match(/сьогодні|today|зараз|now/)) {
    return 'schedule_today';
  }
  if (lower.match(/понеділок|monday/)) return 'schedule_monday';
  if (lower.match(/вівторок|tuesday/)) return 'schedule_tuesday';
  if (lower.match(/середа|wednesday/)) return 'schedule_wednesday';
  if (lower.match(/четвер|thursday/)) return 'schedule_thursday';
  if (lower.match(/п'ятниця|пятниця|friday/)) return 'schedule_friday';

  // Study help
  if (lower.match(/підказ(ай|ати)|допомогти|help|порад(ь|и)|як вивчити|як здати|підготувати|підготовка|study|exam|іспит|залік|контрольна|кр|рр/)) {
    return 'study_help';
  }

  // Subject info
  if (lower.match(/програмування|c\+\+|python|java|web|бази даних|бд|кібербезпека|мереж|алгоритм|математика|предмет/)) {
    return 'subject_info';
  }

  // Greetings
  if (lower.match(/привіт|хай|hello|hi|доброго дня|добрий день|hey|здоров/)) {
    return 'greeting';
  }

  // Thanks
  if (lower.match(/дякую|thanks|thank|спасибі|дяк|мерсі/)) {
    return 'thanks';
  }

  // Bot info
  if (lower.match(/хто ти|що ти|ти хто|who are you|about you|твої можливост|що вмієш|help me|команди|command/)) {
    return 'bot_info';
  }

  // Mood / wellbeing
  if (lower.match(/втомився|втомилась|стрес|важко|не можу|не встигаю|паніка|panic|stress|tired|exhausted/)) {
    return 'wellbeing';
  }

  // Motivation
  if (lower.match(/мотивація|мотивуй|надихни|не хочу вчитися|лінь|motivation|inspire|lazy/)) {
    return 'motivation';
  }

  // Jokes
  if (lower.match(/жарт|жартануть|розсміши|смішно|joke|funny|анекдот/)) {
    return 'joke';
  }

  return 'unknown';
}

const jokes = [
  'Чому програмісти плутають Halloween з Різдвом? Тому що Oct 31 = Dec 25! 🎃🎄',
  'Програміст прийшов в магазин. Друка запитала: "Вам пакет?" Він відповів: "Ні, я просто глянути." І вийшов без покупок. 😄',
  'Є 3 способи написати безпоміковий код: жоден з них не працює. 😂',
  'Чому JavaScript — це як підліток? Тому що він робить все не так, як ви очікуєте! 😅',
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
  'програмування': '💡 Порада: Програмування вчиться через практику! Пиши код щодня, навіть 30 хвилин. Почни з малих проєктів — калькулятор, todo-list, гра. Не бійся помилок — це частина навчання!',
  'c++': '💡 C++: Почни з основ — змінні, цикли, функції. Потім вказателі та ООП. Використовуй cppreference.com як довідник. Компілюй код після кожної зміни!',
  'python': '💡 Python: Ідеальна для початку! Використовуй Jupyter Notebook для експериментів. Практикуйся на LeetCode або Codewars. Читай код інших на GitHub!',
  'java': '💡 Java: Зосередься на ООП — класи, інтерфейси, наслідування. Використовуй IntelliJ IDEA. Практикуйся з Maven/Gradle. Вивчи колекції — це часто на іспитах!',
  'web': '💡 Web-технології: HTML → CSS → JavaScript — це фундамент. Потім React або Vue. Створи свій перший сайт-портфоліо! Використовуй MDN Web Docs як довідник.',
  'бази даних': '💡 Бази даних: Почни з SQL — SELECT, INSERT, UPDATE, DELETE. Потім JOIN та підзапити. Встанови MySQL локально і практикуйся. Нормалізація — ключ до розуміння!',
  'математика': '💡 Математика: Вчи формули через розуміння, а не зубріння. Розв\'язуй задачі щодно. Використовуй Khan Academy для візуалізації. Групові заняття дуже допомагають!',
  'кібербезпека': '💡 Кібербезпека: Вивчи основи мереж (TCP/IP, DNS). Практикуйся на TryHackMe або HackTheBox. Вивчи Linux — це основа. Читай OWASP Top 10!',
  'алгоритм': '💡 Алгоритми: Почни з сортування та пошуку. Вивчи Big O нотацію. Практикуйся на LeetCode (Easy задачі). Малюй алгоритми на папері перед кодуванням!',
  'мереж': "💡 Комп'ютерні мережі: Вивчи модель OSI — це фундамент. Практикуйся з Wireshark. Налаштуй домашню мережу. Вивчи основи Cisco (CCNA) — це дуже цінно!",
};

export function generateBotResponse(userMessage, userContext = {}) {
  const { course = 4, specialty = 'Інженерія програмного забезпечення' } = userContext;
  const intent = detectIntent(userMessage);
  const effectiveCourse = course <= 2 ? 1 : 2;
  const schedule = timetableData[effectiveCourse] || timetableData[1];

  switch (intent) {
    case 'greeting': {
      const hour = new Date().getHours();
      let timeGreeting = 'Доброго дня';
      if (hour < 12) timeGreeting = 'Доброго ранку';
      else if (hour < 18) timeGreeting = 'Доброго дня';
      else timeGreeting = 'Доброго вечора';
      return `${timeGreeting}! 👋 Я твій AI-помічник студента СТЕТІ. Можу підказати розклад, допомогти з навчанням, або просто поговорити. Що тебе цікавить?`;
    }

    case 'thanks':
      return 'Будь ласки! 😊 Якщо ще будуть питання — звертайся. Успіхів у навчанні! 📚';

    case 'bot_info':
      return `🤖 Я — AI-помічник студента СТЕТІ!\n\nОсь що я вмію:\n📅 Розклад — запитай "Що завтра?" або "Розклад на понеділок"\n📚 Поради з навчання — "Як вивчити Python?"\n💪 Мотивація — "Мотивуй мене"\n😄 Жарти — "Розсміши мене"\n🧘 Підтримка — "Я втомився"\n\nПросто напиши своє питання!`;

    case 'schedule_today': {
      const today = getTodayDayName();
      const lessons = schedule[today];
      if (!lessons) {
        return `Сьогодні ${today} — вихідний! 🎉 Відпочивай і готуйся до наступного навчального дня.`;
      }
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const currentLesson = lessons.find(l => {
        const [start] = l.time.split('-');
        const [h, m] = start.split(':').map(Number);
        const lessonStart = h * 60 + m;
        const [endH, endM] = l.time.split('-')[1].split(':').map(Number);
        const lessonEnd = endH * 60 + endM;
        return currentTime >= lessonStart && currentTime <= lessonEnd;
      });
      const nextLesson = lessons.find(l => {
        const [start] = l.time.split('-');
        const [h, m] = start.split(':').map(Number);
        return h * 60 + m > currentTime;
      });
      let response = `📅 Сьогодні (${today}):\n${formatSchedule(lessons)}`;
      if (currentLesson) response += `\n\n⏰ Зараз: ${currentLesson.subject}`;
      if (nextLesson) response += `\n\n➡️ Наступна: ${nextLesson.time} — ${nextLesson.subject}`;
      return response;
    }

    case 'schedule_tomorrow': {
      const tomorrow = getNextDayName();
      const lessons = schedule[tomorrow];
      if (!lessons) {
        return `Завтра ${tomorrow} — вихідний! 🎉 Можна відпочити або підготуватися до понеділка.`;
      }
      return `📅 Завтра (${tomorrow}):\n${formatSchedule(lessons)}\n\nНе забудь підготувати все потрібне! 📚`;
    }

    case 'schedule_monday':
      return `📅 Понеділок:\n${formatSchedule(schedule['Понеділок'])}`;
    case 'schedule_tuesday':
      return `📅 Вівторок:\n${formatSchedule(schedule['Вівторок'])}`;
    case 'schedule_wednesday':
      return `📅 Середа:\n${formatSchedule(schedule['Середа'])}`;
    case 'schedule_thursday':
      return `📅 Четвер:\n${formatSchedule(schedule['Четвер'])}`;
    case 'schedule_friday':
      return `📅 П'ятниця:\n${formatSchedule(schedule["П'ятниця"])}`;

    case 'schedule': {
      // Show full week
      let response = '📅 Розклад на тиждень:\n';
      for (const day of dayOrder) {
        response += `\n${day}:\n${formatSchedule(schedule[day])}\n`;
      }
      return response;
    }

    case 'study_help': {
      // Find matching subject
      const lower = userMessage.toLowerCase();
      let foundTip = null;
      for (const [key, tip] of Object.entries(studyTips)) {
        if (lower.includes(key)) {
          foundTip = tip;
          break;
        }
      }
      if (foundTip) {
        return foundTip + '\n\nХочеш поради з іншого предмету? Просто напиши назву!';
      }
      return `📚 Поради з навчання:\n\n` +
        `1. 📝 Веди конспекти від руки — це покращує запам'ятовування\n` +
        `2. ⏰ Використовуй техніку Pomodoro (25 хв роботи, 5 хв перерви)\n` +
        `3. 🔄 Повторюй матеріал через день, тиждень, місяць\n` +
        `4. 👥 Вчися в групі — обговорення допомагає зрозуміти\n` +
        `5. 💻 Практикуйся щодня, навіть по 30 хвилин\n\n` +
        `Можеш спитати пораду з конкретного предмету!`;
    }

    case 'subject_info': {
      const lower = userMessage.toLowerCase();
      let foundTip = null;
      for (const [key, tip] of Object.entries(studyTips)) {
        if (lower.includes(key)) {
          foundTip = tip;
          break;
        }
      }
      if (foundTip) return foundTip;
      return `📖 Предмети на курсі ${course} (${specialty}):\n\n` +
        `Основні предмети включають програмування, бази даних, web-технології, математику та інші.\n\n` +
        `Напиши конкретну назву предмету, і я дам поради з його вивчення!`;
    }

    case 'wellbeing':
      return `🧘 Розумію, навчання буває важким. Ось що можу порадити:\n\n` +
        `1. 💤 Спи 7-8 годин — це критично для пам'яті\n` +
        `2. 🚶 Роби перерви — прогулянка 15 хв освіжає думки\n` +
        `3. 🍎 Харчуйся регулярно — мозок потребує енергії\n` +
        `4. 📋 Плануй день — це зменшує стрес\n` +
        `5. 🤝 Не соромся просити допомогу — в однолітків або викладачів\n\n` +
        `Пам'ятай: ти не сам/а в цьому! 💪`;

    case 'motivation':
      return motivations[Math.floor(Math.random() * motivations.length)];

    case 'joke':
      return jokes[Math.floor(Math.random() * jokes.length)];

    default:
      return `🤔 Цікаве питання! Давай я спробую допомогти.\n\n` +
        `Я можу підказати:\n` +
        `📅 Розклад — "Що завтра?"\n` +
        `📚 Поради — "Як вивчити C++?"\n` +
        `💪 Мотивація — "Мотивуй мене"\n` +
        `😄 Жарти — "Розсміши"\n\n` +
        `Спробуй одну з цих команд! 🚀`;
  }
}

export function getQuickReplies() {
  return [
    { label: '📅 Розклад на завтра', query: 'Що завтра?' },
    { label: '📅 Розклад на сьогодні', query: 'Що сьогодні?' },
    { label: '📅 Повний розклад', query: 'Покажи розклад' },
    { label: '💡 Поради з навчання', query: 'Дай поради з навчання' },
    { label: '💪 Мотивуй мене', query: 'Мотивуй мене' },
    { label: '😄 Розсміши мене', query: 'Розсміши мене' },
    { label: '🤖 Що ти вмієш?', query: 'Що ти вмієш?' },
  ];
}

export default { generateBotResponse, getQuickReplies };
