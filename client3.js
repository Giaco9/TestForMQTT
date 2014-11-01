'use strict';
let mqtt = require('mqtt');

let client = mqtt.createClient(1883, 'localhost', {
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clientId: 'client3',
  keepalive: 30000
});

client.publish('a/b/c/d/e', 'client3');