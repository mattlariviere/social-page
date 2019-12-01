import React from "react";
import { NavLink } from "react-router-dom";

import HomepageText from "./users/HomepageText";
import swal from "sweetalert";

import * as userService from "../services/userService";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loggedIn: false,
      showHomepage: false,
      userData: {
        firstName: "",
        lastName: ""
      }
    };
  }
  componentDidMount = () => {
    userService
      .currentUserAuthentication()
      .then(this.onCurrentUserAuthenticationSuccess)
      .then(userService.getUserById)
      .then(this.onGetUserByIdSuccess)
      .catch(this.onGetError);
  };

  /// take away homepage text
  removeHomepage = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showHomepage: false
      };
    });
  };
  /// add homepage

  addHomepage = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showHomepage: true
      };
    });
  };

  //success authentication function
  onCurrentUserAuthenticationSuccess = payload => {
    // console.log(payload);
    //axios get by ID to get text-information
    return payload.item.actualUserId;
  };

  //on getUserById success
  onGetUserByIdSuccess = payload => {
    // payload.data.item
    let firstName = payload.item.firstName;
    let lastName = payload.item.lastName;
    //set userData to firstName and lastName
    this.setState(prevState => {
      return {
        ...prevState,
        loggedIn: !prevState.loggedIn,
        userData: {
          ...prevState.userData,
          firstName: firstName,
          lastName: lastName
        }
      };
    });
  };

  //ajax logout handler
  handleLogout = () => {
    //ajax logout
    userService
      .logout()
      .then(this.onLogoutSuccess)
      .catch(this.onLogoutError);
  };

  //success functions
  onLogoutSuccess = message => {
    swal("Logged Out", "We hope to see you soon!", "success");
    setTimeout(function() {
      window.location = "/HomePage";
    }, 700);
    console.log(message);
    this.setState(prevState => {
      return {
        ...prevState,
        loggedIn: false,
        showHomepage: false
      };
    });
  };

  //error function
  onLogoutError = errMessage => {
    console.log(errMessage);
  };

  // utility functions

  toggle = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };
  //

  render() {
    return (
      <React.Fragment>
        <div className="col-md-2 bg-light">
          <p id="welcomeName" className="welcomeName center">
            {this.state.userData.firstName
              ? `Welcome ${this.state.userData.firstName}!`
              : `Please sign in order to access information`}
          </p>
          <ul className="nav flex-column navbar-dark center">
            <hr />
            <li className="nav-item">
              <NavLink
                className="nav-link active text-info"
                onClick={this.addHomepage}
                to="/HomePage"
              >
                <i className="material-icons">home</i> Home
              </NavLink>
            </li>
            <hr />
            <li className="nav-item">
              <NavLink className="nav-link text-info" onClick={this.removeHomepage} to="/People">
                <i className="material-icons">people_outline</i> People
              </NavLink>
            </li>
            <hr />
            <li className="nav-item">
              <NavLink
                to="/Events"
                className="nav-link text-info"
                onClick={this.removeHomepage}
                href="#0"
              >
                <i className="material-icons">event_available</i>Events
              </NavLink>
            </li>
            <hr />
            <li className="nav-item">
              <NavLink className="nav-link text-info" onClick={this.removeHomepage} to="/Blogs">
                <i className="material-icons">comment</i> Blogs
              </NavLink>
            </li>
            <hr />
            <li className="nav-item">
              <NavLink
                className="nav-link text-info"
                onClick={this.removeHomepage}
                to="/TechCompanies"
                href="#0"
              >
                <i className="material-icons">bubble_chart</i> Tech Companies
              </NavLink>
            </li>
            <hr />
            <li className="nav-item">
              <a className="nav-link text-info" onClick={this.removeHomepage} href="#0">
                <i className="material-icons">work</i> Jobs
              </a>
            </li>
            <hr />
            {this.state.loggedIn ? (
              <li className="nav-item">
                <a className="nav-link text-info" id="logout" href="#0" onClick={this.handleLogout}>
                  <i className="material-icons">eject</i>Logout
                </a>
              </li>
            ) : (
              ""
            )}

            <hr />
          </ul>
        </div>
        {this.state.showHomepage ? <HomepageText /> : ""}
      </React.Fragment>
    );
  }
}

export default HomePage;
