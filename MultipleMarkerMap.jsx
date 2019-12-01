import React from "react";
import Marker from "./Marker";
import GoogleMapReact from "google-map-react";

const MultipleMarkerMap = props => {
  const handleSelectedEventMarkerClick = e => {
    props.selectedEventMarkerClick(e);
  };
  const mapMarker = event => (
    <Marker
      key={event.slug}
      event={event}
      lat={event.metaData.location.latitude}
      lng={event.metaData.location.longitude}
      onClick={handleSelectedEventMarkerClick}
    />
  );
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAIFBfstWh9AF9fKp0-Cq_XTEYMx97Kg40"
        }}
        onChildClick={handleSelectedEventMarkerClick}
        defaultCenter={{ lat: 33.9592, lng: -118.4194 }}
        defaultZoom={9}
      >
        {props.events ? props.events.map(mapMarker) : ""}
      </GoogleMapReact>
    </div>
  );
};

export default MultipleMarkerMap;
