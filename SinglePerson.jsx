import React from "react";
import { Card, CardText, CardBody, CardHeader } from "reactstrap";
import swal from "sweetalert";

const SinglePerson = props => {
  const handleEdit = () => {
    props.onSelectedItemChange(props.person);
  };

  const handleDelete = () => {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this imaginary person!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal(
          "Your imaginary person has been deleted!",
          {
            icon: "success"
          },
          props.onSelectedItemDelete(props.person)
        );
      } else {
        swal("Your imaginary person is safe!");
      }
    });
  };

  return (
    <Card className="person " key={props.person.id}>
      <CardHeader className="center" style={{ fontWeight: "bold" }}>
        {props.person.title}
      </CardHeader>
      <CardBody>
        <img
          src={
            props.person.primaryImage === null
              ? "data:image/jpeg;base64,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"
              : props.person.primaryImage
          }
          height="200px"
          width="350px"
          alt="https://bit.ly/2l3EfE3"
          style={{ marginLeft: "45px" }}
        />
        <CardText className="center">{props.person.bio}</CardText>
      </CardBody>
      <button type="button" className="btn btn-outline-info" onClick={handleEdit}>
        Edit
      </button>
      <button type="button" className="btn btn-outline-dark float-right" onClick={handleDelete}>
        Delete
      </button>
    </Card>
  );
};

export default SinglePerson;
