import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const EventFormModal = props => {
  return (
    <div>
      <Modal isOpen={props.showModal} toggle={props.toggle} className={props.className}>
        <ModalHeader toggle={props.toggle}>Event Form</ModalHeader>
        <ModalBody>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name of Event</label>
              <input
                type="text"
                name="name"
                className="form-control"
                id="name"
                value={props.formData.name}
                onChange={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="headline">HeadLine</label>
              <input
                type="text"
                name="headline"
                className="form-control"
                id="headline"
                value={props.formData.headline}
                onChange={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                name="description"
                className="form-control"
                id="description"
                value={props.formData.description}
                onChange={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="summary">Summary</label>
              <textarea
                name="summary"
                className="form-control"
                id="summary"
                value={props.formData.summary}
                onChange={props.handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                name="slug"
                className="form-control"
                id="slug"
                value={props.formData.slug}
                onChange={props.handleChange}
              />
            </div>
            <div className="input-group">
              <div className="form-group">
                <label htmlFor="dateStart">Date Start</label>
                <input
                  type="date"
                  name="dateStart"
                  className="form-control"
                  id="dateStart"
                  value={props.formData.metaData.dateStart}
                  onChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateEnd">Date End</label>
                <input
                  type="date"
                  name="dateEnd"
                  className="form-control"
                  id="dateEnd"
                  value={props.formData.metaData.dateEnd}
                  onChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="statusId">Active</label>
                <input
                  type="checkbox"
                  name="statusId"
                  id="status"
                  value={props.formData.statusId}
                  onChange={props.handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                id="address"
                value={props.formData.metaData.location.address}
                onChange={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                className="form-control"
                id="zipCode"
                value={props.formData.metaData.location.zipCode}
                onChange={props.handleChange}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-secondary" onClick={props.submitEvent}>
            {props.isEditing ? `Update a previous Event` : `Create a new Event`}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EventFormModal;
