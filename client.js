'use strict';
let mqtt = require('mqtt');

let client = mqtt.createClient(1883, 'localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client1',
  keepalive: 30000
});

client.subscribe('topic');
client.on('message', function(topic, message) {
  console.log('message %s in topic %s', message, topic);
});