import React, { Component } from "react";

import CountryDetails from "./components/CountryDetails";
import Loader from "./components/Loader";

import axios from "axios";

import "loaders.css/src/animations/ball-scale-multiple.scss";
import "./App.css";

export default class App extends Component {
  state = {
    data: "",
    country: "",
    loading: true
  };

  handleEnter = event => {
    event.key === "Enter" && this.getCovidInformation();
  };

  handleInputChange = event => {
    this.setState({ country: event.target.value });
  };

  handleSearchClick = () => {
    this.getCovidInformation();
  };

  getCovidInformation() {
    this.setState({ loading: true });
    const request = {
      data: { country: this.state.country },
      method: "POST",
      url: "https://coronavirus-covid19.herokuapp.com/country"
    };

    axios(request)
      .then(response => this.setState({ data: response.data }))
      .catch(err => this.setState({ response: err.message }))
      .finally(() => this.setState({ loading: false }));
  }

  componentDidMount() {
    this.getCovidInformation();
  }

  render() {
    return (
      <div className="App">
        <h1 className="mb5">Covid - 19 Live Updates</h1>
        <div className="flex-center wrap mb5">
          <input
            type="text"
            placeholder="Enter Country Name (Eg: US)"
            onChange={this.handleInputChange}
            onKeyDown={this.handleEnter}
            value={this.state.country}
            className="Search-Box"
          />
          <button
            type="button"
            onClick={this.handleSearchClick}
            className="Search-Button"
          >
            Search
          </button>
        </div>
        <div>
          {this.state.loading ? (
            <div className="Loader">
              <Loader
                type="ball-scale-multiple"
                active
                innerClassName="flex-center"
                color="#DC143C"
              />
            </div>
          ) : (
            <CountryDetails
              data={this.state.data}
              country={this.state.country}
            />
          )}
        </div>
      </div>
    );
  }
}
