import React, { useState } from 'react';
import Navbar from '../NavBar/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { HelpCircle, MessageCircle, Mail, ChevronDown, ChevronUp, Bot } from 'lucide-react';

const faqData = [
    {
        q: 'Як переглянути розклад занять?',
        a: 'Натисніть на іконку годинника в навігації або перейдіть на сторінку "Розклад". Виберіть свою спеціальність, групу та семестр — і розклад відобразиться у вигляді таблиці.'
    },
    {
        q: 'Як задати питання на форумі?',
        a: 'Перейдіть на сторінку "Q&A" через навігацію або кнопку "Задати питання" на головній сторінці. Напишіть своє питання, додайте теги та натисніть "Post".'
    },
    {
        q: 'Як знайти навчальні матеріали?',
        a: 'Використовуйте розділ "Книги" для пошуку навчальних матеріалів за категоріями, або "Збірники" для перегляду минулих іспитів та контрольних робіт.'
    },
    {
        q: 'Як працює AI-помічник?',
        a: 'AI-помічник доступний на сторінці профілю. Він може підказати розклад, дати поради з навчання, підтримати мотивацію або просто поговорити. Просто напишіть повідомлення в чат!'
    },
    {
        q: 'Як змінити пароль?',
        a: 'Перейдіть до "Settings" → "Безпека" → "Змінити пароль". Або скористайтеся відповідним посиланням на головній сторінці.'
    },
    {
        q: 'Як видалити акаунт?',
        a: 'Перейдіть до "Settings" → "Безпека" → "Видалити акаунт". Увага: ця дія незворотна!'
    },
];

function Help() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="helpPage">
            <Navbar isLoggedIn={true} />
            <div className="helpPage__content">
                <h1 className="helpPage__title">❓ Help</h1>
                <p className="helpPage__subtitle">Відповіді на поширені питання та підтримка</p>

                {/* AI Assistant CTA */}
                <div className="helpPage__aiCTA">
                    <div className="helpPage__aiCTA__icon"><Bot size={28} /></div>
                    <div>
                        <h3>Потрібна допомога? Запитайте AI-помічника!</h3>
                        <p>Наш AI-помічник може підказати розклад, дати поради з навчання та відповісти на багато інших питань.</p>
                    </div>
                    <button onClick={() => window.open('/profile', '_self')}>Відкрити чат</button>
                </div>

                {/* FAQ */}
                <div className="helpPage__section">
                    <div className="helpPage__section__header">
                        <HelpCircle size={20} />
                        <h2>Часті питання</h2>
                    </div>
                    <div className="helpPage__faq">
                        {faqData.map((item, i) => (
                            <div className={`helpPage__faq__item ${openIndex === i ? 'open' : ''}`} key={i}>
                                <button className="helpPage__faq__question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                                    <span>{item.q}</span>
                                    {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {openIndex === i && (
                                    <div className="helpPage__faq__answer">{item.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="helpPage__section">
                    <div className="helpPage__section__header">
                        <MessageCircle size={20} />
                        <h2>Зв'язатися з нами</h2>
                    </div>
                    <div className="helpPage__contact">
                        <div className="helpPage__contact__item">
                            <Mail size={18} />
                            <div>
                                <strong>Email підтримки</strong>
                                <span>support@saceit.org.ua</span>
                            </div>
                        </div>
                        <div className="helpPage__contact__item">
                            <MessageCircle size={18} />
                            <div>
                                <strong>Форум Q&A</strong>
                                <span>Задайте питання на форумі — спільнота допоможе!</span>
                            </div>
                            <button onClick={() => window.open('/questions', '_self')}>Перейти</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Help;
