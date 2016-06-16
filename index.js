var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var httpServer = http.Server(app);
var webSockets = socketIO(httpServer);

var chatshopSocket = webSockets.of('/chatshop');

app.get('/', function(req, res) {
	return res.send('Chatshop is open!');
});

var linkToken = 't0ken';

chatshopSocket.on('connection', function(socket) {
	socket.on('coffee', function(data) {
		var response;
		if (!data) {
			response = { action: 'meta', status: 'error', error: 'no-payload' }
		} else if (!data.action) {
			response = { action: 'meta', status: 'error', error: 'no-action' }
		} else {
			switch (data.action) {

				// Login
				case 'login-req':
					if (data.credentials.username && data.credentials.password && data.credentials.username == 'mj' && data.credentials.password == '3005') {
						response = { action: 'login-res', status: 'ok', user: { id: 'u1', name: 'MJ' }, linkToken: 't0ken' }
					} else {
						response = { action: 'login-res', status: 'error', error: 'invalid-credentials', errorForHumans: 'That username and password combination was incorrect' }
					}
					break;

				// Initial data
				case 'initial-data-req':
					if (data.linkToken == linkToken) {
						response = {
							action: 'initial-data-res',
							status: 'ok',
							initialData: {
								threads: [
									{
										id: 't1',
										type: 'group',
										title: 'Team Updates',
										description: 'Late? Sick? Leaving early? Post in here to let the team know.',
										participantIDs: ['u1'],
										unreadSince: false
									},
									{
										id: 't2',
										type: 'personal',
										other: 'u3',
										unreadSince: false
									}
								],
								messages: [
									{
										id: 'm1',
										threadID: 't1',
										authorID: 'u1',
										date: 'Thu Dec 03 2015 12:00:00 GMT+1100 (AEDT)',
										message: 'Hi what\'s up everybody.'
									},
									{
										id: 'm2',
										threadID: 't1',
										authorID: 'u2',
										date: 'Thu Dec 03 2015 12:01:00 GMT+1100 (AEDT)',
										message: 'Hey!!'
									},
									{
										id: 'm3',
										threadID: 't2',
										authorID: 'u3',
										date: 'Thu Dec 03 2015 12:01:00 GMT+1100 (AEDT)',
										message: 'Good morning'
									}
								],
								users: [
									{
										id: 'u1',
										name: 'MJ'
									},
									{
										id: 'u2',
										name: 'Wade	Smith'
									},
									{
										id: 'u3',
										name: 'Irene Young'
									}
								]
							}
						}
					} else {
						response = {
							action: 'initial-data-res',
							status: 'error',
							error: 'no-auth'
						}
					}
					break;

				// Message send
				case 'message-send-req':
					if (data.message && data.message.threadID && data.message.message && data.message.key) {
						response = { action: 'message-send-res', status: 'ok', key: data.message.key }
					} else {
						response = { action: 'message-send-res', status: 'error', error: 'incomplete-params', errorForHumans: 'Some required info are missing' }
					}
					break;

				default:
					response = { action: 'meta', status: 'error', error: 'unrecognized-action' }
			}
		}
		socket.emit('coffee', response);
	});
});

var server = httpServer.listen(3005, function() {
	var host = server.address().address;
 	var port = server.address().port;

	console.log('Chatshop now open at http://%s:%s', host, port);
});

