import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import SocialAuthRedirect from './SocialAuthRedirect';
import DailyJournal from './Journals/DailyJournal';
import DailyCalendar from './Calendar/DailyCalendar';
import AddTask from './Calendar/AddTask';
import Tracks from './Tracks/Dashboard';

import requireAuth from '../services/requireAuth';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={Main} />
					<Route path="/social_auth" component={SocialAuthRedirect} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/home" component={requireAuth(Home)} />
					<Route exact path="/daily" component={requireAuth(DailyJournal)} />
					<Route exact path="/daily_calendar" component={requireAuth(DailyCalendar)} />
					<Route exact path="/edit_task" component={requireAuth(AddTask)} />
					<Route exact path="/tracks" component={requireAuth(Tracks)} />

				</Switch>
			</BrowserRouter>
		);
	}
}

export default App;
