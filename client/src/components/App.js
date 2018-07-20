import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import $ from 'jquery';
import 'foundation-sites';

import Home from './Home';
import Index from '../containers/HomePages/Index';
import Login from '../containers/HomePages/Login';
import Register from '../containers/HomePages/Register';
import SocialAuthRedirect from './SocialAuthRedirect';
import DailyJournal from './Journals/DailyJournal/DailyJournal';
import DailyCalendar from './Calendar/DailyCalendar';
import AddTask from './Calendar/AddTask';
import Tracks from './Tracks/Dashboard';

import requireAuth from '../services/requireAuth';

class App extends Component {
	componentDidMount() {
		$(document).foundation();
	}
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Index} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route path="/social_auth" component={SocialAuthRedirect} />
					<Route exact path="/home" component={requireAuth(Home)} />
					<Route exact path="/daily" component={requireAuth(DailyJournal)} />
					<Route
						exact
						path="/daily_calendar"
						component={requireAuth(DailyCalendar)}
					/>
					<Route exact path="/edit_task" component={requireAuth(AddTask)} />
					<Route exact path="/tracks" component={requireAuth(Tracks)} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
