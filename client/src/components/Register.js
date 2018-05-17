import React, { Component } from 'react';
import axios from 'axios';
import '../styles/login.css';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: ''
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange({ target: { name, value } }) {
		this.setState({ [name]: value });
	}
	onSubmit(event) {
		event.preventDefault();
		const { username, password } = this.state;
		axios.post('/api/auth/register', { username, password }).then(result => {
			this.props.history.push('/login');
		});
	}
	render() {
		const { username, password } = this.state;
		return (
			<div className="container">
				<form className="form-signin" onSubmit={this.onSubmit}>
					<h2 className="form-signin-heading">Register</h2>
					<label className="sr-only">Email address</label>
					<input
						type="email"
						className="form-control"
						placeholder="Email address"
						name="username"
						value={username}
						onChange={this.onChange}
						required
					/>
					<label htmlFor="inputPassword" className="sr-only">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						placeholder="Password"
						name="password"
						value={password}
						onChange={this.onChange}
						required
					/>
					<button className="btn btn-lg btn-primary btn-block" type="submit">
						Register
					</button>
				</form>
			</div>
		);
	}
}
export default Register;
