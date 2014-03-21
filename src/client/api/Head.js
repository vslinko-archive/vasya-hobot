/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var events = require('events');
var util = require('util');


function Head() {
    events.EventEmitter.call(this);
}


util.inherits(Head, events.EventEmitter);


Head.prototype.getChats = function(callback) {
    callback(new Error('Not implemented'));
};


Head.prototype.getChat = function(name, callback) {
    callback(new Error('Not implemented'));
};


Head.prototype.sendMessage = function(message, callback) {
    callback(new Error('Not implemented'));
};


module.exports = Head;
