import React from 'react';
import { arrayOf, object } from 'prop-types';

import { msToMinutesSeconds } from '../../utils';

import './styles.css';

const SearchList = ({ searchResults, onAddSong }) => {
  const list =    searchResults
    && searchResults.map(item => (
      <li key={item.name} className="row">
        <div className="col span-1-of-12">&nbsp;</div>
        <div className="col span-3-of-12">{item.name}</div>
        <div className="col span-2-of-12">{item.artists[0].name}</div>
        <div className="col span-3-of-12">{item.album.name}</div>
        <div className="col span-1-of-12">
          {msToMinutesSeconds(item.duration_ms)}
        </div>
        <div className="col span-1-of-12">&nbsp;</div>
        <div className="col span-1-of-12">
          <ion-icon name="add-circle" />
        </div>
      </li>
    ));
  return (
    <div className="serach-results">
      <ul className="serach-results-list">
        <li key="heading" className="row first-row">
          <div className="col span-1-of-12">&nbsp;</div>
          <div className="col span-3-of-12">Name</div>
          <div className="col span-2-of-12">Artist</div>
          <div className="col span-3-of-12">Album</div>
          <div className="col span-1-of-12">Duration</div>
          <div className="col span-1-of-12">&nbsp;</div>
          <div className="col span-1-of-12">&nbsp;</div>
        </li>
        {list}
      </ul>
    </div>
  );
};

SearchList.propTypes = {
  searchResults: arrayOf(object)
};

export default SearchList;
