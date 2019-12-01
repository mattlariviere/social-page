import React from "react";
import * as userService from "../../services/userService";
import LogInModal from "./LogInModal";
import HomepageText from "./HomepageText";
import swal from "sweetalert";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: "",
        password: ""
      },
      loggedIn: false,
      showModal: true,
      userData: {
        firstName: "",
        lastName: ""
      }
    };
  }

  //handler functions

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

  //axios functions

  submitUser = () => {
    this.toggle();
    let data = this.state.formData;

    userService
      .logIn(data)
      .then(this.onSubmitUserSuccess)
      .catch(this.onSubmitUserError);
  };

  //on login success functions;

  onSubmitUserSuccess = message => {
    console.log(message);
    swal("Logged In", "Welcome Back!", "success");
    setTimeout(function() {
      window.location = "/HomePage";
    }, 700);
    this.setState(prevState => {
      return {
        ...prevState,
        loggedIn: true
      };
    });
  };

  //axios error function

  onSubmitUserError = errMessage => {
    this.toggle();
    console.log(errMessage);
    swal("Log In Failed", "Your username and password are invalid. Please try again.", "warning");
  };

  onGetError = message => {
    console.log(message);
  };

  //utility functions
  toggle = () => {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        showModal: !prevState.showModal
      };
    });
  };

  resetForm = () => {
    this.setState(prevState => {
      return {
        ...prevState.formData,
        email: "",
        password: ""
      };
    });
  };

  render() {
    return (
      <div className="offset-col-2 col-md-8">
        <LogInModal
          handleChange={this.handleChange}
          toggle={this.toggle}
          showModal={this.state.showModal}
          email={this.state.email}
          password={this.state.password}
          submitUser={this.submitUser}
        />
        {this.state.loggedIn ? <HomepageText /> : ""}
      </div>
    );
  }
}

export default Login;
