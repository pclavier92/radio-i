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
          {user.images.lenght > 0 ? (
            <img alt="" src={user.images[0].url} />
          ) : (
            <i className="material-icons no-image-user">person</i>
          )}
          <span>{user.display_name}:</span>&nbsp;
          <Emojione text={message} />
        </li>
      )}
    </Fragment>
  );
};

const Chat = ({ open }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [animation, setAnimation] = useState('filling-chat');
  const [lines, setLines] = useState(0);

  const callbackRef = useCallback(node => {
    if (node) {
      const numberLines = Math.ceil((node.offsetHeight - 20) / 40);
      setLines(numberLines);
    }
  });

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      if (chatMessages.length > lines - 1) {
        setAnimation('full-chat-refresh');
        (async () => {
          await delay(50);
          setAnimation('full-chat');
        })();
      }
      if (chatMessages.length < lines + 1) {
        setChatMessages([...chatMessages, message]);
      } else {
        setChatMessages([...chatMessages.splice(1), message]);
      }
    });
  }, [lines, chatMessages]);

  return (
    <Fragment>
      {open && (
        <div className="radio-chat">
          <div ref={callbackRef} className="chat-box">
            <ul className={animation}>
              {chatMessages.map(({ id, user, message }) => (
                <ChatLine key={id} userId={user} message={message} />
              ))}
            </ul>
          </div>
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
