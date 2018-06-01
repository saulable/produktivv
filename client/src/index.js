/* global process */
import './styles/bootstrap.min.css';
import './styles/main.scss';
import './styles/sidebar.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import registerServiceWorker from './registerServiceWorker';
import reduxThunk from 'redux-thunk';
import App from './components/App';
import reducers from './reducers';

//development only axios helpers
import axios from 'axios';
window.axios = axios;

const store = createStore(
	reducers,
	{},
	compose(
		applyMiddleware(reduxThunk),
		window.devToolsExtension ? window.devToolsExtension() : f => f
	)
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
