import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';


import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import SocialAuthRedirect from './SocialAuthRedirect';

class App extends Component{
	render() {
		return (
			<div className="container">
				<BrowserRouter>
					<div>
						<Route exact path='/' component={Home}/>
						<Route exact path='/profile' component={Profile}/>
						<Route path='/social_auth' component={SocialAuthRedirect} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
