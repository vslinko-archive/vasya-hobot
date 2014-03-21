/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var request = require('request');


var titleRegexp = /<title>(.*?)<\/title>/m;


function httpListener(links, message) {
    var vasya = this;

    links.forEach(function(link) {
        request(link, function(err, response, body) {
            if (!body) return;

            var matches = titleRegexp.exec(body);
            if (!matches) return;

            vasya.replyTo(message, vasya.format('%s %s', link, matches[1]));
        });
    });
}


module.exports = function(vasyaHobot) {
    vasyaHobot.addHelpMessage('/https?:\\/\\/[^ ]+/');
    vasyaHobot.registerListener(/(https?:\/\/[^ ]+)/g, httpListener);
};
