import React from "react";
import swal from "sweetalert";

const LargeBlog = props => {
  const handleEdit = () => {
    props.onSelectedItemChange(props.blog);
  };

  const handleDelete = () => {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary blog!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal(
          "Your imaginary blog has been deleted!",
          {
            icon: "success"
          },
          props.onSelectedItemDelete(props.blog.id)
        );
      } else {
        swal("Your imaginary blog is safe!");
      }
    });
  };

  return (
    <div className="blog" key={props.blog.id}>
      <div>
        <h4 className="blogTitle">{props.blog.title}</h4>
      </div>
      <div>
        <p className="blogAuthor">By: {props.blog.userId ? props.blog.userId : "Unknown"}</p>
        <p className="dateCreated">
          Date: {props.blog.dateAdded ? props.blog.dateAdded.slice(0, 10) : ""}
        </p>
      </div>
      <hr />
      <div className="blogContent">
        <img
          className="blogImage"
          src={props.blog.primaryImage ? props.blog.primaryImage : ""}
          height="400px"
          width="600px"
          alt={props.blog.primaryImage}
        />
        <p className="content">{props.blog.content}</p>
      </div>
      <button type="button" onClick={handleEdit} className="edit btn btn-outline-info float-left">
        Edit Blog
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="edit btn btn-outline-secondary float-right"
      >
        Remove Blog
      </button>
    </div>
  );
};

export default LargeBlog;
