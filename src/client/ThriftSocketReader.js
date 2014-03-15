/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var events = require('events');
var util = require('util');
var net = require('net');

var ThriftProtocols = require('thrift/lib/thrift/protocol');
var ThriftTransports = require('thrift/lib/thrift/transport');


var UINT32_LENGTH = 4;
var MEGABYTE = 1024 * 1024;


function ThriftSocketReader(struct, port, host, protocol, bufferLength) {
    this._connection = net.createConnection(port || 9091, host || 'localhost');
    this._struct = struct;
    this._protocol = protocol || ThriftProtocols.TBinaryProtocol;
    this._bufferLength = bufferLength || MEGABYTE;

    this._buffer = new Buffer(this._bufferLength);
    this._objectLength = null;
    this._receivedBytes = 0;

    this._connection.on('data', this._receiveData.bind(this));
    this._connection.on('error', this.emit.bind(this, 'error'));
}


util.inherits(ThriftSocketReader, events.EventEmitter);


ThriftSocketReader.prototype._receiveData = function(data) {
    data.copy(this._buffer, this._receivedBytes);
    this._receivedBytes += data.length;
    this._read();
};


ThriftSocketReader.prototype._read = function() {
    if (this._objectLength === null && this._receivedBytes >= UINT32_LENGTH) {
        this._readLength();
    } else if (this._objectLength !== null && this._receivedBytes >= this._objectLength) {
        this._readObject();
    }
};


ThriftSocketReader.prototype._readLength = function() {
    this._objectLength = this._buffer.readUInt32BE(0);
    this._sliceBuffer(UINT32_LENGTH);
    this._receivedBytes -= UINT32_LENGTH;

    if (this._receivedBytes >= this._objectLength) {
        this._readObject();
    }
};


ThriftSocketReader.prototype._readObject = function() {
    var slice = this._sliceBuffer(this._objectLength);

    this._receivedBytes -= this._objectLength;
    this._objectLength = null;

    var transport = new ThriftTransports.TFramedTransport(slice);
    var protocol = new this._protocol(transport);

    var object = new this._struct();
    object.read(protocol);

    this.emit('object', object);

    if (this._receivedBytes >= UINT32_LENGTH) {
        this._readLength();
    }
};


ThriftSocketReader.prototype._sliceBuffer = function(length) {
    var slice = this._buffer.slice(0, length);

    var newBuffer = new Buffer(this._bufferLength);
    this._buffer.slice(length).copy(newBuffer);
    this._buffer = newBuffer;

    return slice;
};


module.exports = ThriftSocketReader;
