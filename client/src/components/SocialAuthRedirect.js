import React, { Component } from 'react';

class SocialAuthRedirect extends Component {
	componentWillMount() {
		const cookieMe = document.cookie.split('=');
		localStorage.setItem('jwtToken', 'JWT ' + cookieMe[1]);
		this.props.history.push('/profile');
	}

	render() {
		return <div />;
	}
}

export default SocialAuthRedirect;
