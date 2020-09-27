import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef
} from 'react';

import subscriptionsApi from 'Apis/subscriptions-api';
import radioiApi from 'Apis/radioi-api';
import { delay } from 'Utils';

import { useRadio } from '../radio-provider';

import ChatLine from './chat-line';
import ChatInput from './chat-input';

const Chat = ({ open }) => {
  const radio = useRadio();
  const [chatMessages, setChatMessages] = useState([]);
  const [animation, setAnimation] = useState('filling-chat');
  const [scrollBottom, setScrollBottom] = useState(true);

  const chatboxRef = useRef();

  const onLastLineRendered = useCallback(() => {
    if (scrollBottom) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [scrollBottom]);

  useEffect(() => {
    (async () => {
      const {
        data: { chats }
      } = await radioiApi.getRadioChats(radio.hash);
      setChatMessages(chats);
    })();
  }, []);

  useEffect(() => {
    setScrollBottom(true);
  }, [open]);

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      if (chatboxRef.current.scrollHeight > chatboxRef.current.offsetHeight) {
        setAnimation('chat-refresh');
      }
      setChatMessages([...chatMessages, message]);
      setScrollBottom(false);
      const isScrolledToBottom =
        chatboxRef.current.scrollHeight - chatboxRef.current.clientHeight <=
        chatboxRef.current.scrollTop + 100; // allow 100px inaccuracy
      if (isScrolledToBottom) {
        // Scroll to the bottom and prevent any further auto scrolling
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
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

export default Chat;
