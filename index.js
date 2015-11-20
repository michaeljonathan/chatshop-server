var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express();
var httpServer = http.Server(app);
var webSockets = socketIO(httpServer);

app.get('/', function(req, res) {
	return res.send('Chatshop is open!');
});

webSockets.on('connection', function(socket) {
	socket.on('CLIENT_ARRIVED', function(data) {
		var message;
		if (data && data.name) {
			message = 'Welcome to the Chatshop, '+data.name+'.';
		} else {
			message = 'Welcome to the Chatshop.';
		}
		socket.emit('NOTIFICATION', {
			text: message
		});
	});
});

var server = httpServer.listen(3005, function() {
	var host = server.address().address;
 	var port = server.address().port;

	console.log('Chatshop now open at http://%s:%s', host, port);
});

