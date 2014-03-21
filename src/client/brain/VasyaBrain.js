/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var Message = require('../api/Message');


function VasyaBrain() {
    this._listeners = [];
    this._commands = [];
    this._nameRegexps = VasyaBrain.names.map(function(name) {
        return new RegExp('^' + name + '( |, )', 'i');
    });
}


VasyaBrain.names = [
    'Василий', 'Васильюшка', 'Василька', 'Василёк', 'Василько', 'Вася',
    'Васёна', 'Васёня', 'Васюня', 'Васюра', 'Сюра', 'Васюта', 'Сюта', 'Васюха',
    'Васюша', 'Васяй', 'Васяк', 'Васяка', 'Вака', 'Васяня', 'Васяна', 'Васята',
    'Васяха', 'Васяша', 'Вась', 'хобот', 'vasya', 'v'
];


VasyaBrain.prototype.attachHead = function(head) {
    head.on('message', this._handleMessage.bind(this));
};


VasyaBrain.prototype.registerListener = function(regexps, handler) {
    this._listeners.push([regexps, handler])
};


VasyaBrain.prototype.registerCommand = function(regexps, handler) {
    this._commands.push([regexps, handler]);
};


VasyaBrain.prototype.replyTo = function(message, replyBody, callback) {
    var chat = message.getChat(),
        head = chat.getHead(),
        replyMessage = new Message(chat, replyBody);

    head.sendMessage(replyMessage, callback);
};


VasyaBrain.prototype._handleMessage = function(message) {
    var body = message.getBody();

    this._searchListeners(body).forEach(function(listener) {
        listener(message);
    });

    var commandMessage = this._parseCommandMessage(body);
    if (!commandMessage) return;

    var command = this._searchCommand(commandMessage);
    if (!command) return;

    command(message);
};


VasyaBrain.prototype._searchListeners = function(body) {
    var listeners = [];

    this._listeners.forEach(function(listener) {
        var regexp = listener[0],
            handler = listener[1];

        if (regexp.test(body)) {
            listeners.push(this._wrapHandler(regexp, body, handler));
        }
    }.bind(this));

    return listeners;
};


VasyaBrain.prototype._parseCommandMessage = function(body) {
    var commandMessage;

    this._nameRegexps.some(function(nameRegexp) {
        if (nameRegexp.test(body)) {
            commandMessage = body.replace(nameRegexp, '');
            return true;
        }

        return false;
    });

    return commandMessage;
};


VasyaBrain.prototype._searchCommand = function(commandMessage) {
    var commandHandler;

    this._commands.some(function(command) {
        var regexp = command[0],
            handler = command[1];

        if (regexp.test(commandMessage)) {
            commandHandler = this._wrapHandler(regexp, commandMessage, handler);
            return true;
        }

        return false;
    }.bind(this));

    return commandHandler;
};


VasyaBrain.prototype._wrapHandler = function(regexp, body, handler) {
    var args;

    regexp = new RegExp(regexp);

    if (regexp.global) {
        var matches = [];

        while (true) {
            var match = regexp.exec(body);

            if (match === null) {
                break;
            }

            matches.push(match[1]);
        }

        args = [matches];
    } else {
        args = regexp.exec(body).slice(1);
    }

    return function(message) {
        handler.apply(this, args.concat([message]));
    }.bind(this);
};


module.exports = VasyaBrain;
