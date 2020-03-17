import React, { Component } from "react";
import axios from "axios";

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
      url: "http://localhost:8888/country"
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
    return this.state.loading ? (
      "loading..."
    ) : (
      <div>
        <h1>Covid - 19 Case Updates</h1>

        <input
          type="text"
          placeholder="Enter Country Name (Eg: US)"
          onChange={this.handleInputChange}
          onKeyDown={this.handleEnter}
        />
        <button type="button" onClick={this.handleSearchClick}>
          Search
        </button>
        {JSON.stringify(this.state.data, null, 2)}
      </div>
    );
  }
}
