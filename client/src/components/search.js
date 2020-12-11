import * as React from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import Result from './result';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [],
      selectedSuggestion: null
    };
  }

  renderSuggestion = pokemonObj => (
    <span>
      {pokemonObj.name}
    </span>
  );

  handleChange = (event, valueObj) => {
    const value = valueObj.newValue;
    this.setState({value});
  };

  async componentDidUpdate(prevProps, prevState) {
    let suggestions = [];
    if (this.state.value && this.state.value !== prevState.value) {
      suggestions = (await axios.get(`http://localhost:3000/api/pokemon?queryText=${this.state.value}`)).data;
      this.setState({
        suggestions
      });
    }
  }

  suggestionSelected = (event, {suggestion}) => {
    this.setState({selectedSuggestion: suggestion})
  };

  getSuggestionValue = suggestion => suggestion.name;

  render() {
    const { value, suggestions } = this.state;
    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={() => {}}
          onSuggestionsClearRequested={() => {}}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.suggestionSelected}
          inputProps={
            {
              placeholder: 'Search pokemon',
              value,
              onChange: this.handleChange
            }
          }
        />
        {
          this.state.selectedSuggestion && <Result name={this.state.selectedSuggestion.name} url={this.state.selectedSuggestion.url}/>
        }
      </div>

    );
  }
}
