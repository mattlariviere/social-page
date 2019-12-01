import React from "react";

const SearchEvents = props => {
  return (
    <div>
      <form className="float-right my-2 my-md-0">
        <div className="form-group inline">
          <div className="input-group">
            <input
              className="form-control mr-sm-2"
              type="text"
              placeholder="Date Start"
              aria-label="Search"
              name="dateStart"
              onChange={props.handleSearchChange}
              value={props.dateStart}
            />
            <input
              className="form-control mr-sm-2"
              type="text"
              placeholder="Date End"
              name="dateEnd"
              aria-label="Search"
              onChange={props.handleSearchChange}
              value={props.dateEnd}
            />
            <button
              onClick={props.submitSearch}
              className="btn btn-outline-secondary f my-2 my-sm-0"
              type="button"
            >
              <i className="material-icons">search</i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;
