import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Fragment
} from 'react';

import { delay } from '../../utils';
import subscriptionsApi from '../../apis/subscriptions-api';

import Search from './search';
import Chat from './chat';

const CHAT_SELECTOR = 'chat';
const SEARCH_SELECTOR = 'search';

const RightPanel = ({ canSearch }) => {
  const [selector, setSelector] = useState(SEARCH_SELECTOR);
  const [chatMessages, setChatMessages] = useState([]);
  const [animation, setAnimation] = useState('filling-chat');

  useEffect(() => {
    subscriptionsApi.onChatMessage(message => {
      if (chatMessages.length > 7) {
        setAnimation('full-chat-refresh');
        (async () => {
          await delay(50);
          setAnimation('full-chat');
        })();
      }
      if (chatMessages.length < 9) {
        setChatMessages([...chatMessages, message]);
      } else {
        setChatMessages([...chatMessages.splice(1), message]);
      }
    });
  }, [chatMessages]);

  const selectedComponent = useMemo(() => {
    if (canSearch) {
      if (selector === CHAT_SELECTOR) {
        return <Chat messages={chatMessages} animation={animation} />;
      } else {
        return <Search />;
      }
    } else {
      return <Chat messages={chatMessages} animation={animation} />;
    }
  }, [canSearch, selector, chatMessages, animation]);

  const selectChat = useCallback(() => {
    setSelector(CHAT_SELECTOR);
  }, []);

  const selectSearch = useCallback(() => {
    setSelector(SEARCH_SELECTOR);
  }, []);

  const chatSelected = selector === CHAT_SELECTOR ? 'selected' : '';
  const searchSelected = selector === SEARCH_SELECTOR ? 'selected' : '';

  return (
    <div className="right-panel">
      <div className="component-selector">
        {canSearch && (
          <Fragment>
            <span className={searchSelected} onClick={selectSearch}>
              Search
            </span>
            <span className={chatSelected} onClick={selectChat}>
              Chat
            </span>
          </Fragment>
        )}
      </div>

      {selectedComponent}
    </div>
  );
};

export default RightPanel;
