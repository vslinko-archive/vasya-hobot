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

var SkypeClient = require('./SkypeClient');


function SkypeHead(options) {
    Head.call(this);
    this._client = new SkypeClient(options);
    this._client.on('message', this._handleMessage.bind(this));
}


util.inherits(SkypeHead, Head);


SkypeHead.prototype.getChats = function(callback) {
    this._client.getChats(function(err, chats) {
        if (Array.isArray(chats)) {
            chats = chats.map(this._convertChat.bind(this));
        }
        callback(err, chats);
    }.bind(this));
};


SkypeHead.prototype.getChat = function(name, callback) {
    this._client.getChat(name, function(err, chat) {
        if (chat) {
            chat = this._convertChat(chat);
        }
        callback(err, chat);
    }.bind(this));
};


SkypeHead.prototype.sendMessage = function(message, callback) {
    this._client.sendMessage(message.getChat().getName(), message.getBody(), function(err) {
        if (callback) callback(err, message);
    });
};


SkypeHead.prototype._handleMessage = function(message) {
    if (message.status !== 'RECEIVED') {
        return;
    }

    var message = new Message(this._convertChat(message.chat), message.body);
    this.emit('message', message);
};


SkypeHead.prototype._convertChat = function(chat) {
    return new Chat(this, chat.name);
};


module.exports = SkypeHead;
