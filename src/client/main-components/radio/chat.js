import React, { useState, useCallback, useEffect } from 'react';

import spotifyWebApi from '../../apis/spotify-web-api';
import subscriptionsApi from '../../apis/subscriptions-api';

import { useAuthentication } from '../authentication';

const ChatLine = ({ userId, message }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await spotifyWebApi.getUserInfoById(userId);
      setUser(data);
    })();
  }, [userId]);

  return (
    <li>
      {user && <img alt="" src={user.images[0].url} />}
      <span>{user && user.display_name}:</span> {message}
    </li>
  );
};

const Chat = ({ messages }) => {
  const animationType = messages.length < 9 ? 'filling-chat' : 'full-chat';
  return (
    <div className="radio-chat">
      <div className="chat-box">
        <ul className={animationType}>
          {messages.map(({ id, user, message }, index) => (
            <ChatLine key={index + id} userId={user} message={message} />
          ))}
        </ul>
      </div>
      <ChatInput />
    </div>
  );
};

const ChatInput = () => {
  const {
    user: { id }
  } = useAuthentication();
  const [chatInput, setChatInput] = useState('');

  const onChange = useCallback(event => setChatInput(event.target.value), []);

  const onEnter = useCallback(
    event => {
      if (event.key === 'Enter') {
        setChatInput('');
        subscriptionsApi.sendChatMessage(id, chatInput);
      }
    },
    [name, chatInput]
  );

  return (
    <input
      type="text"
      name="chat-input"
      id="chat-input"
      spellCheck="false"
      autoComplete="off"
      value={chatInput}
      onChange={onChange}
      onKeyDown={onEnter}
    />
  );
};

export default Chat;
