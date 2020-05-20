import React, { useCallback, useState, Fragment } from 'react';

import Search from './search';
import Chat from './chat';

const CHAT_SELECTOR = 'chat';
const SEARCH_SELECTOR = 'search';

const RightPanel = ({ canSearch }) => {
  const [selector, setSelector] = useState(SEARCH_SELECTOR);

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
      <Chat open={selector === CHAT_SELECTOR} />
      {canSearch && <Search open={selector === SEARCH_SELECTOR} />}
    </div>
  );
};

export default RightPanel;
