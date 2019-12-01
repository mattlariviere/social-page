import React from "react";
import { Card, CardText, CardBody, CardHeader } from "reactstrap";

const SingleBlog = props => {
  const handleToViewMore = () => {
    props.onSelectedItemViewMore(props.blog);
  };
  return (
    <Card className="smallBlog" key={props.blog.id} onClick={handleToViewMore}>
      <CardHeader className="smallBlogTitle">{props.blog.title}</CardHeader>
      <CardBody>
        <CardText className="smallBlogAuthor">
          {props.blog.userId ? props.blog.userId : "Unknown"}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default SingleBlog;
