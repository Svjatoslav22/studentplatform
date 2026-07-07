import { Button } from '@material-ui/core'
import React from 'react'

function Dashboard() {
    const go = (path) => {
        if (!window.location.href.includes(path)) {
            window.open(path, '_self');
        }
    };

    return (
        <div className="dashboard">
            <p className="dashboard__welcome">Ласкаво просимо до Студентського форуму</p>

            <div className="dashboard__shortcuts">
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/questions')}>Задати питання</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/timetable')}>Розклад</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/books')}>Книги</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/pastpapers')}>Минулі іспити</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/profile')}>Мій профіль</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/questions')}>Q&A</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => go('/books')}>Мої матеріали</Button>
                <Button variant="extendedFab" className="dashboard__shortcuts__button" onClick={() => alert('Допомога: зверніться до куратора або адміністратора.')}>Допомога</Button>
            </div>
        </div>
    )
}

export default Dashboard
