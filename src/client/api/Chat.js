/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

function Chat(head, name) {
    this._head = head;
    this._name = name;
}


Chat.prototype.getHead = function() {
    return this._head;
};


Chat.prototype.getName = function() {
    return this._name;
};


module.exports = Chat;
