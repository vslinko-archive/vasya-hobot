/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */


function helpCommand(message) {
    this.replyTo(message, this.getHelpMessages().join('\n'));
}


module.exports = function(vasya) {
    vasya.addHelpMessage('Вася, что умеешь?');
    vasya.registerCommand(/^что умеешь\??$/, helpCommand);
    vasya.registerCommand(/^help$/, helpCommand);
};
