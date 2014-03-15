/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var SkypeClient = require('./SkypeClient');


var skypeClient = new SkypeClient({
    token: process.env.VASYA_TOKEN || 'token'
});

skypeClient.getUser('vyacheslav.slinko', function(err, chats) {
    console.log(err, chats);
});

skypeClient.on('message', function(message) {
    console.log(message);
});

skypeClient.on('error', function(err) {
    console.log(err);
});
