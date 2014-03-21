/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */


function playUrlCommand(url, message) {
    this.mpdCommand('stop');
    this.mpdCommand('clear');
    this.mpdCommand('add', [url]);
    this.mpdCommand('play', null, function(err) {
        this.replyTo(message, err ? 'не смог включить' : 'let\'s go dance');
    }.bind(this));
}


function stopCommand(message) {
    this.mpdCommand('stop', null, function(err) {
        this.replyTo(message, err ? 'не смог выключить' : 'тссс');
    }.bind(this));
}


module.exports = function(vasya) {
    vasya.addHelpMessage('Вася, играй ссылку SONG_URL');
    vasya.addHelpMessage('Вася, выключи музыку');
    vasya.registerCommand(/^играй ссылку (.*)$/, playUrlCommand);
    vasya.registerCommand(/^play url (.*)$/, playUrlCommand);
    vasya.registerCommand(/^выключи музыку$/, stopCommand);
    vasya.registerCommand(/^stop$/, stopCommand);
};
