import React, { useCallback, useState, useRef } from 'react';

import { withLastClickInside } from '../with-last-click-inside';

import './styles.css';

const SharePopUp = ({ lastClickInside }) => {
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
      {lastClickInside && open && (
        <div className="share-pop-up">
          <button className="btn-copy" onClick={copyInput}>
            Copy
          </button>
          <input
            type="text"
            spellCheck="false"
            autoComplete="off"
            id="radio-link-share"
            ref={inputRef}
            value={window.location.href}
          />
        </div>
      )}
    </div>
  );
};

export default withLastClickInside(SharePopUp);
