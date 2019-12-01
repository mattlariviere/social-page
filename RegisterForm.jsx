import React from "react";
// import { NavLink, Route } from "react-router-dom";
import * as userService from "../../services/userService";
import swal from "sweetalert";

class RegisterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      formData: {
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
      },
      showModal: false
    };
  }

  toggleModal = () => {
    this.setState(prevState => {
      return {
        showModal: !prevState.showModal
      };
    });
  };

  submitRegister = () => {
    let data = this.state.formData;
    console.log(data);
    //axios call
    userService
      .registerUser(data)
      .then(this.onPostRegisterSuccess)
      .catch(this.onPostRegisterFail);
  };

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: value
        }
      };
    });
  };

  onPostRegisterSuccess = response => {
    console.log(response);
    this.setState(prevState => {
      return {
        ...prevState,
        loggedIn: true
      };
    });
    swal("You have successfully registered!", "Continue to logging in!", "success");
    setTimeout(function() {
      window.location = "/HomePage";
    }, 700);
  };
  onPostRegisterFail = errResponse => {
    console.log(errResponse);
    swal("Please try again!", "Check that all your information is filled in correctly", "info");
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3>Registration Form</h3>
            <p>Please Fill out the following information:</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <form>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="form-control"
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="form-control"
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userId">Username</label>
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  className="form-control"
                  value={this.state.userId}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  className="form-control"
                  value={this.state.passwordConfirm}
                  onChange={this.handleChange}
                />
              </div>
              <button type="button" className="btn btn-info" onClick={this.submitRegister}>
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
