import React from "react";
import GoogleMapReact from "google-map-react";

const Marker = props => {
  return (
    <div>
      <a href="#0" className="text-danger">
        <i className="material-icons">location_on </i>
      </a>
    </div>
  );
};

const SimpleMap = props => {
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "50VH", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAIFBfstWh9AF9fKp0-Cq_XTEYMx97Kg40"
        }}
        defaultCenter={{ lat: props.eventLatitude, lng: props.eventLongitude }}
        defaultZoom={12}
      >
        <Marker lat={props.eventLatitude} lng={props.eventLongitude} text={props.eventName} />
      </GoogleMapReact>
    </div>
  );
};

const MultipleMarkerMap = props => {
  // const handleSelectedEventMarkerClick = () => {
  //   props.selectedEventMarkerClick(props.event);
  // };
  const mapMarker = event => (
    <Marker
      key={event.id}
      event={event}
      lat={event.metaData.location.latitude}
      lng={event.metaData.location.longitude}
      onClick={props.selectedEventMarkerClick}
    />
  );
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAIFBfstWh9AF9fKp0-Cq_XTEYMx97Kg40"
        }}
        defaultCenter={{ lat: 33.9592, lng: -118.4194 }}
        defaultZoom={9}
      >
        {props.events ? props.events.map(mapMarker) : ""}
      </GoogleMapReact>
    </div>
  );
};

export { SimpleMap, Marker, MultipleMarkerMap };
