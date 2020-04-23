import React from 'react';

import './styles.css';

const SearchBar = ({ setSearchsearchInput }) => (
  <div className="search-bar">
    <input
      type="text"
      name="search"
      id="search"
      placeholder="Search for songs!"
      onChange={event => setSearchsearchInput(event.target.value)}
    />
    <ion-icon className="search-icon" name="search" />
  </div>
);

export default SearchBar;
