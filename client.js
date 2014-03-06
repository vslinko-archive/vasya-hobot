/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var thrift = require('thrift');
var ThriftTransports = require('thrift/lib/thrift/transport');
var ThriftProtocols = require('thrift/lib/thrift/protocol');
var Skype = require('./gen-nodejs/Skype');
var ttypes = require('./gen-nodejs/skype_types');


var transport = ThriftTransports.TBufferedTransport();
var protocol = ThriftProtocols.TBinaryProtocol();

var connection = thrift.createConnection('localhost', 9090, {
    transport: transport,
    protocol: protocol
});

connection.on('error', function(err) {
    console.log(err);
});

var client = thrift.createClient(Skype, connection);

var auth = new ttypes.Authentication({
    token: 'token'
});

client.get_chats(auth, function(err, chats) {
    console.log(err, chats);
});
