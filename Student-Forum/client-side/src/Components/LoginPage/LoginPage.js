import { Button } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useLanguage } from '../../contexts/LanguageContext';

function LoginPage() {
      const { t } = useLanguage();

      const goBack = () => {
            window.history.back();
      }

      const loggedIn = async (e) => {
            e.preventDefault();

            const { email, password } = e.target;

            const Data = {
                  email: email.value,
                  password: password.value
            }

            try {
                  const response = await apiClient.post('/login', Data);

                  if (response.status === 200) {
                        try {
                              localStorage.setItem('currentUser', JSON.stringify(response.data.user || {}));
                              if (response.data.user?.specialty) {
                                    localStorage.setItem('profile_specialty', response.data.user.specialty);
                              }
                              if (response.data.user?.course) {
                                    localStorage.setItem('profile_course', String(response.data.user.course));
                              }
                              // Для демонстрації інтерсепторів: зберігаємо тестовий токен
                              const demoToken = response.data.token || 'demo-token-123';
                              try { localStorage.setItem('authToken', demoToken); } catch(e){}
                        } catch (storageError) {}

                        const switchLink = document.querySelector('.login__page__homePageLink');
                        switchLink.click();
                  }
            }
            catch (err) {
                  if (err.response?.status === 404) {
                        window.alert('Error 404: User not exist\nRegister first to Login')
                  }
                  else if (err.response?.status === 422) {
                        window.alert('Invalid Input')
                  }
                  else {
                        window.alert('Error 500: Server error')
                  }
            }

      }

      return (
            <div className="login">
                  <div className="login__page">
                        <AccountCircle className="login__page__avatar" />
                        <form onSubmit={loggedIn} className="login__page__form">
                              <input name="email" type="text" className="login__page__form__input" placeholder={t('login.email')} />
                              <input name="password" type="Password" className="login__page__form__input" placeholder={t('login.password')} />
                              <div className="login__page__form__buttons">
                                    <Button className="login__page__form__buttons__button" onClick={goBack} >{t('login.back')}</Button>
                                    <Button type="submit" className="login__page__form__buttons__button" >{t('login.submit')}</Button>
                              </div>
                              <div className="login__page__form__registerQuery">
                                    <p>{t('login.register_prompt')} <Link to="/register">{t('login.register_link')}</Link></p>
                              </div>
                        </form>
                        <Link to="/home" className="login__page__homePageLink"> </Link>
                  </div>
            </div>
      )
}

export default LoginPage