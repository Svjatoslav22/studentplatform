import React, { useState } from 'react';

const MessageBody = ({ data, onAddAnswer }) => {
  const [replyDrafts, setReplyDrafts] = useState({});

  const updateReplyDraft = (questionId, field, value) => {
    setReplyDrafts((currentDrafts) => ({
      ...currentDrafts,
      [questionId]: {
        ...(currentDrafts[questionId] || {}),
        [field]: value,
      },
    }));
  };

  const submitReply = async (event, questionId) => {
    event.preventDefault();
    const replyData = replyDrafts[questionId] || {};
    await onAddAnswer(questionId, replyData.authorName || '', replyData.message || '');
    setReplyDrafts((currentDrafts) => ({
      ...currentDrafts,
      [questionId]: { authorName: '', message: '' },
    }));
  };

  return (
    <>
      {React.Children.toArray(
        data.map((itemData) => (
          <section className="messagebody">
            <div className="messagebody__question">
              <h1 className="messagebody__text">{itemData.message}</h1>
              <p className="messagebody__author">{itemData.user_name}</p>
              <ul className="messagebody__tags">
                {React.Children.toArray(
                  (itemData.tags || []).map((tag) => (tag ? <li>{`#${tag}`}</li> : <></>))
                )}
              </ul>
            </div>

            <div className="messagebody__answers">
              {(itemData.answers || []).map((answerItem) => (
                <article className="messagebody__answers__item" key={answerItem.id}>
                  <p className="messagebody__answers__item__text">{answerItem.message}</p>
                  <span className="messagebody__answers__item__author">{answerItem.user_name}</span>
                </article>
              ))}
            </div>

            <form className="messagebody__reply-form" onSubmit={(event) => submitReply(event, itemData.id)}>
              <input
                type="text"
                placeholder="Ваше ім'я або Анонім"
                value={replyDrafts[itemData.id]?.authorName || ''}
                onChange={(event) => updateReplyDraft(itemData.id, 'authorName', event.target.value)}
              />
              <input
                type="text"
                placeholder="Напишіть відповідь"
                value={replyDrafts[itemData.id]?.message || ''}
                onChange={(event) => updateReplyDraft(itemData.id, 'message', event.target.value)}
              />
              <button type="submit">Reply</button>
            </form>
          </section>
        ))
      )}
    </>
  );
};

export default MessageBody;
