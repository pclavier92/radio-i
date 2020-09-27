import React, { useCallback, useState } from 'react';

import subscriptionsApi from 'Apis/subscriptions-api';
import { useAuthentication } from 'Context/authentication';

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

export default ChatInput;
