/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var vkontakte = require('vkontakte');
var async = require('async');
var mpd = require('mpd');


module.exports = function(vasyaHobot) {
    var client = mpd.connect({
        port: 6600,
        host: 'localhost'
    });

    client.on('ready', function() {
        vasyaHobot.registerHelp('Вася, выключи музыку');
        vasyaHobot.registerHelp('Вася, играй ссылку SONG_URL');

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
            /^играй ссылку (.*)$/,
            /^play url (.*)$/
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

        if (process.env.VASYA_VK_ACCESS_KEY) {
            var vk = vkontakte(process.env.VASYA_VK_ACCESS_KEY);

            vasyaHobot.registerHelp('Вася, играй SEARCH_QUERY');

            vasyaHobot.registerCommand([
                /^играй (.*)$/,
                /^play (.*)$/
            ], function(query, message) {
                vk('audio.search', {q: query}, function(err, res) {
                    if (err) {
                        return vasyaHobot.replyTo(message, 'не смог найти ' + query + ' в vk');
                    }

                    res = res.filter(function(t) {
                        return t.url;
                    });

                    vasyaHobot.replyTo(message, res.map(function(t) {
                        return t.artist + ' - ' + t.title;
                    }).join('\n'));

                    var commands = res.map(function(track) {
                        return client.sendCommand.bind(client, mpd.cmd("add", [track.url]));
                    });

                    commands.unshift(client.sendCommand.bind(client, mpd.cmd("stop", [])));
                    commands.unshift(client.sendCommand.bind(client, mpd.cmd("clear", [])));
                    commands.push(client.sendCommand.bind(client, mpd.cmd("play", [])));

                    async.series(commands, function(err) {
                        var reply = err
                                  ? 'не смог включить'
                                  : 'let\'s go dance';

                        vasyaHobot.replyTo(message, reply);
                    });
                });
            });
        }
    });
};
