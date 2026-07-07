import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import HomePage from './Components/HomePage/HomePage';
import LoginPage from './Components/LoginPage/LoginPage';
import PastPapers from './Components/PastPapersPage/PastPapers';
import Questions from './Components/Questions/Questions';
import Profile from './Components/Profile/Profile';
import RegistrationPage from './Components/RegistrationPage/RegistrationPage';
import { ContextWrapper } from './Components/TimeTable/TimeTableContext'
import TimeTable from './Components/TimeTable/TimetablePage';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import { LanguageProvider } from './contexts/LanguageContext';
import Book from './Components/Books/Books'
import UpdatePassword from './Components/Actions/UpdatePassword';
import DeleteAccount from './Components/Actions/DeleteAccount';
import Resources from './Components/Resources/Resources';
import Settings from './Components/Settings/Settings';
import Help from './Components/Help/Help';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={WelcomePage} exact />
          <Route path="/home" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegistrationPage} />
          <Route path="/questions" component={Questions} />
          <Route path="/profile" component={Profile} />
          <Route path="/pastpapers" component={PastPapers} />
          <Route path="/books" component={Book} />
          <Route path="/resources" component={Resources} />
          <Route path="/settings" component={Settings} />
          <Route path="/help" component={Help} />
          <Route path="/changePassword" component={UpdatePassword} />
          <Route path="/deleteUser" component={DeleteAccount} />
          <ContextWrapper>
            <Route path="/timetable" component={TimeTable} />
          </ContextWrapper>
        </Switch>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
