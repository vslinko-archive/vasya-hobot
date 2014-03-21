/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */


function playCommand(query, message) {
    var vasya = this;

    this.vk('audio.search', {q: query}, function(err, res) {
        if (err) {
            return vasya.replyTo(message, 'ошибка поиска в vk');
        }

        res = res.filter(function(t) {
            return t.url;
        });

        if (res.length == 0) {
            return vasya.replyTo(message, vasya.format('нет музыки "%s" в vk', query));
        }

        var foundTracks = res.map(function(t, i) {
            return vasya.format('%d) %s — %s', i + 1, t.artist, t.title);
        }).join('\n');

        vasya.replyTo(message, vasya.format('Нашел:\n%s', foundTracks));

        vasya.mpdCommand('stop');
        vasya.mpdCommand('clear');

        res.forEach(function(track) {
            vasya.mpdCommand('add', [track.url]);
        });

        vasya.mpdCommand('play', null, function(err) {
            vasya.replyTo(message, err ? 'не смог включить' : 'let\'s go dance');
        });
    });
}


module.exports = function(vasya) {
    vasya.addHelpMessage('Вася, играй SEARCH_QUERY');
    vasya.registerCommand(/^играй (.*)$/, playCommand);
    vasya.registerCommand(/^play (.*)$/, playCommand);
};
