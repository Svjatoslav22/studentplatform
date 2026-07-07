import React, { useEffect, useState } from 'react';
import Navbar from '../NavBar/Navbar';
import MessageBody from './ChildComponent/MessageBody';
import apiClient from '../../api/apiClient';

const Questions = () => {
    const [questions, setQuestions] = useState([]);
    const [authorName, setAuthorName] = useState('');
    const [message, setMessage] = useState('');
    const [tags, setTags] = useState('');

    const loadQuestions = async () => {
        try {
            const response = await apiClient.get('/questions');
            setQuestions(response.data.questions || []);
        } catch (error) {
            window.alert('Error 500: Cannot load questions');
        }
    };

    useEffect(() => {
        loadQuestions();
        const timerId = setInterval(loadQuestions, 8000);

        return () => clearInterval(timerId);
    }, []);

    const getMessageData = async (event) => {
        event.preventDefault();

        try {
            await apiClient.post('/questions', {
                user_name: authorName.trim() || 'Анонім',
                message: message.trim(),
                tags: tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            });

            setMessage('');
            setTags('');
            await loadQuestions();
        } catch (error) {
            window.alert('Error 500: Cannot post question');
        }
    };

    const handleAddAnswer = async (questionId, replyAuthor, replyMessage) => {
        try {
            await apiClient.post(`/questions/${questionId}/answers`, {
                user_name: replyAuthor.trim() || 'Анонім',
                message: replyMessage.trim(),
            });

            await loadQuestions();
        } catch (error) {
            window.alert('Error 500: Cannot post answer');
        }
    };

    return (
        <section className="questions">
            <Navbar isLoggedIn={true} />
            <div className="questions__message-screen">
                <MessageBody data={questions} onAddAnswer={handleAddAnswer} />
            </div>
            {/* Фрагмент форми для Questions.js */}
            <form className="questions__form" onSubmit={getMessageData}>
                <div style={{ display: 'flex', gap: '1.2rem' }}>
                    <input
                        type="text"
                        name="authorName"
                        placeholder="Ваше ім'я або Анонім"
                        value={authorName}
                        onChange={(event) => setAuthorName(event.target.value)}
                    />
                    <input
                        type="text"
                        name="tags"
                        placeholder="Теги (через кому)"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                    />
                </div>
                <input
                    type="text"
                    name="message"
                    placeholder="Напишіть ваше запитання тут..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    draggable="false"
                />
                <button className="questions__form__button" type="submit">Post</button>
            </form>
        </section>
    );
};

export default Questions
