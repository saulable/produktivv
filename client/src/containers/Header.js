import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {logout} from '../actions/index';
// import MainContent from './main_content.js';

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isClosed: true
		};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		console.log(event.target);
		event.target.className = '-active';
		if (this.state.isClosed) {
			this.setState({
				isClosed: false
			});
		} else {
			this.setState({
				isClosed: true
			});
		}
	}
	logout(e){
		e.preventDefault();
		this.props.logout();
	}
	render() {
		// const {isAuthenticated} = this.props.auth;
		const guestLink = (
			<ul className="right">
				<li>Log In</li>
			</ul>
		);
		// const { isAuthenticated } = this.props.auth;

		return (
			<nav>
				<div className="nav-wrapper container">
					<Link
						to={this.props.auth ? '/surveys' : '/'}
						className="left brand-logo"
					>
						Meal Management
					</Link>
					<ul className="right">
						<li><a href="#" onClick={this.logout.bind(this)}>Logout</a></li>
					</ul>
				</div>
			</nav>
		);
	}
}

Header.defaultProps = {
	openClass: 'collapse-open list-unstyled',
	closedClass: 'collapse list-unstyled'
};

function mapStateToProps({ auth }) {
	return { auth };
}
export default connect(mapStateToProps, {logout})(Header);
