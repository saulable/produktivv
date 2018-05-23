import React, {Component} from 'react';
import {BrowserRouter, Route, withRouter} from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import SocialAuthRedirect from './SocialAuthRedirect';
import Header from '../containers/Header';

import requireAuth from '../services/requireAuth';

class App extends Component{
	render() {
		return (
			<div>
				<BrowserRouter>
					<div>
						<Route exact path='/' component={Home}/>
						<Route path='/social_auth' component={SocialAuthRedirect} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/register" component={Register} />
						<Route exact path='/profile' component={requireAuth(Profile)}/>
					</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
