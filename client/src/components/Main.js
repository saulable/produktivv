import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Main extends Component {
	render() {
		return (
			<div>
				Hello and welcome to the best Agile Results software on the planet.
				<Link to="login">Login</Link>
			</div>
		);
	}
}
export default Main;
