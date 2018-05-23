import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../containers/Header';

class Profile extends Component {
	render() {
		return (
			<div>
				<Header /> <div className="container">This is the profile page.</div>
			</div>
		);
	}
}
export default Profile;
