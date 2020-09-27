import React, { useCallback, useState, Fragment } from 'react';

import Search from './search/search';
import Chat from './chat';
import { useRadio } from './radio-provider';

const CHAT_SELECTOR = 'chat';
const SEARCH_SELECTOR = 'search';

const RightPanel = ({ playedSongs, radioQueue }) => {
  const radio = useRadio();
  const [selector, setSelector] = useState(() =>
    radio.isActiveUser ? SEARCH_SELECTOR : CHAT_SELECTOR
  );

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
        {radio.isActiveUser && (
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
      {radio.isActiveUser && selector === SEARCH_SELECTOR && (
        <Search playedSongs={playedSongs} radioQueue={radioQueue} />
      )}
    </div>
  );
};

export default RightPanel;
