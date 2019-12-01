import React from "react";

const BlogSearch = props => {
  return (
    <div>
      <form className="float-right my-2 my-lg-0 form-inline searchBar">
        <input
          className="form-control mr-sm-2"
          type="text"
          placeholder="Search Blogs..."
          aria-label="Search"
          onChange={props.handleSearchChange}
          value={props.searchTerm}
        />
        <button
          onClick={props.submitSearch}
          className="btn btn-outline-secondary my-2 my-sm-0"
          type="button"
        >
          <i className="material-icons">search</i>
        </button>
      </form>
    </div>
  );
};

export default BlogSearch;
