import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

// Imagine you have a list of languages that you'd like to autosuggest.
const languages = [
	{
		name: 'C',
		year: 1972
	},
	{
		name: 'Cocker Spaniel',
		year: 1972
	},
	{
		name: 'Coma',
		year: 1972
	},
	{
		name: 'Comaddddd',
		year: 1972
	},
	{
		name: 'Comrade',
		year: 1972
	},
	{
		name: 'Elm',
		year: 2012
	}
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0
		? []
		: languages.filter(
			lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
		);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

class ProjectAutoSuggest extends Component {
	constructor(props) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			suggestions: [],
			value: ''
		};
	}

	onChange = (event, { newValue, method }) => {
		this.props.onChange(this.props.id, event.target.value);
		if ('enter') {
			this.setState({
				value: newValue
			});
			this.props.onChange(this.props.id, newValue);
		}
	};

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: getSuggestions(value)
		});
	};

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	render() {
		const {suggestions, value } = this.state;

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: this.props.placeholder,
			value,
			onChange: this.onChange
		};
		// Finally, render it!
		return (
			<Autosuggest
				suggestions={suggestions}
				onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
				onSuggestionsClearRequested={this.onSuggestionsClearRequested}
				getSuggestionValue={getSuggestionValue}
				renderSuggestion={renderSuggestion}
				inputProps={inputProps}
			/>
		);
	}
}

export default ProjectAutoSuggest;
