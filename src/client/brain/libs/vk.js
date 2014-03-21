/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */

var vkontakte = require('vkontakte');


module.exports = function(vasya) {
    vasya.vk = vkontakte(process.env.VASYA_VK_ACCESS_KEY);
};
