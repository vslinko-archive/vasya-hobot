/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

function VasyaHobot(skypeClient) {
    this._skypeClient = skypeClient;
    this._help = [];
    this._commands = [];

    this._nameRegexps = VasyaHobot.names.map(function(name) {
        return new RegExp('^' + name + '( |, )', 'i');
    });

    skypeClient.on('message', this._handleMessage.bind(this));
}


VasyaHobot.names = [
    'Василий', 'Васильюшка', 'Василька', 'Василёк', 'Василько', 'Вася',
    'Васёна', 'Васёня', 'Васюня', 'Васюра', 'Сюра', 'Васюта', 'Сюта', 'Васюха',
    'Васюша', 'Васяй', 'Васяк', 'Васяка', 'Вака', 'Васяня', 'Васяна', 'Васята',
    'Васяха', 'Васяша', 'Вась', 'хобот', 'vasya', 'v'
];


VasyaHobot.prototype.registerPlugin = function(plugin) {
    plugin(this);
};


VasyaHobot.prototype.registerHelp = function(message) {
    this._help.push(message);
};


VasyaHobot.prototype.getHelp = function() {
    return this._help.sort(function(a, b) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    });
};


VasyaHobot.prototype.registerCommand = function(regexps, handler) {
    this._commands.push([regexps, handler]);
};


VasyaHobot.prototype.replyTo = function(message, replyBody, callback) {
    this._skypeClient.sendMessage(message.chatName, replyBody, callback);
};


VasyaHobot.prototype._handleMessage = function(message) {
    if (message.status !== 'RECEIVED') {
        return;
    }

    var body = this._parseBody(message);
    if (!body) return;

    var command = this._searchCommand(body);
    if (!command) return;

    command(message);
};


VasyaHobot.prototype._parseBody = function(message) {
    var body;

    this._nameRegexps.every(function(nameRegexp) {
        if (nameRegexp.test(message.body)) {
            body = message.body.replace(nameRegexp, '');
            return false;
        }

        return true;
    });

    return body;
};


VasyaHobot.prototype._searchCommand = function(body) {
    var commandHandler,
        vasyaHobot = this;

    this._commands.every(function(command) {
        var regexps = command[0],
            handler = command[1];

        return !regexps.some(function(regexp) {
            if (regexp.test(body)) {
                var matches = regexp.exec(body);

                commandHandler = function(message) {
                    var args = matches.slice(1);
                    args.push(message);

                    handler.apply(vasyaHobot, args);
                };

                return true;
            }

            return false;
        });
    });

    return commandHandler;
};


module.exports = VasyaHobot;
