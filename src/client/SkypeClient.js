/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var events = require('events');
var util = require('util');

var thrift = require('thrift');
var ThriftTransports = require('thrift/lib/thrift/transport');
var ThriftProtocols = require('thrift/lib/thrift/protocol');

var ThriftSocketReader = require('./ThriftSocketReader');

var Skype = require('./api/Skype');
var ttypes = require('./api/skype_types');


function SkypeClient(config) {
    this._config = {
        thriftServerTransport: config.thriftServerTransport || ThriftTransports.TBufferedTransport,
        thriftServerProtocol: config.thriftServerProtocol || ThriftProtocols.TBinaryProtocol,
        thriftServerHost: config.thriftServerHost || 'localhost',
        thriftServerPort: config.thriftServerPort || 9090,
        messagesServerPort: config.messagesServerPort || 9091,
        messagesServerHost: config.messagesServerHost || 'localhost',
        messagesServerProtocol: config.messagesServerProtocol || ThriftProtocols.TBinaryProtocol,
        messagesServerBufferLengt: config.messagesServerBufferLength || (1024 * 1024),
        token: config.token || ''
    };

    this._initAuthToken();
    this._initClient();
    this._initReader();
    this._initMethods();
}


util.inherits(SkypeClient, events.EventEmitter);


SkypeClient.prototype._initAuthToken = function() {
    this._authToken = new ttypes.Authentication({
        token: this._config.token
    });
};


SkypeClient.prototype._initClient = function() {
    var thriftServerTransport = this._config.thriftServerTransport();
    var thriftServerProtocol = this._config.thriftServerProtocol();

    var thriftServerConnection = thrift.createConnection(
        this._config.thriftServerHost,
        this._config.thriftServerPort,
        {transport: thriftServerTransport, protocol: thriftServerProtocol}
    );

    this._client = thrift.createClient(Skype, thriftServerConnection);
};


SkypeClient.prototype._initReader = function() {
    this._reader = new ThriftSocketReader(
        ttypes.Message,
        this._config.messagesServerPort,
        this._config.messagesServerHost,
        this._config.messagesServerProtocol,
        this._config.messagesServerBufferLength
    );

    this._reader.on('object', this.emit.bind(this, 'message'));
    this._reader.on('error', this.emit.bind(this, 'error'));
};


SkypeClient.prototype._initMethods = function() {
    var proto = Skype.Client.prototype;

    Object.keys(proto).forEach(function(protoMethod) {
        if (proto['send_' + protoMethod] && proto['recv_' + protoMethod]) {
            var clientMethod = protoMethod.replace(/(\_[a-z])/g, function($1) {
                return $1.toUpperCase().replace('_', '');
            });

            this[clientMethod] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this._authToken);
                this._client[protoMethod].apply(this._client, args);
            }.bind(this);
        }
    }.bind(this));
};


module.exports = SkypeClient;
