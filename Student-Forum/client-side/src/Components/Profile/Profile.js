import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Chip } from '@material-ui/core';
import {
  AccountCircle, MenuBook, Schedule, Forum, EmojiObjects
} from '@material-ui/icons';
import {
  Send, Bot, Sparkles, X, MessageCircle, ChevronDown, Copy, Check
} from 'lucide-react';
import Navbar from '../NavBar/Navbar';
import apiClient from '../../api/apiClient';
import { saceitSpecialties } from '../../data/saceit';
import { useLanguage } from '../../contexts/LanguageContext';
import { generateBotResponse, getQuickReplies } from './AIBot';

// ============================================================
// SMART AI CHAT PANEL
// ============================================================

function SmartChatPanel({ userContext }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ai_chat_history') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback((messageText) => {
    if (!messageText.trim()) return;

    const userMsg = {
      id: Date.now(),
      author: 'user',
      text: messageText.trim(),
      time: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setText('');
    setShowQuickReplies(false);
    setIsTyping(true);

    // Simulate AI thinking delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const botResponse = generateBotResponse(messageText, userContext);
      const botMsg = {
        id: Date.now() + 1,
        author: 'bot',
        text: botResponse,
        time: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setShowQuickReplies(true);
    }, delay);
  }, [userContext]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(text);
  };

  const handleQuickReply = (query) => {
    sendMessage(query);
  };

  const handleCopy = async (msgId, msgText) => {
    try {
      await navigator.clipboard.writeText(msgText);
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('ai_chat_history');
    setShowQuickReplies(true);
  };

  const quickReplies = getQuickReplies();
  const unreadCount = messages.filter(m => m.author === 'bot').length;

  // Collapsed floating button
  if (!isExpanded) {
    return (
      <div className="chatWidget">
        <button
          className="chatWidget__toggle"
          onClick={() => setIsExpanded(true)}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          {unreadCount > 0 && <span className="chatWidget__badge">{unreadCount}</span>}
          <span className="chatWidget__pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="chatPanel">
      {/* Header */}
      <div className="chatPanel__header">
        <div className="chatPanel__header__info">
          <div className="chatPanel__header__avatar">
            <Bot size={20} />
            <span className="chatPanel__header__status-dot" />
          </div>
          <div>
            <strong className="chatPanel__header__title">{t('chat.title')}</strong>
            <span className="chatPanel__header__status">{t('chat.status_online')}</span>
          </div>
        </div>
        <div className="chatPanel__header__actions">
          <button className="chatPanel__header__clear" onClick={clearChat} title="Clear chat">
            <Sparkles size={16} />
          </button>
          <button className="chatPanel__header__close" onClick={() => setIsExpanded(false)} title="Minimize">
            <ChevronDown size={18} />
          </button>
          <button className="chatPanel__header__minimize" onClick={() => setIsExpanded(false)} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Subject info bar */}
      <div className="chatPanel__subject">
        <span>🎓 {userContext.specialty}</span>
        <span>📚 {t('profile.course_label')} {userContext.course}</span>
      </div>

      {/* Messages */}
      <div className="chatPanel__messages">
        {messages.length === 0 && (
          <div className="chatPanel__welcome">
            <div className="chatPanel__welcome__icon">🤖</div>
            <h3>AI-помічник СТЕТІ</h3>
            <p>Привіт! Я твій розумний помічник. Запитай мене про розклад, навчання, або просто напиши привіт!</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`chatPanel__message ${msg.author === 'user' ? 'user' : 'bot'}`}>
            {msg.author === 'bot' && (
              <div className="chatPanel__message__avatar">
                <Bot size={16} />
              </div>
            )}
            <div className="chatPanel__message__content">
              <div className="chatPanel__message__text">{msg.text}</div>
              <div className="chatPanel__message__footer">
                <span className="chatPanel__message__time">
                  {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  className="chatPanel__message__copy"
                  onClick={() => handleCopy(msg.id, msg.text)}
                  title="Copy"
                >
                  {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chatPanel__message bot">
            <div className="chatPanel__message__avatar">
              <Bot size={16} />
            </div>
            <div className="chatPanel__message__content">
              <div className="chatPanel__typing">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && messages.length < 3 && (
        <div className="chatPanel__quickReplies">
          {quickReplies.map((qr) => (
            <button
              key={qr.label}
              className="chatPanel__quickReply"
              onClick={() => handleQuickReply(qr.query)}
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className="chatPanel__input" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('chat.placeholder')}
          className="chatPanel__input__field"
        />
        <button
          type="submit"
          className="chatPanel__input__send"
          disabled={!text.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    return null;
  }
};

const getProfileHighlights = (t) => [
  {
    icon: <Schedule size={24} />,
    title: t('profileHighlights.academic_focus_title'),
    text: t('profileHighlights.academic_focus_text'),
    gradient: 'linear-gradient(135deg, #6C63FF, #4F46E5)',
  },
  {
    icon: <MenuBook size={24} />,
    title: t('profileHighlights.materials_title'),
    text: t('profileHighlights.materials_text'),
    gradient: 'linear-gradient(135deg, #00D4AA, #00B894)',
  },
  {
    icon: <Forum size={24} />,
    title: t('profileHighlights.qa_title'),
    text: t('profileHighlights.qa_text'),
    gradient: 'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
  },
  {
    icon: <EmojiObjects size={24} />,
    title: t('profileHighlights.concept_title'),
    text: t('profileHighlights.concept_text'),
    gradient: 'linear-gradient(135deg, #FFB347, #FF9A3C)',
  },
];

function Profile() {
  const { t } = useLanguage();
  const goTo = (path) => {
    if (!window.location.href.includes(path)) {
      window.open(path, '_self');
    }
  };

  const currentUser = getStoredUser();
  const profileSpecialty = currentUser?.specialty || localStorage.getItem('profile_specialty') || saceitSpecialties[0];
  const profileCourse = Number(currentUser?.course || localStorage.getItem('profile_course') || 4);
  const profileName = currentUser?.name || 'Тимців Святослав';

  useEffect(() => {
    try {
      localStorage.setItem('profile_specialty', profileSpecialty);
      localStorage.setItem('profile_course', String(profileCourse));
    } catch (e) {}
  }, [profileSpecialty, profileCourse]);

  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    let active = true;
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.post('/timetable', { department: profileSpecialty, section: 'A', semester: profileCourse });
        if (!active) return;
        if (res?.data?.data) {
          const subs = Array.from(new Set(res.data.data.map((r) => r.subject).filter(Boolean)));
          setSubjects(subs);
        }
      } catch (e) {
        setSubjects([]);
      }
    };
    fetchSubjects();
    return () => { active = false; };
  }, [profileSpecialty, profileCourse]);

  const userContext = { specialty: profileSpecialty, course: profileCourse, name: profileName };

  return (
    <div className="profilePage">
      <Navbar isLoggedIn={true} />

      <main className="profilePage__content">
        {/* Hero Section */}
        <section className="profilePage__hero">
          <div className="profilePage__hero__identity">
            <div className="profilePage__hero__avatar">
              <AccountCircle />
            </div>
            <div>
              <p className="profilePage__hero__eyebrow">{t('profile.name_label')}</p>
              <h1>{profileName}</h1>
              <p className="profilePage__hero__subtitle">{t('profile.subtitle')}</p>
              <div className="profilePage__hero__chips">
                <Chip label="Active" className="profilePage__chip" />
                <Chip label="React + Node.js" className="profilePage__chip" />
                <Chip label="MySQL-backed" className="profilePage__chip" />
              </div>
            </div>
          </div>

          <div className="profilePage__hero__stats">
            <div className="profilePage__hero__stat">
              <span>{t('profile.specialty_label')}</span>
              <strong>{profileSpecialty}</strong>
            </div>
            <div className="profilePage__hero__stat">
              <span>{t('profile.course_label')}</span>
              <strong>{profileCourse}</strong>
            </div>
            <div className="profilePage__hero__stat">
              <span>{t('profile.practical_focus')}</span>
              <strong>Платформа студентського форуму</strong>
            </div>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="profilePage__grid">
          <article className="profilePage__card profilePage__card--wide">
            <h2>{t('profile.about')}</h2>
            <p>
              Проєкт спрямований на створення веб‑платформи для соціальної взаємодії студентів
              закладів професійної (професійно‑технічної) освіти — коледжу СТЕТІ. Платформа
              об'єднує функції перегляду розкладу, обміну навчальними матеріалами, публікації
              запитань та відповідей, а також AI‑месенджера для оперативної комунікації.
            </p>
            <p>
              Вбудований AI‑помічник допомагає студентам дізнаватися розклад, отримувати поради
              з навчання, підтримує мотивацію та завжди готовий допомогти з будь‑яким питанням.
            </p>

            <div className="profilePage__actions">
              <Button className="profilePage__actions__primary" onClick={() => goTo('/timetable')}>
                Відкрити розклад
              </Button>
              <Button className="profilePage__actions__secondary" onClick={() => goTo('/questions')}>
                Переглянути Q&A
              </Button>
            </div>
          </article>

          <article className="profilePage__card">
            <h2>{t('profile.subjects_title')}</h2>
            {subjects.length === 0 ? (
              <p className="profilePage__empty">{t('profile.no_subjects')}</p>
            ) : (
              <ul className="profilePage__subjects">
                {subjects.map((s) => (
                  <li key={s} className="profilePage__subjects__item">
                    <MenuBook size={16} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="profilePage__card">
            <h2>{t('profile.key_strengths')}</h2>
            <ul className="profilePage__list">
              <li>Адаптивний інтерфейс з очевидною навігацією</li>
              <li>Контент, що зберігається у базі даних</li>
              <li>Чітка структура сторінок та потоків даних</li>
              <li>AI‑месенджер з розумним помічником</li>
              <li>Підтримка української та англійської мов</li>
            </ul>
          </article>
        </section>

        {/* Highlights */}
        <section className="profilePage__highlights">
          {getProfileHighlights(t).map((item) => (
            <article className="profilePage__highlight" key={item.title}>
              <div className="profilePage__highlight__icon" style={{ background: item.gradient }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </section>
      </main>

      {/* AI Chat Widget */}
      <SmartChatPanel userContext={userContext} />
    </div>
  );
}

export default Profile;
