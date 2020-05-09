import React, { useCallback, useState, useRef } from 'react';

import './styles.css';

const SharePopUp = () => {
  const inputRef = useRef();
  const [open, setOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const copyInput = useCallback(() => {
    inputRef.current.select();
    document.execCommand('copy');
  }, []);

  return (
    <div className="share-radio">
      <button type="button" onClick={toggleDropdown} className="btn-share">
        <p>Share Radio</p>
      </button>
      {open && (
        <div className="share-pop-up">
          <button className="btn-copy" onClick={copyInput}>
            Copy
          </button>
          <input
            ref={inputRef}
            type="text"
            value={window.location.href}
            id="radio-link-share"
          />
        </div>
      )}
    </div>
  );
};

export default SharePopUp;
