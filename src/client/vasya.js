/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var path = require('path');
var fs = require('fs');

var SkypeClient = require('./SkypeClient');
var VasyaHobot = require('./VasyaHobot');


var skypeClient = new SkypeClient({
    token: process.env.VASYA_TOKEN || 'token',
    host: process.env.VASYA_HOST || 'localhost'
});

var vasyaHobot = new VasyaHobot(skypeClient);

var pluginsDir = path.join(__dirname, 'plugins');

fs.readdirSync(pluginsDir).forEach(function(pluginFilename) {
    vasyaHobot.registerPlugin(require(path.join(pluginsDir, pluginFilename)));
});
