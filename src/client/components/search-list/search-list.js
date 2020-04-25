import React from 'react';
import { arrayOf, object } from 'prop-types';

import ListItem from './list-item';

import './styles.css';

const SearchList = ({ searchResults }) => (
  <div className="serach-results">
    <ul className="serach-results-list">
      <li key="heading" className="row first-row">
        <div className="col span-4-of-12">Name</div>
        <div className="col span-3-of-12">Artist</div>
        <div className="col span-3-of-12">Album</div>
        <div className="col span-2-of-12">Duration</div>
      </li>
      {searchResults
        && searchResults.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
    </ul>
  </div>
);

SearchList.propTypes = {
  searchResults: arrayOf(object).isRequired
};

export default SearchList;
