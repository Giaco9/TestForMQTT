'use strict';
var mqtt = require('mqtt');

var client = mqtt.createClient(1883, 'localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client2',
  keepalive: 30000
});

client.subscribe('a/+/#');
client.on('message', function(topic, message) {
  console.log('message %s in topic %s', message, topic);
});