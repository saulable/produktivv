import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Header from '../containers/Header';
import { logout } from '../actions/authActions';

class Home extends Component {
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
			})
			.catch(error => {
				if (error.response.status === 401) {
					this.props.history.push('/login');
				}
			});
	}
	render() {
		return (
			<div className="">
				<Header />
				<div className="container panel panel-default">
					<div className="panel-heading">
						<h3 className="panel-title">
							BOOK CATALOG &nbsp;
							{localStorage.getItem('jwtToken') && (
								<button className="btn btn-primary" onClick={this.logout}>
									Logout
								</button>
							)}
						</h3>
					</div>
					<div className="panel-body">
						<table className="table table-stripe">
							<thead>
								<tr>
									<th>ISBN</th>
									<th>Title</th>
									<th>Author</th>
								</tr>
							</thead>
							<tbody>
								{this.state.books.map(book => (
									<tr key={book._id}>
										<td>
											<Link to={`/show/${book._id}`}>{book.isbn}</Link>
										</td>
										<td>{book.title}</td>
										<td>{book.author}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}


export default Home;
