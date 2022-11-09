import React from 'react';
import PropTypes from 'prop-types';
import BoxMessage from './boxMessage';

const Content = ({ isSearchApplied, repositoriesList, children }) => {


  if (isSearchApplied && !!repositoriesList.length) {
    return (
      <React.Fragment>
        {children}

      </React.Fragment>
    )
  }
  if (isSearchApplied && !repositoriesList.length) {
    return (
      <BoxMessage message='You search has no results' />
    )
  }
  return (
    <BoxMessage message='Please provide a search option and click in the search button' />

  );
}

export default Content;

Content.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  repositoriesList: PropTypes.arrayOf(PropTypes.object.isRequired),
}