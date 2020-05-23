import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Emojione } from 'react-emoji-render';

import { delay } from '../../utils';
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
          {user.images.length > 0 ? (
            <img alt="" src={user.images[0].url} />
          ) : (
            <i className="material-icons no-image-user">person</i>
          )}
          <div className="chat-message-container">
            <span>{user.display_name}:</span>&nbsp;
            <Emojione text={message} />
          </div>
        </li>
      )}
    </Fragment>
  );
};

const Chat = ({ open }) => {
  // const [chatMessages, setChatMessages] = useState([]);
  // const [animation, setAnimation] = useState('filling-chat');

  const [chat, setChat] = useState({
    messages: [],
    animation: 'filling-chat'
  });
  const { messages, animation } = chat;

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      // setAnimation('chat-refresh');
      // setChatMessages([message, ...chatMessages]);
      setChat({
        messages: [message, ...messages],
        animation: 'chat-refresh'
      });
      (async () => {
        await delay(100);
        setChat({
          messages: [message, ...messages],
          animation: 'filling-chat'
        });
      })();
    });
  }, [messages]);

  debugger;

  return (
    <Fragment>
      {open && (
        <div className="radio-chat">
          <ul className={`chat-box ${animation}`}>
            {messages.map(({ id, user, message }) => (
              <ChatLine key={id} userId={user} message={message} />
            ))}
          </ul>

          <ChatInput />
        </div>
      )}
    </Fragment>
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
