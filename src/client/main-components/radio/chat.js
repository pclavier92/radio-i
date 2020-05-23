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

const ChatLine = ({ userId, message, isLastLine, onLastLineRendered }) => {
  const [user, setUser] = useState(null);

  const lineRef = useCallback(node => {
    if (node && isLastLine) {
      onLastLineRendered(node);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await spotifyWebApi.getUserInfoById(userId);
      setUser(data);
    })();
  }, [userId]);

  return (
    <Fragment>
      {user && (
        <li ref={lineRef}>
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
  const [chatMessages, setChatMessages] = useState([]);
  const [animation, setAnimation] = useState('filling-chat');
  const [scrollBottom, setScrollBottom] = useState(true);

  // const addStyles = useRef();
  // useEffect(() => {
  //   const myReuseableStylesheet = document.createElement('style');
  //   document.head.appendChild(myReuseableStylesheet);
  //   addStyles.current = height => {
  //     debugger;
  //     myReuseableStylesheet.sheet.insertRule(
  //       `.chat-refresh li { transform: translateY(${height}px) }`
  //     );
  //     myReuseableStylesheet.sheet.insertRule(
  //       '@keyframes filling-chat-animation { ' +
  //         `from { transform: translateY(${height}px) }` +
  //         'to { transform: translateY(0) } }'
  //     );
  //   };
  // }, []);

  const chatboxRef = useRef();

  const onLastLineRendered = useCallback(
    node => {
      if (scrollBottom) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    },
    [scrollBottom]
  );

  useEffect(() => {
    setScrollBottom(true);
  }, [open]);

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      if (chatboxRef.current.scrollHeight > chatboxRef.current.offsetHeight) {
        setAnimation('chat-refresh');
      }
      setChatMessages([...chatMessages, message]);
      // Scroll to the bottom and prevent any further auto scrolling
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      setScrollBottom(false);
      (async () => {
        await delay(50);
        setChatMessages([...chatMessages, message]);
        setAnimation('filling-chat');
      })();
    });
  }, [chatMessages]);

  return (
    <Fragment>
      {open && (
        <div className="radio-chat">
          <ul ref={chatboxRef} className={`chat-box ${animation}`}>
            {chatMessages.map(({ id, user, message }, idex) => (
              <ChatLine
                key={id}
                userId={user}
                message={message}
                isLastLine={idex === chatMessages.length - 1}
                onLastLineRendered={onLastLineRendered}
              />
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
