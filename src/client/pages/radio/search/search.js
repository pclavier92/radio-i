import React, { useCallback, useEffect, useState } from 'react';

import spotifyWebApi from 'Apis/spotify-web-api';
import { debounce } from 'Utils';

import SearchBar from './search-bar';
import SearchList from './search-list';

const HALF_SECOND = 500; // ms

const Search = ({ playedSongs, radioQueue }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topArtist, setTopArtist] = useState('');

  const triggerSearch = useCallback(async () => {
    setSearchResults([]);
    const {
      data: {
        tracks: { items }
      }
    } = await spotifyWebApi.getSearchResults(searchInput);
    setSearchResults(items);
  }, [searchInput]);

  useEffect(() => {
    (async () => {
      const {
        data: { items }
      } = await spotifyWebApi.getTopArtists();
      const artistName = items[Math.floor(Math.random() * items.length)].name;
      setSearchInput(artistName);
      setTopArtist(artistName);
    })();
  }, []);

  useEffect(() => {
    if (searchInput !== '') {
      triggerSearch();
    }
  }, [searchInput, triggerSearch]);

  const onSearchInputChange = useCallback(
    debounce(value => {
      setSearchInput(value);
    }, HALF_SECOND),
    []
  );

  return (
    <div className="radio-search">
      <SearchBar
        topArtist={topArtist}
        onChange={onSearchInputChange}
        onEnter={triggerSearch}
      />
      <SearchList
        searchResults={searchResults}
        playedSongs={playedSongs}
        radioQueue={radioQueue}
      />
    </div>
  );
};

export default Search;
