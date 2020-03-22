import axios from "axios";
import Autosuggest from "react-autosuggest";
import { countries } from "./components/CountryCompleter/countries";
import CountryDetails from "./components/CountryDetails";
import Loader from "./components/Loader";
import React, { Component } from "react";

import "loaders.css/src/animations/ball-scale-multiple.scss";
import "./App.css";

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const removeDuplicateID = suggestion => {
  let newSuggestion = [];
  let lookup = {};
  for (let i in suggestion) {
    lookup[suggestion[i]["id"]] = suggestion[i];
  }

  for (let i in lookup) {
    newSuggestion.push(lookup[i]);
  }
  return newSuggestion;
};
const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }
  const regex = new RegExp("^" + escapedValue, "i");
  const suggestions = countries.filter(language => regex.test(language.label));
  return removeDuplicateID(suggestions);
};
export default class App extends Component {
  state = {
    data: "",
    country: "",
    suggestions: [],
    value: "",
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

  onChange = (event, { newValue, method }) => {
    this.setState({
      country: newValue
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.id;
  };

  renderSuggestion = suggestion => {
    return suggestion.id;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = async (e, selection) => {
    await this.setState({ country: selection.suggestionValue });
    this.getCovidInformation();
  };

  componentDidMount() {
    this.getCovidInformation();
  }

  render() {
    const { country, suggestions } = this.state;

    return (
      <div className="App">
        <h1 className="mb5">Covid - 19 Live UpdonSuggestionSelectedates</h1>
        <div className="flex-center wrap mb5">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            inputProps={{
              placeholder: "Enter Country Name (Eg: US)",
              value: country,
              onChange: (e, { newValue }) =>
                this.setState({ country: newValue }),
              onKeyDown: this.handleEnter
            }}
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
