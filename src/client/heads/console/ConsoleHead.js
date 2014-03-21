/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var util = require('util');

var Head = require('../../api/Head');
var Chat = require('../../api/Chat');
var Message = require('../../api/Message');


function ConsoleHead() {
    Head.call(this);

    this._chat = new Chat(this, ConsoleHead.chatName);

    var buf = "";

    process.stdin.on('readable', function() {
        var chunk = process.stdin.read();

        if (chunk !== null) {
            buf += chunk.toString();

            if (buf.indexOf('\n') >= 0) {
                var rows = buf.split('\n');
                buf = rows.pop();
                rows.forEach(this._handleRow.bind(this));
            }
        }
    }.bind(this));
}


util.inherits(ConsoleHead, Head);


ConsoleHead.chatName = 'console';


ConsoleHead.prototype.getChats = function(callback) {
    callback(null, [this._chat]);
};


ConsoleHead.prototype.getChat = function(name, callback) {
    if (name == ConsoleHead.chatName) {
        callback(null, this._chat);
    } else {
        callback(null, null);
    }
};


ConsoleHead.prototype.sendMessage = function(message, callback) {
    console.log(message.getBody());
    if (callback) callback(null, message);
};


ConsoleHead.prototype._handleRow = function(row) {
    var message = new Message(this._chat, row);
    this.emit('message', message);
}


module.exports = ConsoleHead;
