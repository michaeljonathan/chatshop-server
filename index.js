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

chatshopSocket.on('connection', function(socket) {
	socket.on('coffee', function(data) {
		var response;
		if (!data) {
			response = { action: 'meta', status: 'error', error: 'no-payload' }
		} else if (!data.action) {
			response = { action: 'meta', status: 'error', error: 'no-action' }
		} else {
			switch (data.action) {
				case 'login-req':
					if (data.credentials.username && data.credentials.password && data.credentials.username == 'mj' && data.credentials.password == '3005') {
						response = { action: 'login-res', status: 'ok', user: { id: 1, name: 'MJ' } }
					} else {
						response = { action: 'login-res', status: 'error', error: 'invalid-credentials', errorForHumans: 'That username and password combination was incorrect' }
					}
					break
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

