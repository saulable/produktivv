export function logout() {
	return dispatch => {
		localStorage.removeItem('jwtToken');
		window.location.reload();
	};
}
