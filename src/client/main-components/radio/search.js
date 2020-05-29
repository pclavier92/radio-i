import React, { Fragment, useCallback, useEffect, useState } from 'react';

import SearchBar from '../../common-components/search-bar';
import SearchList from '../../common-components/search-list';

import spotifyWebApi from '../../apis/spotify-web-api';
import { debounce } from '../../utils';

const ONE_SECOND = 1000; // ms

const Search = ({ playedSongs, radioQueue }) => {
  const [searchInput, setSearchsearchInput] = useState('');
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
  });

  useEffect(() => {
    (async () => {
      const {
        data: { items }
      } = await spotifyWebApi.getTopArtists();
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
    <div className="radio-search">
      <SearchBar
        topArtist={topArtist}
        setSearchsearchInput={debounce(setSearchsearchInput, ONE_SECOND)}
        triggerSearch={triggerSearch}
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
