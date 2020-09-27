import React, { useCallback } from 'react';

import './styles.css';

const SearchBar = ({ topArtist, onChange, onEnter }) => {
  const onInputChange = useCallback(
    event => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        onEnter();
      }
    },
    [onEnter]
  );

  return (
    <div className="search-bar">
      <input
        type="text"
        name="search"
        id="search"
        spellCheck="false"
        autoComplete="off"
        placeholder={`Add songs to your radio! For example, something from... ${topArtist}`}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
      />
      <i className="material-icons">search</i>
    </div>
  );
};

export default SearchBar;
