'use strict';
let mqtt = require('mqtt');

let client = mqtt.createClient(1883, 'localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client3',
  keepalive: 30000
});

client.on('message', function(topic, message) {
  console.log('message', message);
});

client.publish('presence', 'inviatoNelPresence');
setInterval(function() {
	console.log('inviato');
	client.publish('client2Topic', 'inviatoNelClient2Topic');
}, 2000);