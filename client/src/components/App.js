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
import WeeklyJournal from './Journals/WeeklyJournal/WeeklyJournal';
import DailyCalendar from './Calendar/DailyCalendar';
import AddTask from './Calendar/AddTask';
import Tracks from './Tracks/TrackDashboard';
import Hats from './Hats/Index';
// import Review from './Review/Dashboard';

import requireAuth from '../services/requireAuth';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Index} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route path="/social_auth/:query" component={SocialAuthRedirect} />
					<Route exact path="/home" component={requireAuth(Home)} />
					<Route exact path="/daily" component={requireAuth(DailyJournal)} />
					<Route exact path="/weekly" component={requireAuth(WeeklyJournal)} />
					<Route exact path="/daily_calendar" component={requireAuth(DailyCalendar)} />
					<Route exact path="/edit_task" component={requireAuth(AddTask)} />
					<Route exact path="/tracks" component={requireAuth(Tracks)} />
					<Route exact path="/hats" component={requireAuth(Hats)} />
					<Route exact path="/review" component={requireAuth(Hats)} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
