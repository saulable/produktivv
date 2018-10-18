import React, { Component } from 'react';
import { facebookLogin } from '../actions/authActions';
import { connect } from 'react-redux';

class SocialAuthRedirect extends Component {
	constructor(props){
		super(props);
	}
	componentWillMount() {
		const query = this.props.match.params.query;
		this.props.facebookLogin(query);
		this.props.history.push('/home');
	}
	render() {
		return <div />;
	}
}

export default connect(null, { facebookLogin })(SocialAuthRedirect);
