import React from "react";
import GoogleMapReact from "google-map-react";
import Marker from "./Marker";

const SimpleMap = props => {
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: "50VH", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAIFBfstWh9AF9fKp0-Cq_XTEYMx97Kg40"
        }}
        center={{ lat: props.eventLatitude, lng: props.eventLongitude }}
        zoom={12}
      >
        <Marker lat={props.eventLatitude} lng={props.eventLongitude} text={props.eventName} />
      </GoogleMapReact>
    </div>
  );
};

export default SimpleMap;
