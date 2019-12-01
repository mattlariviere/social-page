import React from "react";

const EventFullCard = props => {
  const handleEdit = () => {
    props.onSelectedItemClick(props.event);
  };
  const handleViewMore = () => {
    props.onSelectedItemViewMore(props.event);
  };
  return (
    <div className="smallEvent" key={props.event.id}>
      <div className="eventContainer">
        <h3 className="smallEventName">{props.event.name}</h3>
        <p className="smallEventHeadline">{props.event.headline}</p>
        <p className="smallEventSummary">
          <i className="material-icons">date_range</i> Date:{" "}
          {props.event.metaData.dateStart.length > 10
            ? props.event.metaData.dateStart.slice(0, 10)
            : props.event.metaData.dateStart}
        </p>
        <div>
          <button
            type="button"
            className="btn btn-outline-info float-left"
            onClick={handleViewMore}
          >
            <small>View More</small>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary float-right"
            onClick={handleEdit}
          >
            <small>Edit Event</small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFullCard;
