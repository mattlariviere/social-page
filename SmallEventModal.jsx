import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const SmallEventModal = props => {
  return (
    <div>
      {props.showModal ? (
        <Modal isOpen={props.showModal} toggle={props.toggle} className={props.className}>
          <ModalHeader toggle={props.toggle}>
            {props.selectedEvent.name ? props.selectedEvent.name : ""}
          </ModalHeader>
          <ModalBody>
            {/* content here */}
            {props.selectedEvent.metaData.dateStart
              ? props.selectedEvent.metaData.dateStart
              : ""} -{" "}
            {props.selectedEvent.metaData.dateEnd ? props.selectedEvent.metaData.dateEnd : ""}
          </ModalBody>
          <ModalFooter>{props.selectedEvent.summary}</ModalFooter>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default SmallEventModal;
