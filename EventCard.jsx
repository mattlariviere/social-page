import React from "react";
import { SimpleMap } from "./GoogleMapInsert";

const EventCard = props => {
  const handleEdit = () => {
    props.onSelectedItemClick(props.event);
  };
  return (
    <div className="event" key={props.event.id}>
      <div className="eventContainer">
        <h3 className="eventName">{props.event.name}</h3>
        <hr />
        <p className="center eventHeadline"> {props.event.headline}</p>

        <p className="center eventSummary">Summary of the Event: {props.event.summary}</p>
        <hr />
        <div className="viewMore">
          <div>
            <p className="center eventSlug">Slug: {props.event.slug}</p>
            <p className="center eventDescription">{props.event.description}</p>
            <hr />
            <div className="eventLocation">
              <p className="eventAddress">Location:</p>
              <SimpleMap
                eventLatitude={props.event.metaData.location.latitude}
                eventLongitude={props.event.metaData.location.longitude}
                eventName={props.event.name}
              />
              <p className="eventAddress bold">
                Address: {props.event.metaData.location.address}
                {", "}
                {props.event.metaData.location.zipCode}
              </p>
            </div>
            <hr />
            <div className="eventInfo center">
              <p className="eventDate bold">
                Date:{" "}
                <span className="eventDateStart bold">
                  {" "}
                  {props.event.metaData.dateStart.length > 10
                    ? props.event.metaData.dateStart.slice(0, 10)
                    : props.event.metaData.dateStart}
                </span>{" "}
                to{" "}
                <span className="eventDateStart bold">
                  {" "}
                  {props.event.metaData.dateEnd.length > 10
                    ? props.event.metaData.dateEnd.slice(0, 10)
                    : props.event.metaData.dateEnd}
                </span>
              </p>
              <p className="eventAddress">
                {props.event.address}
                <span className="eventZip">{props.event.zip}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary form-control"
            onClick={handleEdit}
          >
            Edit Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
