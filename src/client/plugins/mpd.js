/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var async = require('async');
var mpd = require('mpd');


module.exports = function(vasyaHobot) {
    var client = mpd.connect({
        port: 6600,
        host: 'localhost'
    });

    client.on('ready', function() {
        vasyaHobot.registerHelp('Вася, выключи музыку');
        vasyaHobot.registerHelp('Вася, играй SONG_URL');

        vasyaHobot.registerCommand([
            /^выключи музыку$/,
            /^stop$/
        ], function(message) {
            client.sendCommand(mpd.cmd("stop", []), function(err, msg) {
                var reply = err
                          ? 'не смог выключить'
                          : 'тсссс';

                vasyaHobot.replyTo(message, reply);
            });
        });

        vasyaHobot.registerCommand([
            /^играй (.*)$/,
            /^play (.*)$/
        ], function(url, message) {
            async.series([
                client.sendCommand.bind(client, mpd.cmd("stop", [])),
                client.sendCommand.bind(client, mpd.cmd("clear", [])),
                client.sendCommand.bind(client, mpd.cmd("add", [url])),
                client.sendCommand.bind(client, mpd.cmd("play", []))
            ], function(err) {
                var reply = err
                          ? 'не смог включить'
                          : 'let\'s go dance';

                vasyaHobot.replyTo(message, reply);
            });
        });
    });
};
