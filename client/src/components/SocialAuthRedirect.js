import React, { Component } from 'react';
import { facebookLogin } from '../actions/authActions';
import { connect } from 'react-redux';

class SocialAuthRedirect extends Component {
	componentWillMount() {
		const cookieMe = document.cookie.split('=')[1];
		this.props.facebookLogin(cookieMe);
		document.cookie = 'jwtToken=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
		this.props.history.push('/home');
	}
	render() {
		return <div />;
	}
}

export default connect(null, { facebookLogin })(SocialAuthRedirect);
