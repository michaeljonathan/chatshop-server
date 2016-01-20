/*
 * Basic usage
 */

// send
socket.emit('coffee', {...payload...});

// receive
socket.on('coffee', function(payload) {
	...
});



////////////////////
// Initialization //
////////////////////

/*
 * Login
 */

// client says
{
	action: 'login-req',

	appVersion: '1',
	credentials: {
		username: 'mj',
		password: '3005'
	}
}

// server says (ok)
{
	action: 'login-res',
	status: 'ok',

	user: {
		id: 'u1',
		name: 'MJ'
	},
	authToken: 'isProbablyNotNecessary'
}

// server says (error)
{
	action: 'login-res',
	status: 'error',

	error: 'invalid-credentials',
	errorForHumans: 'That username and password combination was incorrect'
}

/*
 * Update state
 */

// client says
{
	action: 'state-req'
}

// server says (ok)
{
	action: 'state-res'
	status: 'ok',

	state: {
		threadIDs: ['t1'],
		threadsMap: {... see client _state.js ...},
		messagesMap: {... see client _state.js ...},
		usersMap: {{... see client _state.js ...},
		currentUserID: 'u1',
	}
}

///////////////////////////
// Messages Send/Receive //
///////////////////////////

/*
 * Message send
 */

// client says
{
	action: 'message-send-req',

	message: {
		threadID: 't1',
		message: 'Lorem ipsum dolor'
	}
}

// server says
{
	action: 'message-send-res',
	status: 'ok'
}


















