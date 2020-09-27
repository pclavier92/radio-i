import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Emojione } from 'react-emoji-render';

import spotifyWebApi from 'Apis/spotify-web-api';

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

export default ChatLine;
