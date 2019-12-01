import React from "react";
import swal from "sweetalert";
import * as peopleService from "../../services/peopleService";
import SinglePerson from "./SinglePerson";
import PeopleForm from "./PeopleForm";
import SearchPeople from "./SearchPeople";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { NavLink } from "react-router-dom";

class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      people: [],
      searchResults: [],
      current: 0,
      total: 0,
      showModal: false,
      listOfSkills: [],
      selectedOption: null,
      query: "",
      editButtonClicked: false,
      formData: {
        title: "",
        userId: "",
        bio: "",
        summary: "",
        headline: "",
        slug: "",
        statusId: 0,
        primaryImage: "https://bit.ly/2o53l6v",
        skills: []
      }
    };
  }

  //component did mount get

  componentDidMount = () => {
    let pageIndex = this.state.pageIndex;
    peopleService
      .getAllPeopleByIndex(pageIndex)
      .then(this.onGetAllPeopleSuccess)
      .catch(this.onGetError);

    //get all skills
    peopleService
      .getAllSkills()
      .then(this.onGetSkillsSuccess)
      .catch(this.onGetError);
  };

  /// pagination change
  onChange = page => {
    console.log(page);
    this.setState({
      current: page
    });
    peopleService
      .getAllPeopleByIndex(page - 1)
      .then(this.onGetAllPeopleSuccess)
      .catch(this.onGetError);
  };
  onGetSkillsSuccess = response => {
    console.log(response);
    this.setState(prevState => {
      return {
        ...prevState,
        listOfSkills: response.items
      };
    });
  };
  onGetAllPeopleSuccess = message => {
    let people = message.item.pagedItems;
    // let data = { ...this.state, ...this.state.people, people };

    this.setState(prevState => {
      return {
        ...prevState,
        people: people,
        total: message.item.totalCount
      };
    });
  };

  onGetError = errMessage => {
    console.log(errMessage);
    if (this.state.query) {
      swal("No people found", "Please try searching a different name", "info", { timer: 1500 });
    }
  };

  //handler

  getSearch = () => {
    let query = this.state.query;
    peopleService
      .getPeopleBySearch(query)
      .then(this.onGetPeopleBySearchSuccess)
      .catch(this.onGetError);
  };

  onGetPeopleBySearchSuccess = data => {
    let searchResults = data.item.pagedItems;
    this.setState(prevState => {
      return {
        ...prevState,
        searchResults: searchResults
      };
    });
  };

  handleSearch = e => {
    let query = e.target.value;
    this.setState(prevState => {
      return {
        ...prevState,
        query: query
      };
    });
  };
  handleSelect = e => {
    let skill = e;
    this.setState(prevState => {
      return {
        ...prevState,
        skills: skill
      };
    });
  };

  handleChange = e => {
    let name = e.target.name;
    let value = e.target.value;

    this.setState(prevState => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          [name]: value,
          statusId: 1
        }
      };
    });
  };

  //axios calls
  //axios submit handler
  submitPerson = () => {
    let data = { ...this.state.formData };
    data.skills = data.skills.map(item => item.value);
    if (this.state.formData.id) {
      peopleService
        .updatePerson(data)
        .then(this.onUpdatePersonSuccess)
        .catch(this.onUpdateError);
    } else {
      peopleService
        .postPerson(data)
        .then(this.onPostPersonSuccess)
        .catch(this.onPostPersonError);
    }
  };
  //post success functions
  onPostPersonSuccess = payload => {
    console.log(payload);
    let person = { ...this.state.formData };

    person = {
      ...person,
      // primaryImage: { imageUrl: person.primaryImage },
      id: payload.item
    };
    console.log(person);

    this.setState(prevState => {
      return {
        people: prevState.people.concat(person)
      };
    });

    this.toggle();
    toast.info(`${person.title} was created successfully!`, {
      autoClose: 2000
    });
  };
  //update status success function
  onUpdateStatusSuccess = id => {
    console.log(id);
    // copy of list
    let copyOfPeople = [...this.state.people];
    let index = copyOfPeople.findIndex(item => item.id === id);
    // find the index by Id
    if (index >= 0) {
      // update or remove item from the index
      copyOfPeople[index].statusId = 0;
      //delete is this
      copyOfPeople.splice(index, 1);
      this.setState(() => {
        return {
          people: copyOfPeople
        };
      });
    }
  };

  // update success function
  onUpdatePersonSuccess = payload => {
    //copy of list
    let copyOfPeople = [...this.state.people];
    let index = copyOfPeople.findIndex(item => item.id === payload.id);

    if (index >= 0) {
      let person = { ...copyOfPeople[index] };
      person = { ...payload };
      console.log(person);
      copyOfPeople[index] = person;
      this.setState(() => {
        return {
          people: copyOfPeople
        };
      });
    }
    this.toggle();
    toast.info(`${copyOfPeople[index].title} was updated successfully!`, {
      autoClose: 2000
    });
  };
  //post error function
  onPostPersonError = data => {
    console.log(data);
  };

  //on person click handler
  onSelectedItemChange = person => {
    // if click was edit
    this.setState(prevState => {
      return {
        ...prevState,
        editButtonClicked: !prevState.editButtonClicked,
        formData: person
      };
    });
    this.toggle();
  };

  onSelectedItemDelete = person => {
    let personToDelete = { ...person, statusId: 0 };
    personToDelete.skills = personToDelete.skills.map(item => item.Id);
    peopleService
      .updateStatus(personToDelete)
      .then(this.onUpdateStatusSuccess)
      .catch(this.onUpdateError);
  };

  //utility functions

  toggle = () => {
    this.setState((prevState, props) => {
      return {
        ...prevState,
        showModal: !prevState.showModal
      };
    });
  };

  mapPerson = person => (
    <SinglePerson
      onSelectedItemChange={this.onSelectedItemChange}
      onSelectedItemDelete={this.onSelectedItemDelete}
      key={person.id}
      person={person}
    />
  );
  render() {
    return (
      <React.Fragment>
        <div id="peopleListDiv" className="col-md-10">
          <ToastContainer position={toast.POSITION.TOP_CENTER} />
          <SearchPeople
            getSearch={this.getSearch}
            handleSearch={this.handleSearch}
            query={this.state.query}
          />
          <h1 className="headline companyName">
            People <i className="material-icons">people_outline</i>
          </h1>

          <div>
            <PeopleForm
              submitPerson={this.submitPerson}
              handleChange={this.handleChange}
              showModal={this.state.showModal}
              formData={this.state.formData}
              toggle={this.toggle}
              editButtonClicked={this.state.editButtonClicked}
              listOfSkills={this.state.listOfSkills}
              handleSelect={this.handleSelect}
            />
          </div>
          <div id="peopleList">
            {/* people append here */}
            {this.state.query
              ? this.state.searchResults.map(this.mapPerson)
              : this.state.people.map(this.mapPerson)}
          </div>
          <Pagination
            className="ant-pagination pagination"
            onChange={this.onChange}
            current={this.state.current}
            pageSize={6}
            total={this.state.total}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default People;
