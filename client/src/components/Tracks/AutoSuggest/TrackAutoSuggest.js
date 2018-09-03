import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import {handleTracksChange, getTracks} from '../../../actions/calendarActions';
import {connect} from 'react-redux';

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
const getSuggestions = (value, trackSuggest) => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0
		? []
		: trackSuggest.filter(
			lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue
		);
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

class TrackAutoSuggest extends Component {
	constructor(props) {
		super(props);

		// Autosuggest is a controlled component.
		// This means that you need to provide an input value
		// and an onChange handler that updates this value (see below).
		// Suggestions also need to be provided to the Autosuggest,
		// and they are initially empty because the Autosuggest is closed.
		this.state = {
			suggestions: [],
			value: '',
			suggestError: false,
		};
	}
	componentDidMount(){
		this.props.getTracks();
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
	onSuggestionsFetchRequested = async ({ value }) => {
		const {trackSuggest} = this.props.calendar;
		await this.setState({
			suggestions: getSuggestions(value, trackSuggest)
		});
		if (this.state.suggestions.length === 0){
			this.setState({suggestError: true});
		}else {
			this.setState({suggestError: false});
		}
		console.log(this.state.suggestError);
	};

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: [],
			suggestError: false,
		});
	};

	render() {
		const {suggestions} = this.state;
		const {value} = this.props;
		const errorBorder = this.state.suggestError ? { 'border-bottom' : '3px solid red'} : null;
		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: this.props.placeholder,
			value,
			onChange: this.onChange,
			style: errorBorder
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
				onSuggestionSelected={this.props.onSuggestionSelected}
			/>
		);
	}
}
function mapStateToProps({calendar}){
	return {calendar};
}
export default connect(mapStateToProps, {handleTracksChange, getTracks})(TrackAutoSuggest);
