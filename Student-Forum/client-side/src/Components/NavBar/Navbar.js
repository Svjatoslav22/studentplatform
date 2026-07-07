import React, { useState } from 'react'
import { AccountCircle } from '@material-ui/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { Home, Book, Clock, FileText, Grid } from 'lucide-react';

const Navbar = ({ isLoggedIn }) => {
    const linkTo = (link) => {
        window.open(link, "_self");
    }

    const { lang, setLang, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleLang = () => {
        const newLang = lang === 'uk' ? 'en' : 'uk';
        setLang(newLang);
        try { localStorage.setItem('lang', newLang); } catch (e) {}
    };

    return (
        <nav className="navbar" key={lang}>
            {/* Home icon */}
            <button className="navbar__homeBtn" onClick={() => linkTo("/home")} aria-label="Home" title="Home">
                <Home size={26} color="#0b9b9b" />
            </button>

            <div className="navbar__buttons">
                {isLoggedIn ? (
                    <>
                        <button className="navbar__iconBtn" aria-label={t('nav.books')} title={t('nav.books')} onClick={() => linkTo('/books')}>
                            <Book size={24} color="#0b9b9b" />
                        </button>

                        <button className="navbar__iconBtn" aria-label={t('nav.pastPapers')} title={t('nav.pastPapers')} onClick={() => linkTo('/pastpapers')}>
                            <FileText size={24} color="#0b9b9b" />
                        </button>

                        <button className="navbar__iconBtn" aria-label={t('nav.timetable')} title={t('nav.timetable')} onClick={() => linkTo('/timetable')}>
                            <Clock size={24} color="#0b9b9b" />
                        </button>

                        <button className="navbar__iconBtn" aria-label="Quick actions" title="Quick actions" onClick={() => setMenuOpen((s) => !s)}>
                            <Grid size={24} color="#0b9b9b" />
                        </button>

                        <button className="navbar__iconBtn navbar__profileBtn" onClick={() => linkTo('/profile')} aria-label="Profile" title="Profile">
                            <AccountCircle className="navbar__buttons__account" />
                        </button>

                        <button className="navbar__langToggle" onClick={toggleLang} aria-label="Toggle language">
                            {lang === 'uk' ? 'EN' : 'UK'}
                        </button>

                        {menuOpen && (
                            <div className="navbar__quickMenu">
                                <button onClick={() => { setMenuOpen(false); linkTo('/settings'); }}>Settings</button>
                                <button onClick={() => { setMenuOpen(false); linkTo('/help'); }}>Help</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="navbar__buttons__notLogedIn">
                        <button className="navbar__buttons__loginButton" onClick={() => linkTo('/login')}>{t('nav.login')}</button>
                        <button className="navbar__langToggle" onClick={toggleLang}>
                            {lang === 'uk' ? 'EN' : 'UK'}
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
