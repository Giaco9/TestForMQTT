'use strict';
let mqtt = require('mqtt');

let port = 1883;
	
mqtt.createServer(function(client) {
	let self = this;

	if (!self.clients) self.clients = {};

	client.on('connect', function(packet) {
		self.clients[packet.clientId] = client;
		client.id = packet.clientId;
		client.subscriptions = [];
		client.connack({returnCode: 0});
		console.log('CONNECT: client id: ' + client.id);
	});

	client.on('subscribe', function(packet) {
		let granted = [];
		console.log('SUBSCRIBE(%s): %j', client.id, packet);
		for (let i = 0; i < packet.subscriptions.length; i++) {
			let qos = packet.subscriptions[i].qos,
				topic = packet.subscriptions[i].topic,
				reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');
			granted.push(qos);
			client.subscriptions.push(reg);
		}
		client.suback({messageId: packet.messageId, granted: granted});
	});

	client.on('publish', function(packet) {
		console.log('PUBLISH(%s): %j', client.id, packet);
		// loop all clients
		for (let k in self.clients) {
			let c = self.clients[k];
			// loop all subscription of c client
			for (let i = 0; i < c.subscriptions.length; i++) {
				let s = c.subscriptions[i];
				// if c client is registered on the topic republish the message
				if (s.test(packet.topic)) {
					c.publish({topic: packet.topic, payload: packet.payload});
					i = c.subscriptions.length;
				}
			}
		}
	});

	client.on('pingreq', function() {
		console.log('PINGREQ(%s)', client.id);
		client.pingresp();
	});

	client.on('disconnect', function() {
		console.log('client %s disconnect', client.id);
		client.stream.end();
	});

	client.on('close', function() {
		console.log('client %s close', client.id);
		delete self.clients[client.id];
	});

	client.on('error', function(err) {
		if (self.clients[client.id] !== undefined) {
			client.stream.end();
		}
		console.log(err);
	});
}).listen(port, function() {
	console.log('mqtt server is listening on port', port);
});
module.exports = mqtt;
