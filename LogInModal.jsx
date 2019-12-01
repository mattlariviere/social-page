import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const LogInModal = props => {
  return (
    <div>
      {props.showModal ? (
        <Modal isOpen={props.showModal} toggle={props.toggle} className={props.className}>
          <ModalHeader toggle={props.toggle}>Log in</ModalHeader>
          <ModalBody>
            {" "}
            <form id="loginForm">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={props.email}
                  onChange={props.handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={props.password}
                  onChange={props.handleChange}
                  className="form-control"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-info" onClick={props.submitUser}>
              Login
            </button>
          </ModalFooter>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default LogInModal;
