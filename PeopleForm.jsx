import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const PeopleForm = props => {
  const mapSkill = skill => {
    return {
      value: skill.Id,
      label: skill.Name
    };
  };
  return (
    <div>
      <div className="row">
        <div className="offset-md-10">
          <button
            type="button"
            className=" btn btn-outline-info float-right"
            onClick={props.toggle}
          >
            Add person here!
          </button>
        </div>
      </div>
      <div className="row">
        {props.showModal ? (
          <Modal isOpen={props.showModal} toggle={props.toggle} className={props.className}>
            <ModalHeader toggle={props.toggle}>Add People</ModalHeader>
            <ModalBody>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    id="title"
                    value={props.formData.title}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userId">Username</label>
                  <input
                    type="text"
                    name="userId"
                    className="form-control"
                    id="userId"
                    value={props.formData.userId}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <input
                    type="text"
                    name="bio"
                    className="form-control"
                    id="bio"
                    value={props.formData.bio}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="summary">Summary</label>
                  <input
                    type="text"
                    name="summary"
                    className="form-control"
                    id="summary"
                    value={props.formData.summary}
                    onChange={props.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="headline">Headline</label>
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
                <div className="form-group">
                  <label htmlFor="skills">Skills</label>

                  <Select
                    options={props.listOfSkills.map(mapSkill)}
                    onChange={props.handleSelect}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    name="skill"
                    components={animatedComponents}
                    closeMenuOnSelect={false}
                    isMulti
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="primaryImage">Primary Image</label>
                  <input
                    type="text"
                    name="primaryImage"
                    className="form-control"
                    id="primaryImage"
                    placeholder="www.image.url"
                    value={props.formData.primaryImage}
                    onChange={props.handleChange}
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button className="btn btn-secondary" onClick={props.submitPerson}>
                {props.editButtonClicked ? `Update Person` : `Submit Person`}
              </Button>
            </ModalFooter>
          </Modal>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PeopleForm;
