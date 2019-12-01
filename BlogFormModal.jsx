import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const BlogFormModal = props => {
  return (
    <div>
      {props.showModal ? (
        <Modal isOpen={props.showModal} toggle={props.toggle} className={props.className}>
          <ModalHeader toggle={props.toggle}>Add Blog</ModalHeader>
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
                <label htmlFor="shortTitle">Short Title</label>
                <input
                  type="text"
                  name="shortTitle"
                  className="form-control"
                  id="shortTitle"
                  value={props.formData.shortTitle}
                  onChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  name="content"
                  className="form-control"
                  id="content"
                  value={props.formData.content}
                  onChange={props.handleChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="shortDescription">Short Description</label>
                <textarea
                  name="shortDescription"
                  className="form-control"
                  id="shortDescription"
                  value={props.formData.shortDescription}
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
                  <label htmlFor="dateStart">Date</label>
                  <input
                    type="date"
                    name="dateStart"
                    className="form-control"
                    id="dateStart"
                    value={props.formData.dateStart}
                    onChange={props.handleChange}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="section">Section</label>
                  <input
                    type="number"
                    name="section"
                    className="form-control"
                    min="1"
                    max="9"
                    id="section"
                    value={props.formData.section}
                    onChange={props.handleChange}
                  />
                </div> */}
                {/* <div className="form-group">
                  <label htmlFor="statusId">Status ID</label>
                  <input
                    type="number"
                    name="statusId"
                    className="form-control"
                    min="0"
                    max="1"
                    id="statusId"
                    value={props.formData.statusId}
                    onChange={props.handleChange}
                  />
                </div> */}
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control"
                  id="tags"
                  value={props.formData.tags}
                  onChange={props.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="primaryImage">Primary Image</label>
                <input
                  type="text"
                  name="primaryImage"
                  className="form-control"
                  id="primaryImage"
                  value={props.formData.primaryImage}
                  onChange={props.handleChange}
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button className="btn btn-secondary" onClick={props.submitBlog}>
              {props.isEditing ? `Update Blog` : `Submit Blog`}
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default BlogFormModal;
