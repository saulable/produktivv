import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/login.css';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			message: ''
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	onSubmit(event) {
		event.preventDefault();
		const { username, password } = this.state;
		axios
			.post('/api/auth/login', { username, password })
			.then(result => {
				localStorage.setItem('jwtToken', result.data.token);
				this.setState({ message: '' });
				this.props.history.push('/profile');
			})
			.catch(error => {
				if (error.response.status === 401) {
					this.setState({
						message: 'Login failed: Username or password do no match'
					});
				}
			});
	}
	render() {
		const { username, password, message } = this.state;
		return (
			<div className="container">
				<form className="form-signin" onSubmit={this.onSubmit}>
					{message !== '' && (
						<div className="alert alert-warning alert-dismissible" role="alert">
							{message}
						</div>
					)}
					<h2 className="form-siginin-heading">Please sign in</h2>
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
					<label className="sr-only">Password</label>
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
						Login
					</button>
					<p>
						Not a member?{' '}
						<Link to="/register">
							<span
								className="glyphicon glyphicon-plus-sign"
								aria-hidden="true"
							/>{' '}
							Register here
						</Link>
					</p>
				</form>
				<div className="facebook-login">
					<a href="/auth/facebook">Login with Facebook</a>
				</div>
			</div>
		);
	}
}

export default Login;
