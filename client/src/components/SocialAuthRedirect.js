import React, { Component } from 'react';
import { facebookLogin } from '../actions/authActions';
import { connect } from 'react-redux';

class SocialAuthRedirect extends Component {
	componentWillMount() {
		const cookieMe = document.cookie.split('=')[1];
		this.props.facebookLogin(cookieMe);
		this.props.history.push('/profile');
	}

	render() {
		return <div />;
	}
}

export default connect(null, { facebookLogin })(SocialAuthRedirect);
