/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

module.exports = function(vasyaHobot) {
    vasyaHobot.registerHelp('Вася, что умеешь?');

    vasyaHobot.registerCommand([
        /^что умеешь\??$/,
        /^help$/
    ], function(message) {
        vasyaHobot.replyTo(message, vasyaHobot.getHelp().join('\n'));
    });
};
