import React, { Component } from 'react';
import LeftNavigation from '../containers/LeftNavigation';

class Home extends Component {
	render() {
		return (
			<div className="container">
				<LeftNavigation/>
				<div className="content-x">This is the home page.</div>
			</div>
		);
	}
}


export default Home;
