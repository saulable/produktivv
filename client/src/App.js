import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			books: []
		};
	}
	componentDidMount() {
		axios.defaults.headers.common['Authorization'] = localStorage.getItem(
			'jwtToken'
		);
		axios
			.get('/api/book')
			.then(res => {
				this.setState({ books: res.data });
				console.log(this.state.books);
			})
			.catch(error => {
				if (error.response.status === 401) {
					this.context.history.push('/login');
				}
			});
	}
	logout(){
		localStorage.removeItem('jwtToken');
		window.location.reload();
	}
	render() {
		return (
			<div className="container">
			</div>
		);
	}
}

export default App;
