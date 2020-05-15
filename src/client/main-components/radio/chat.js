import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Emojione } from 'react-emoji-render';

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
    <Fragment>
      {user && (
        <li>
          <img alt="" src={user.images[0].url} />
          <span>{user.display_name}:</span>&nbsp;
          <Emojione text={message} />
        </li>
      )}
    </Fragment>
  );
};

const Chat = ({ messages, animation }) => {
  return (
    <div className="radio-chat">
      <div className="chat-box">
        <ul className={animation}>
          {messages.map(({ id, user, message }) => (
            <ChatLine key={id} userId={user} message={message} />
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
