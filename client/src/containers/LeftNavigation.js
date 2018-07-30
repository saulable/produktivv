import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../actions/logout';
import ProfilePhoto from './man.png';

class LeftNavigation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isClosed: true
		};
		this.handleClick = this.handleClick.bind(this);
	}
	logout(e) {
		e.preventDefault();
		this.props.logout();
		window.location.reload();
	}
	handleClick(event) {
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
	render() {
		return (
			<nav className="sidebar">
				<div className="sidebar-x">
					<div className="sidebar-header">
						<Link to="/home">
							<div className="logo" />
						</Link>
						<div className="sidebar-profile">
							<div className="sidebar-profile-image">
								<img
									alt="profile"
									src={ProfilePhoto}
									className="profile-photo"
								/>
							</div>
							<div className="sidebar-profile-links">
								<a href="# " onClick={this.logout.bind(this)}>
									<span>Logout</span>
								</a>

								<span>Edit Profile</span>
								<span>0/3</span>
							</div>
						</div>
					</div>
				</div>

				<ul className="left-nav list-unstyled components">
					<li>
						<Link to="/daily">Daily Journal</Link>
					</li>
					<li>
						<Link to="/daily_calendar">Calendar</Link>
					</li>
					<li>
						<Link to="/tracks">Tracks</Link>
					</li>
					<li>
						<Link to="/weekly">Weekly Journal</Link>
					</li>
					<li>
						<Link to="/weekly">Yearly Journal</Link>
					</li>
					<li>
						<Link to="/weekly">Life Stories</Link>
					</li>
				</ul>
			</nav>
		);
	}
}

LeftNavigation.defaultProps = {
	openClass: 'collapse-open list-unstyled',
	closedClass: 'collapse list-unstyled'
};

function mapStateToProps({ menu }) {
	return { menu };
}
export default connect(
	mapStateToProps,
	{ logout }
)(LeftNavigation);
