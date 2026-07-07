import { Button } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { saceitSpecialties } from '../../data/saceit';

function RegistrationPage() {
    const { t } = useLanguage();

    const goBack = () => {
        window.history.back();
    }

    const registerUser = async (e) => {
        e.preventDefault();

        let { user_name, email, user_password, confirm_password, specialty, course } = e.target;

        let user = {
            name: user_name.value,
            email: email.value,
            user_password: user_password.value,
            confirm_password: confirm_password.value,
            specialty: specialty.value,
            course: course.value
        }

        try {
            const response = await apiClient.post('/register', user)

            if (response.status === 200) {
                try {
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user || user));
                    localStorage.setItem('profile_specialty', user.specialty);
                    localStorage.setItem('profile_course', String(user.course));
                } catch (storageError) {}

                window.alert('User added Successfully');
                document.querySelector('.reg__page__form__loginNavigator').click();
            }
        }
        catch (err) {
            if (err.response?.status === 403) {
                window.alert('Passwords does not match to each other')
            }
            else if (err.response?.status === 422) {
                window.alert('Error Invalid Inputs')
            }
            else
                window.alert('Error 500: Internal Server Error')
        }

    }
    return (
        <div className="reg">
            <div className="reg__page">
                <AccountCircle className="reg__page__avatar" />
                <form onSubmit={registerUser} className="reg__page__form">
                    <input name="user_name" className="reg__page__form__input" type="text" placeholder={t('register.name')} />
                    <input name="email" className="reg__page__form__input" type="text" placeholder={t('register.email')} />
                    <select name="specialty" className="reg__page__form__input" defaultValue="">
                        <option value="" disabled>{t('register.specialty')}</option>
                        {saceitSpecialties.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <select name="course" className="reg__page__form__input" defaultValue="">
                        <option value="" disabled>{t('register.course')}</option>
                        {[1, 2, 3, 4].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <input name="user_password" className="reg__page__form__input" type="password" placeholder={t('register.password')} />
                    <input name="confirm_password" className="reg__page__form__input" type="password" placeholder={t('register.confirm_password')} />

                    <div className="reg__page__form__buttons">
                        <Button className="reg__page__form__buttons__button" onClick={goBack}>{t('register.back')}</Button>
                        <Button type="submit" className="reg__page__form__buttons__button">{t('register.submit')}</Button>
                    </div>
                </form>
                <Link to="/login" className="reg__page__form__loginNavigator" ></Link>
            </div>
        </div>
    )
}

export default RegistrationPage