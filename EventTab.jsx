import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from "reactstrap";
import classnames from "classnames";
import EventCard from "./EventCard";
import MultipleMarkerMap from "./MultipleMarkerMap";
import * as eventsService from "../../services/eventsServices";
// import EventPopover from "./EventPopover";

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
      selectedEventMarker: [],
      events: [],
      searchedEvents: [],
      selectedMarker: [],
      selectedEvent: [],
      formData: {
        name: "",
        headline: "",
        description: "",
        summary: "",
        slug: "",
        statusId: 0,
        metaData: {
          dateStart: 0,
          dateEnd: 0,
          location: {
            address: "",
            latitude: 0,
            longitude: 0,
            zipCode: 0
          }
        }
      }
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  selectedEventMarkerClick = slug => {
    console.log(slug);
    eventsService
      .getEventBySlug(slug)
      .then(this.onGetEventSuccess)
      .catch(this.onGenericError);
  };
  onGetEventSuccess = data => {
    let selectedMarker = data.item;
    //pop over with data
    this.setState(prevState => {
      return {
        ...prevState,
        selectedMarker: selectedMarker
      };
    });
  };
  //on sleected Item clic
  onSelectedItemClick = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        formData: event,
        isEditing: true
      };
    });
    this.toggle();
  };

  render() {
    return (
      <div>
        {/* <EventPopover selectedMarker={this.state.selectedMarker} /> */}
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              <span className="text-info">Browse Events</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              <span className="text-info">Event Map</span>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col md="12">
                <h4 className="headline companyName">
                  Browse Events
                  <i className="material-icons">event_available</i>
                </h4>
                {this.props.selectedEvent.metaData ? (
                  <EventCard
                    key={this.props.selectedEvent.id}
                    event={this.props.selectedEvent}
                    onSelectedItemClick={this.props.onSelectedItemClick}
                    onSelectedItemViewMore={this.onSelectedItemViewMore}
                  />
                ) : (
                  ""
                )}
                {/* selected item content */}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <h4 className="headline companyName">
                  Events Map
                  <i className="large material-icons">gps_fixed</i>
                </h4>

                <div className="eventMap">
                  <MultipleMarkerMap
                    selectedEventMarkerClick={this.selectedEventMarkerClick}
                    events={this.props.events}
                  />
                </div>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}
