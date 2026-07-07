import React, { useState } from 'react';
import Navbar from '../NavBar/Navbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Bell, Shield, Globe, ChevronRight } from 'lucide-react';

function Settings() {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState(true);
    const [emailNotif, setEmailNotif] = useState(false);

    const currentUser = (() => {
        try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch (e) { return null; }
    })();

    return (
        <div className="settingsPage">
            <Navbar isLoggedIn={true} />
            <div className="settingsPage__content">
                <h1 className="settingsPage__title">⚙️ Settings</h1>
                <p className="settingsPage__subtitle">Керуйте своїм акаунтом та налаштуваннями</p>

                {/* Profile section */}
                <div className="settingsPage__section">
                    <div className="settingsPage__section__header">
                        <User size={20} />
                        <h2>Профіль</h2>
                    </div>
                    <div className="settingsPage__profile">
                        <div className="settingsPage__profile__avatar">
                            <User size={32} />
                        </div>
                        <div className="settingsPage__profile__info">
                            <strong>{currentUser?.name || 'Студент'}</strong>
                            <span>{currentUser?.email || 'email@example.com'}</span>
                            <span>{currentUser?.specialty || 'Спеціальність'} • Курс {currentUser?.course || '—'}</span>
                        </div>
                        <button className="settingsPage__profile__edit" onClick={() => window.open('/profile', '_self')}>
                            Редагувати <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settingsPage__section">
                    <div className="settingsPage__section__header">
                        <Bell size={20} />
                        <h2>Сповіщення</h2>
                    </div>
                    <div className="settingsPage__setting">
                        <div>
                            <strong>Push-сповіщення</strong>
                            <span>Отримувати сповіщення про нові відповіді на ваші питання</span>
                        </div>
                        <label className="settingsPage__toggle">
                            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                            <span className="settingsPage__toggle__slider" />
                        </label>
                    </div>
                    <div className="settingsPage__setting">
                        <div>
                            <strong>Email-сповіщення</strong>
                            <span>Отримувати щотижневий дайджест на email</span>
                        </div>
                        <label className="settingsPage__toggle">
                            <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                            <span className="settingsPage__toggle__slider" />
                        </label>
                    </div>
                </div>

                {/* Language */}
                <div className="settingsPage__section">
                    <div className="settingsPage__section__header">
                        <Globe size={20} />
                        <h2>Мова</h2>
                    </div>
                    <div className="settingsPage__langOptions">
                        <button className="settingsPage__langBtn active">🇺🇦 Українська</button>
                        <button className="settingsPage__langBtn">🇬🇧 English</button>
                    </div>
                </div>

                {/* Security */}
                <div className="settingsPage__section">
                    <div className="settingsPage__section__header">
                        <Shield size={20} />
                        <h2>Безпека</h2>
                    </div>
                    <button className="settingsPage__actionBtn" onClick={() => window.open('/changePassword', '_self')}>
                        Змінити пароль <ChevronRight size={16} />
                    </button>
                    <button className="settingsPage__actionBtn settingsPage__actionBtn--danger" onClick={() => window.open('/deleteUser', '_self')}>
                        Видалити акаунт <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
