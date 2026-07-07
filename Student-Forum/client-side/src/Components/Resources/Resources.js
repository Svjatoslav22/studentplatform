import React from 'react';
import Navbar from '../NavBar/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { Book, FileText, Download, ExternalLink } from 'lucide-react';

const resourcesList = [
    {
        category: 'Програмування',
        icon: <Book size={20} />,
        items: [
            { name: 'C++ Reference', url: 'https://en.cppreference.com/w/', desc: 'Повний довідник по C++' },
            { name: 'Python 3 Documentation', url: 'https://docs.python.org/3/', desc: 'Офіційна документація Python' },
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', desc: 'Документація по Web-технологіям' },
        ]
    },
    {
        category: 'Бази даних',
        icon: <FileText size={20} />,
        items: [
            { name: 'MySQL 8.0 Reference', url: 'https://dev.mysql.com/doc/', desc: 'Документація MySQL' },
            { name: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/', desc: 'Документація PostgreSQL' },
        ]
    },
    {
        category: 'Кібербезпека',
        icon: <Download size={20} />,
        items: [
            { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', desc: 'Топ-10 вразливостей веб-додатків' },
            { name: 'CIS Controls', url: 'https://www.cisecurity.org/controls', desc: 'Контролі безпеки CIS' },
        ]
    },
    {
        category: 'Інше',
        icon: <ExternalLink size={20} />,
        items: [
            { name: 'SACEIT', url: 'https://saceit.org.ua/', desc: 'Офіційний сайт коледжу' },
            { name: 'Khan Academy', url: 'https://www.khanacademy.org/', desc: 'Безкоштовні курси з математики та програмування' },
        ]
    },
];

function Resources() {
    const { t } = useLanguage();

    return (
        <div className="resourcesPage">
            <Navbar isLoggedIn={true} />
            <div className="resourcesPage__content">
                <h1 className="resourcesPage__title">📚 Resources</h1>
                <p className="resourcesPage__subtitle">Корисні навчальні матеріали та ресурси для студентів СТЕТІ</p>

                <div className="resourcesPage__grid">
                    {resourcesList.map((cat) => (
                        <div className="resourcesPage__card" key={cat.category}>
                            <div className="resourcesPage__card__header">
                                <span className="resourcesPage__card__icon">{cat.icon}</span>
                                <h2>{cat.category}</h2>
                            </div>
                            <ul className="resourcesPage__card__list">
                                {cat.items.map((item) => (
                                    <li key={item.name}>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            <strong>{item.name}</strong>
                                            <span>{item.desc}</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Resources;
