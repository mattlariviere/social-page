import React from "react";

const PagePaginationBlogs = props => {
  const handleClickBack = () => {
    let pageIndex;
    if (props.pageIndex === 0) {
      pageIndex = props.pageIndex;
    } else {
      pageIndex = props.pageIndex - 1;
    }
    props.onSelectedPageClick(pageIndex);
  };
  const handleClick = e => {
    let pageIndex = e.target.id;
    props.onSelectedPageClick(pageIndex);
  };

  const handleClickForward = () => {
    props.onSelectedPageClick(props.pageIndex + 1);
  };

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
        <li className="page-item">
          <a className="page-link" onClick={handleClickBack} href="#0">
            &laquo;
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" id={0} onClick={handleClick} href="#0">
            1
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" id={1} onClick={handleClick} href="#0">
            2
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" id={2} onClick={handleClick} href="#0">
            3
          </a>
        </li>
        <li className="page-item">
          <a className="page-link" onClick={handleClickForward} href="#0">
            &raquo;
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PagePaginationBlogs;
