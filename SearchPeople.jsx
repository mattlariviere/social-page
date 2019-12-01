import React from "react";

const SearchPeople = props => {
  return (
    <form className="float-right my-2 my-lg-0 form-inline searchBar">
      <input
        className="form-control mr-sm-2"
        type="text"
        placeholder="Search People..."
        aria-label="Search"
        onChange={props.handleSearch}
        value={props.query}
      />
      <button
        onClick={props.getSearch}
        className="btn btn-outline-secondary my-2 my-sm-0"
        type="button"
      >
        <i className="material-icons">search</i>
      </button>
    </form>
  );
};

export default SearchPeople;
