'use strict';
var mosca = require('mosca');
var mqtt = require('mqtt');

var mqttPort = 4884;

var moscaSettings = {
	port: 4884,
	/*backend: {
		type: 'mqtt',
		mqtt: require('./server.js'),
		json: false,
		port: 1883
	}   //pubsubsettings is the object we created above */
};

var server = new mosca.Server(moscaSettings);   //here we start mosca

server.on('clientConnected', function(client) {
	console.log('client connected', client.id);
});

server.on('ready', function() {
	console.log('server is listening on port', 4884);
});

server.on('published', function(packet) {
	console.log('Published', packet);
	var message = {
		topic: packet.topic,
		payload: 'abcde', // or a Buffer
		qos: 0, // 0, 1, or 2
		retain: false // or true
	};
	/*server.publish(message, function() {
		console.log('done!');
	});*/
});