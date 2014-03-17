/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var request = require('request');


module.exports = function(vasyaHobot) {
    var titleRegexp = /<title>(.*?)<\/title>/m;

    vasyaHobot.registerHelp('/https?:\\/\\/[^ ]+/');

    vasyaHobot.registerListener([
        /(https?:\/\/[^ ]+)/g
    ], function(links, message) {
        links.forEach(function(link) {
            request(link, function(err, response, body) {
                if (!body) return;

                var matches = titleRegexp.exec(body);
                if (!matches) return;

                var reply = link + '\n' + matches[1];
                vasyaHobot.replyTo(message, reply);
            });
        });
    });
};
