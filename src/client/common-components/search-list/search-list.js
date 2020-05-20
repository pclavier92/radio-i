import React, { Fragment } from 'react';
import { arrayOf, object } from 'prop-types';

import Spinner from '../spinner';
import ListItem from './list-item';

import './styles.css';

const SearchList = ({ searchResults }) => (
  <Fragment>
    {searchResults.length === 0 ? (
      <Spinner />
    ) : (
      <div className="serach-results">
        <ul className="serach-results-header">
          <li key="heading" className="row first-row">
            <div className="col span-1-of-12">&nbsp;</div>
            <div className="col span-4-of-12">Name</div>
            <div className="col span-3-of-12">Artist</div>
            <div className="col span-3-of-12">Album</div>
            <div className="col span-1-of-12">Duration</div>
          </li>
        </ul>
        <ul className="scroll-results-list">
          {searchResults &&
            searchResults.map((item, index) => (
              <ListItem key={index} item={item} />
            ))}
        </ul>
      </div>
    )}
  </Fragment>
);

SearchList.propTypes = {
  searchResults: arrayOf(object).isRequired
};

export default SearchList;
