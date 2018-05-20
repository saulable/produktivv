export default class Auth{
	logout() {
		localStorage.removeItem('jwtToken');
	}
}
