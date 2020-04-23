import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SearchBar from './components/search-bar';
import SearchList from './components/search-list';

import { debounce } from './utils';
import { useAuthentication } from './Authentication';

const ONE_SECOND = 1000; // ms

const getSearchResults = (accessToken, searchInput) => axios
    .get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchInput
      )}&type=track&offset=0&limit=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'json'
      }
    )
    .catch(e => console.log(e));

const Search = () => {
  const { accessToken } = useAuthentication();

  const [searchInput, setSearchsearchInput] = useState('The Strokes');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchInput !== '') {
      (async () => {
        const {
          data: {
            tracks: { items }
          }
        } = await getSearchResults(accessToken, searchInput);
        setSearchResults(items);
      })();
    }
  }, [searchInput]);

  return (
    <div>
      <SearchBar
        setSearchsearchInput={debounce(setSearchsearchInput, ONE_SECOND)}
      />
      <SearchList searchResults={searchResults} />
    </div>
  );
};

export default Search;
