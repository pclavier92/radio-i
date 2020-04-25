import React, { useCallback, useEffect, useState } from 'react';
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

const getTopArtists = accessToken => axios
    .get(
      'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: 'json'
      }
    )
    .catch(e => console.log(e));

const Search = () => {
  const { accessToken } = useAuthentication();

  const [searchInput, setSearchsearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topArtist, setTopArtist] = useState('');

  const triggerSearch = useCallback(async () => {
    const {
      data: {
        tracks: { items }
      }
    } = await getSearchResults(accessToken, searchInput);
    setSearchResults(items);
  });

  useEffect(() => {
    (async () => {
      const {
        data: { items }
      } = await getTopArtists(accessToken);
      const artistName = items[Math.floor(Math.random() * items.length)].name;
      setSearchsearchInput(artistName);
      setTopArtist(artistName);
    })();
  }, []);

  useEffect(() => {
    if (searchInput !== '') {
      triggerSearch();
    }
  }, [searchInput]);

  return (
    <div>
      <SearchBar
        topArtist={topArtist}
        setSearchsearchInput={debounce(setSearchsearchInput, ONE_SECOND)}
        triggerSearch={triggerSearch}
      />
      <SearchList searchResults={searchResults} />
    </div>
  );
};

export default Search;
