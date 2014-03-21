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


function nextSongCommand(message) {
    this.mpdCommand('next', null, function(err) {
        this.replyTo(message, err ? 'не смог переключить' : 'следующая');
    }.bind(this));
}


function previousSongCommand(message) {
    this.mpdCommand('previous', null, function(err) {
        this.replyTo(message, err ? 'не смог переключить' : 'предыдущая');
    }.bind(this));
}


function louderCommand(message) {
    this.mpdCommand('status', null, function(err, status) {
        if (err) return this.replyTo(message, 'не смог сделать громче');

        var volume = Number(/volume: (\-?[0-9]+)/.exec(status)[1]);

        if (volume < 0) return this.replyTo(message, 'не смог сделать громче');
        if (volume == 100) return this.replyTo(message, 'громкость на максимуме');

        volume += 5;
        volume = volume > 100 ? 100 : volume;

        this.mpdCommand('setvol', [volume], function(err) {
            return this.replyTo(message, err ? 'не смог сделать громче' : this.format('громче (%d/100)', volume));
        }.bind(this));
    }.bind(this));
}


function quieterCommand(message) {
    this.mpdCommand('status', null, function(err, status) {
        if (err) return this.replyTo(message, 'не смог сделать громче');

        var volume = Number(/volume: (\-?[0-9]+)/.exec(status)[1]);

        if (volume < 0) return this.replyTo(message, 'не смог сделать громче');
        if (volume == 0) return this.replyTo(message, 'громкость на минимуме');

        volume -= 5;
        volume = volume < 0 ? 0 : volume;

        this.mpdCommand('setvol', [volume], function(err) {
            return this.replyTo(message, err ? 'не смог сделать тише' : this.format('тише (%d/100)', volume));
        }.bind(this));
    }.bind(this));
}


module.exports = function(vasya) {
    vasya.addHelpMessage('Вася, играй ссылку SONG_URL');
    vasya.addHelpMessage('Вася, выключи музыку');
    vasya.addHelpMessage('Вася, следующая песня');
    vasya.addHelpMessage('Вася, предыдущая песня');
    vasya.addHelpMessage('Вася, громче');
    vasya.addHelpMessage('Вася, тише');
    vasya.registerCommand(/^играй ссылку (.*)$/, playUrlCommand);
    vasya.registerCommand(/^play url (.*)$/, playUrlCommand);
    vasya.registerCommand(/^выключи музыку$/, stopCommand);
    vasya.registerCommand(/^stop$/, stopCommand);
    vasya.registerCommand(/^следующая песня$/, nextSongCommand);
    vasya.registerCommand(/^next song$/, nextSongCommand);
    vasya.registerCommand(/^следующая песня$/, previousSongCommand);
    vasya.registerCommand(/^previous song$/, previousSongCommand);
    vasya.registerCommand(/^громче$/, louderCommand);
    vasya.registerCommand(/^louder$/, louderCommand);
    vasya.registerCommand(/^тише$/, quieterCommand);
    vasya.registerCommand(/^quieter$/, quieterCommand);
};
