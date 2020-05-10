import React, { Fragment, useCallback, useMemo, useState } from 'react';

import Search from './search';
import Chat from './chat';

const CHAT_SELECTOR = 'chat';
const SEARCH_SELECTOR = 'search';

const RightPanel = ({ isOwner }) => {
  const [selector, setSelector] = useState(SEARCH_SELECTOR);

  const selectedComponent = useMemo(() => {
    if (isOwner) {
      if (selector === CHAT_SELECTOR) {
        return <Chat />;
      } else {
        return <Search />;
      }
    } else {
      return <Chat />;
    }
  }, [isOwner, selector]);

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
      {isOwner && (
        <div className="component-selector">
          <span className={searchSelected} onClick={selectSearch}>
            Search
          </span>
          <span className={chatSelected} onClick={selectChat}>
            Chat
          </span>
        </div>
      )}
      {selectedComponent}
    </div>
  );
};

export default RightPanel;
