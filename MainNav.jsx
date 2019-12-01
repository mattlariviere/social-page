import React from "react";
import { NavLink } from "react-router-dom";
import * as userService from "../services/userService";

class MainNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
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
  //success authentication function
  onCurrentUserAuthenticationSuccess = payload => {
    // console.log(payload);
    //axios get by ID to get information
    return payload.item.actualUserId;
  };

  //on getUserById success
  onGetUserByIdSuccess = payload => {
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

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-dark bg-info">
          <a className="navbar-brand companyName" href="#0">
            TILES<i className="material-icons">polymer</i>
          </a>
          <button className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              {this.state.loggedIn ? (
                ""
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/RegisterForm">
                    Register
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/LogIn">
                  {this.state.userData.firstName
                    ? `${this.state.userData.firstName} ${this.state.userData.lastName}`
                    : "Log In"}
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default MainNav;
