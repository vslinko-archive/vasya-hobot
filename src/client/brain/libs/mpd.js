/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var async = require('async');
var mpd = require('mpd');


module.exports = function(vasya) {
    var client, connected = false;

    function connect() {
        client = mpd.connect({
            port: process.env.VASYA_MPD_PORT || 6600,
            host: process.env.VASYA_MPD_HOST || 'localhost'
        });

        client.on('connect', function() {
            connected = true;
        });

        client.on('end', function() {
            connected = false;
            setTimeout(connect, 1000);
        });

        client.on('error', function() {
            connected = false;
            setTimeout(connect, 1000);
        });
    }

    connect();

    var commandsQueue = async.queue(function(command, callback) {
        function sendCommand() {
            if (connected) {
                client.sendCommand(command, callback);
            } else {
                setTimeout(sendCommand, 1000);
            }
        }

        sendCommand();
    }, 1);

    vasya.mpdCommand = function(cmd, args, callback) {
        commandsQueue.push(mpd.cmd(cmd, args || []), callback);
    };
};
