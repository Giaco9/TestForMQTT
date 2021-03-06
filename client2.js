'use strict';
let mqtt = require('mqtt');

let client = mqtt.createClient(4883, 'localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client2',
  keepalive: 30000
});

client.subscribe('a/b/c');
client.on('message', function(topic, message) {
  console.log('message %s in topic %s', message, topic);
});