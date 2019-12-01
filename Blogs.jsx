import React from "react";
import * as blogService from "../../services/blogService";
import BlogFormModal from "./BlogFormModal";
import SingleBlog from "./SingleBlog";
import LargeBlog from "./LargeBlog";
import swal from "sweetalert";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import BlogSearch from "./BlogSearch";
import { toast, ToastContainer } from "react-toastify";

class Blogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      showModal: false,
      isEditing: false,
      current: 0,
      total: 0,
      searchTerm: "",
      blogSearchResults: [],
      selectedBlog: [],
      blogs: [],
      formData: {
        title: "",
        shortTitle: "",
        content: "",
        shortDescription: "",
        slug: "",
        dateStart: "",
        // section: 0,
        statusId: 1,
        primaryImage: "",
        tags: ""
      }
    };
  }

  componentDidMount = () => {
    blogService
      .getAllBlogsByIndex(this.state.pageIndex)
      .then(this.onGetAllBlogsSuccess)
      .catch(this.onGetError);
  };
  //success functions
  onGetAllBlogsSuccess = data => {
    let blogs = data.item.pagedItems;
    this.setState(prevState => {
      return {
        ...prevState,
        blogs: blogs,
        selectedBlog: blogs[0],
        total: data.item.totalCount
      };
    });
  };
  // error function
  onGetError = data => {
    console.log(data);
  };

  /// pagination change
  onChange = page => {
    console.log(page);
    this.setState({
      current: page
    });
    blogService
      .getAllBlogsByIndex(page - 1)
      .then(this.onGetAllBlogsSuccess)
      .catch(this.onGetError);
  };

  //handler
  handleAddBlog = () => {
    this.toggle();
  };

  submitBlog = () => {
    //fire axios call
    let data = this.state.formData;
    // let metaData = {
    //   dateStart: this.state.formData.dateStart,
    //   section: this.state.formData.section
    // };
    let tags = data.tags.split(",");
    let date = data.dateAdded.slice(0, 10);
    data = {
      ...this.state.formData,
      dateAdded: date,
      tags: tags[0]
    };

    if (this.state.formData.id) {
      blogService
        .editBlog(data)
        .then(this.onUpdateBlogSuccess)
        .catch(this.onUpdateBlogError);
    } else {
      blogService
        .createBlog(data)
        .then(this.onCreateBlogSuccess)
        .catch(this.genericError);
    }
  };

  //on create blog success
  onCreateBlogSuccess = data => {
    this.toggle();
    console.log(data);
    let blog = { ...this.state.formData };
    blog = { ...blog, id: data.item };

    this.setState(prevState => {
      return {
        blogs: prevState.blogs.concat(blog)
      };
    });
    toast.info(`${blog.title} was created successfully!`, {
      autoClose: 2000
    });
  };
  //on update success
  onUpdateBlogSuccess = payload => {
    console.log(payload);
    let copyOfBlogs = [...this.state.blogs];
    let index = copyOfBlogs.findIndex(item => item.id === payload.id);

    if (index >= 0) {
      let blog = { ...copyOfBlogs[index] };
      let primaryImage = blog.primaryImage;
      blog = { ...payload, primaryImage: { ...primaryImage, imageUrl: payload.primaryImage } };
      console.log(blog);
      copyOfBlogs[index] = blog;
      this.setState(() => {
        return {
          blogs: copyOfBlogs
        };
      });
    }
    this.toggle();
  };

  //onUpdatestatus
  onUpdateStatusBlogSuccess = id => {
    console.log(id);
    // copy of list
    let copyOfBlogs = [...this.state.blogs];
    let index = copyOfBlogs.findIndex(item => item.id === id);
    // find the index by Id
    if (index >= 0) {
      // update or remove item from the index
      copyOfBlogs[index].statusId = 0;
      //delete is this
      copyOfBlogs.splice(index, 1);
      this.setState(() => {
        return {
          blogs: copyOfBlogs
        };
      });
    }
  };
  // error function
  onGetError = data => {
    console.log(data);
  };

  genericError = errMessage => {
    console.log(errMessage);
  };

  //
  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    //set state
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

  //utility functions
  mapBlog = blog => {
    return (
      <SingleBlog
        key={blog.id}
        blog={blog}
        onSelectedItemChange={this.onSelectedItemChange}
        onSelectedItemDelete={this.onSelectedItemDelete}
        onSelectedItemViewMore={this.onSelectedItemViewMore}
      />
    );
  };
  onSelectedItemChange = blog => {
    let date = blog.dateAdded.slice(0, 10);
    this.setState(() => {
      return {
        formData: { ...blog, dateAdded: date },
        isEditing: true
      };
    });
    this.toggle();
  };

  onSelectedItemDelete = id => {
    blogService
      .editStatusBlog(id)
      .then(this.onUpdateStatusBlogSuccess)
      .catch(this.onUpdateBlogError);
  };
  // selected page
  onSelectedPageClick = pageIndex => {
    this.setState(prevState => {
      return {
        ...prevState,
        pageIndex: pageIndex
      };
    });
    //fire on getbyIndex
    blogService
      .getAllBlogsByIndex(this.state.pageIndex)
      .then(this.onGetAllBlogsSuccess)
      .catch(this.onGetError);
  };

  onSelectedItemViewMore = blog => {
    this.setState(prevState => {
      return {
        ...prevState,
        selectedBlog: blog
      };
    });
  };

  //handle search Change
  handleSearchChange = e => {
    let searchTerm = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        searchTerm: searchTerm
      };
    });
  };

  // submitSearch
  submitSearch = () => {
    let searchTerm = this.state.searchTerm;
    blogService
      .searchBlogs(searchTerm)
      .then(this.onGetBlogsBySearchSuccess)
      .catch(this.onSearchError);
  };
  onGetBlogsBySearchSuccess = data => {
    let searchResults;
    if (data.item.pagedItems) {
      searchResults = data.item.pagedItems;
    } else if (data.item) {
      searchResults = data.item;
    }
    this.setState(prevState => {
      return {
        ...prevState,
        blogSearchResults: searchResults,
        selectedBlog: searchResults[0]
      };
    });
  };

  onSearchError = data => {
    console.log(data);
    swal("No blogs found", "Please try searching a different title", "info", { timer: 1500 });
  };

  //toggle function
  toggle = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        showModal: !prevState.showModal
      };
    });
  };
  render() {
    return (
      <React.Fragment>
        <div id="blogListDiv" className="col-md-8">
          <ToastContainer position={toast.POSITION.TOP_CENTER} />
          <h4 className="headline companyName">
            Blogs <i className="material-icons">comment</i>
          </h4>
          <div>
            <BlogSearch
              handleSearchChange={this.handleSearchChange}
              submitSearch={this.submitSearch}
              searchTerm={this.state.searchTerm}
            />
            <button className="btn btn-outline-info inline" onClick={this.handleAddBlog}>
              Add Blog
            </button>
          </div>
          {this.state.selectedBlog.primaryImage ? (
            <LargeBlog
              key={this.state.selectedBlog.id}
              blog={this.state.selectedBlog}
              onSelectedItemChange={this.onSelectedItemChange}
              onSelectedItemDelete={this.onSelectedItemDelete}
            />
          ) : (
            ""
          )}
        </div>
        <BlogFormModal
          toggle={this.toggle}
          handleChange={this.handleChange}
          submitBlog={this.submitBlog}
          showModal={this.state.showModal}
          formData={this.state.formData}
          handleAddBlog={this.handleAddBlog}
          isEditing={this.state.isEditing}
        />
        <div className="col-md-2">
          <div id="blogList">
            <h2 className="recentBlogs">Recently Added Blogs</h2>
            <h5 className="clickToRead">Click to read a post</h5>
            {/* append blogs here */}
            {this.state.searchTerm
              ? this.state.blogSearchResults.map(this.mapBlog)
              : this.state.blogs.map(this.mapBlog)}
          </div>
          <Pagination
            className="ant-pagination pagination"
            onChange={this.onChange}
            current={this.state.current}
            pageSize={5}
            total={this.state.total}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Blogs;
