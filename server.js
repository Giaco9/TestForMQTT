'use strict';
let mqtt = require('mqtt');
	
mqtt.createServer(function(client) {
	let self = this;

	if (!self.clients) self.clients = {};

	// il client si connette
	client.on('connect', function(packet) {
		self.clients[packet.clientId] = client;
		client.id = packet.clientId;
		client.subscriptions = [];
		client.connack({returnCode: 0});
		console.log('CONNECT: client id: ' + client.id);
	});

	// il client si iscrve a uno o più topic
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

	// il client manda un messaggio in  un topic
	client.on('publish', function(packet) {
		console.log('PUBLISH(%s): %j', client.id, packet);
		// controllo tutti i client connessi
		for (let k in self.clients) {
			let c = self.clients[k];
			// controllo le iscrizioni di ogni client
			for (let i = 0; i < c.subscriptions.length; i++) {
				let s = c.subscriptions[i];
				// se il client è iscritto al topic allora rinvio il messaggio
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
		client.stream.end();
	});

	client.on('close', function() {
		delete self.clients[client.id];
	});

	client.on('error', function(err) {
		if (self.clients[client.id] !== undefined) {
			client.stream.end();
		}
		console.log(err);
	});
}).listen(1883);
