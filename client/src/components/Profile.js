import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LeftNavigation from '../containers/LeftNavigation';

class Profile extends Component {
	render() {
		return (
			<div>
				<LeftNavigation /> <div className="container">This is the profile page.</div>
			</div>
		);
	}
}
export default Profile;
