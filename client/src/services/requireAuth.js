import React, { Component } from 'react';
import { connect } from 'react-redux';
import {addFlashMessage} from '../actions/flashMessages';

export default function(ComposedComponent) {
	class Authenticate extends Component {
		componentWillMount() {
			if (!this.props.isAuthenticated) {
				this.props.addFlashMessage({
					type: 'error',
					text: 'You need to login to access this page'
				});
				this.props.history.push('/login');
			}
		}
		componentWillUpdate(nextProps) {
			if (!nextProps.isAuthenticated) {
				this.props.history.push('/');
			}
		}
		render() {
			return <ComposedComponent {...this.props} />;
		}
	}
	const mapStateToProps = state => ({
		isAuthenticated: state.auth.isAuthenticated
	});

	const mapDispatchToProps = dispatch => ({});

	return connect(mapStateToProps, {addFlashMessage})(Authenticate);
}
