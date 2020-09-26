import React from 'react';

import './styles.css';

const SearchBar = ({ topArtist, setSearchsearchInput, triggerSearch }) => (
  <div className="search-bar">
    <input
      type="text"
      name="search"
      id="search"
      spellCheck="false"
      autoComplete="off"
      placeholder={`Add songs to your radio! For example, something from... ${topArtist}`}
      onChange={event => setSearchsearchInput(event.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          triggerSearch();
        }
      }}
    />
    <i className="material-icons">search</i>
  </div>
);

export default SearchBar;
