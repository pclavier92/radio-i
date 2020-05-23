import React, {
  useState,
  useCallback,
  useEffect,
  Fragment,
  useRef
} from 'react';
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

  const chatboxRef = useRef();

  useEffect(() => {
    if (open) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [open]);

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      // setAnimation('chat-refresh');
      // setChatMessages([message, ...chatMessages]);

      if (chatboxRef.current.scrollHeight > chatboxRef.current.offsetHeight) {
        setChat({
          messages: [...messages, message],
          animation: 'chat-refresh'
        });
      }
      // Scroll to the bottom
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      (async () => {
        await delay(100);
        setChat({
          messages: [...messages, message],
          animation: 'filling-chat'
        });
      })();
    });
  }, [messages]);

  return (
    <Fragment>
      {open && (
        <div className="radio-chat">
          <ul ref={chatboxRef} className={`chat-box ${animation}`}>
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
