/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

function Message(chat, body) {
    this._chat = chat;
    this._body = body;
}


Message.prototype.getChat = function() {
    return this._chat;
};


Message.prototype.getBody = function() {
    return this._body;
};


module.exports = Message;
