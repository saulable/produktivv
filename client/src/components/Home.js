import React, { Component } from 'react';
import LeftNavigation from '../containers/LeftNavigation';

class Home extends Component {
	render() {
		return (
			<div className="wrapper">
				<LeftNavigation/>
				<div className="wrapper content">This is the home page.</div>
			</div>
		);
	}
}


export default Home;
