import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import { checkedLogin } from '../actions/authActions';

export default function(ComposedComponent) {
	class Authenticate extends Component {
		componentWillMount() {
			if (!this.props.isAuthenticated) {
				const token = localStorage.getItem('jwtToken');
				if (token) {
					this.props.checkedLogin(token);
					// this.props.history.push('/home');
				} else {
					this.props.addFlashMessage({
						type: 'error',
						text: 'You need to login to access this page'
					});
					return this.props.history.push('/');
				}
			}
		}

		render() {
			return <ComposedComponent {...this.props} />;
		}
	}
	function mapStateToProps({ isAuthenticated }) {
		return { isAuthenticated };
	}

	return connect(mapStateToProps, { addFlashMessage, checkedLogin })(
		Authenticate
	);
}
