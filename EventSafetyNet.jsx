import React, { Component } from "react";
import * as eventsService from "../../services/eventsServices";
import EventCard from "./EventCard";
import swal from "sweetalert";
import SmallEventCard from "./SmallEventCard";
import EventFormModal from "./EventFormModal";
import SearchEvents from "./SearchEvents";
import { MultipleMarkerMap } from "./GoogleMapInsert";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Events extends Component {
  constructor() {
    super();
    this.state = {
      isEditing: false,
      selectedEventMarker: [],
      events: [],
      searchedEvents: [],
      selectedEvent: [],
      searchResults: {
        dateStart: "",
        dateEnd: ""
      },
      pageIndex: 0,
      current: 0,
      total: 0,
      showModal: false,
      isHovering: false,
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
  componentDidMount = () => {
    eventsService
      .getEvents()
      .then(this.onGetEventsSuccess)
      .catch(this.onGenericError);
  };
  //get success function
  onGetEventsSuccess = data => {
    let events = data.item.pagedItems;
    this.setState(prevState => {
      return {
        ...prevState,
        events: events,
        selectedEvent: events[0],
        total: data.item.totalCount
      };
    });
  };

  //generic erro
  onGenericError = data => {
    console.log(data);
  };
  onChange = page => {
    console.log(page);
    this.setState({
      current: page
    });
    eventsService
      .getAllEventsByIndex(page - 1)
      .then(this.onGetEventsSuccess)
      .catch(this.onGetError);
  };

  // submit Event funciton
  submitEvent = () => {
    geocodeByAddress(this.state.formData.metaData.location.address)
      .then(this.onGeocodeByAddressSuccess)
      .then(this.onGetLatLngFromAddress)
      .catch(this.onGenericError);
  };

  onGeocodeByAddressSuccess = results => {
    return getLatLng(results[0]);
  };
  onGetLatLngFromAddress = data => {
    let statusId = this.state.formData.statusId;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          statusId: statusId ? (statusId = 1) : (statusId = 0),
          ...prevState.formData,
          metaData: {
            ...prevState.formData.metaData,
            location: {
              ...prevState.formData.metaData.location,
              latitude: data.lat,
              longitude: data.lng
            }
          }
        }
      };
    });
    //submit the call
    let payload = this.state.formData;
    console.log(payload);
    if (payload.id) {
      eventsService
        .updateEvent(payload)
        .then(this.onUpdateEventSuccess)
        .catch(this.onGenericError);
    } else {
      eventsService
        .postEvent(payload)
        .then(this.onPostEventSuccess)
        .catch(this.onGenericError);
    }
  };

  //on update success
  onUpdateEventSuccess = payload => {
    let copyOfEvents = [...this.state.events];
    let index = copyOfEvents.findIndex(item => item.id === payload.id);
    if (index >= 0) {
      let event = { ...copyOfEvents[index] };
      copyOfEvents[index] = event;

      this.setState(prevState => {
        return {
          ...prevState,
          events: copyOfEvents
        };
      });
    }
    this.toggle();
    toast.info(`${copyOfEvents[index].title} was updated successfully!`, {
      autoClose: 2000
    });
  };

  //post success function
  onPostEventSuccess = data => {
    let event = { ...this.state.formData };
    console.log(event);
    this.setState(prevState => {
      return {
        events: prevState.events.concat(event)
      };
    });
    this.toggle();
    toast.info(`${event.name} was created successfully!`, {
      autoClose: 2000
    });
  };
  //handle change function
  handleChange = e => {
    let name = e.target.name;
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: value,
          metaData: {
            ...prevState.formData.metaData,
            [name]: value,
            location: {
              ...prevState.formData.metaData.location,
              [name]: value
            }
          }
        }
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

  //on selected view more click
  onSelectedItemViewMore = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedEvent: event
      };
    });
  };

  //search functions
  handleSearchChange = e => {
    // multiple values
    let name = e.target.name;
    let value = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        searchResults: {
          ...prevState.searchResults,
          [name]: value
        }
      };
    });
  };
  // submit search
  submitSearch = () => {
    let dateStart = this.state.searchResults.dateStart;
    let dateEnd = this.state.searchResults.dateEnd;
    eventsService
      .getEventBySearch(dateStart, dateEnd)
      .then(this.onGetEventsbySearchSuccess)
      .catch(this.onSearchError);
  };

  //search success fucntion
  onGetEventsbySearchSuccess = data => {
    let searchedEvents = data.item.pagedItems;
    this.setState(prevState => {
      return {
        ...prevState,
        searchedEvents: searchedEvents
      };
    });
  };
  ///search error function for sweet alert modal
  onSearchError = data => {
    console.log(data);

    swal("No events found", "Please try searching a different date", "info", { timer: 1500 });
  };

  //on selected page click
  onSelectedPagePagination = pageIndex => {
    this.setState(prevState => {
      return {
        ...prevState,
        pageIndex: pageIndex
      };
    });

    eventsService
      .getAllEventsByIndex(this.state.pageIndex)
      .then(this.onGetEventsSuccess)
      .catch(this.onGenericError);
  };

  mapEvent = event => (
    <SmallEventCard
      key={event.id}
      event={event}
      viewMore={this.viewMore}
      onSelectedItemClick={this.onSelectedItemClick}
      onSelectedItemViewMore={this.onSelectedItemViewMore}
    />
  );

  toggle = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showModal: !prevState.showModal
      };
    });
  };

  selectedEventMarkerClick = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedEvent: event,
        selectedEventMarker: event
      };
    });
  };

  handleMouseHover = event => {
    this.setState(prevState => {
      return {
        isHovering: !prevState.isHovering
      };
    });
    console.log(event);
  };
  render() {
    return (
      <React.Fragment>
        <div className="col-md-7 largeContent">
          {/* navBar start */}
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-item nav-link active text-info"
                id="nav-home-tab"
                data-toggle="tab"
                href="#nav-home"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                Browse Events
              </button>
              <button
                className="nav-item nav-link text-info"
                id="nav-profile-tab"
                data-toggle="tab"
                href="#nav-profile"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Events Map
              </button>
            </div>
          </nav>
          {/* navbar end */}
          {/* browse events tab start */}
          <div className="tab-content" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <ToastContainer position={toast.POSITION.TOP_CENTER} />
              <h4 className="headline companyName">
                Events <i className="material-icons">event_available</i>
              </h4>
              {this.state.selectedEvent.metaData ? (
                <EventCard
                  key={this.state.selectedEvent.id}
                  event={this.state.selectedEvent}
                  viewMore={this.viewMore}
                  onSelectedItemClick={this.onSelectedItemClick}
                  onSelectedItemViewMore={this.onSelectedItemViewMore}
                />
              ) : (
                ""
              )}
              {/* selected item content */}
            </div>
            {/* Browse Events tab */}

            {/* Browse Map events tab start */}
            <div
              className="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              {/* single map content goes here */}
            </div>
            <h4 className="headline companyName">
              Events Map<i className="material-icons">map</i>
            </h4>
            {/* Browse Map events end tab */}
            <div className="eventMap">
              <MultipleMarkerMap
                handleMouseHover={this.handleMouseHover}
                selectedEventMarkerClick={this.selectedEventMarkerClick}
                events={this.state.events}
              />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="center">
            <h3 className="upcomingEvents">Upcoming Events</h3>
            <div className="form-inline">
              <SearchEvents
                handleSearchChange={this.handleSearchChange}
                submitSearch={this.submitSearch}
                searchResults={this.state.searchResults}
              />
              <form>
                <button
                  type="button"
                  className="btn btn-outline-info inline float-right inlineBtns"
                  onClick={this.toggle}
                >
                  Add a new event!
                </button>
              </form>
            </div>
          </div>
          <EventFormModal
            toggle={this.toggle}
            formData={this.state.formData}
            handleChange={this.handleChange}
            showModal={this.state.showModal}
            submitEvent={this.submitEvent}
            isEditing={this.state.isEditing}
          />
          {/* events list will go here "eventCard" with the button */}
          {this.state.searchResults.dateStart
            ? this.state.searchedEvents.map(this.mapEvent)
            : this.state.events.map(this.mapEvent)}
          <Pagination
            className="ant-pagination pagination"
            onChange={this.onChange}
            current={this.state.current}
            total={this.state.total}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Events;
