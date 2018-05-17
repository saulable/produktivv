import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			information: false
		};
		this.profile = true;
	}
	componentDidMount() {
		axios.defaults.headers.common['Authorization'] = localStorage.getItem(
			'jwtToken'
		);
		axios
			.get('/api/logged_in')
			.then(res => {
				this.setState({ information: res.data });
			})
			.catch(error => {
				if (error.response.status === 401) {
					this.props.history.push('/login');
				}
			});
	}
	render() {
		const { information } = this.state;
		if (!information) {
			return <div className="container">Loading...</div>;
		}
		return <div className="container">This is the profile page.</div>;
	}
}
export default Profile;
