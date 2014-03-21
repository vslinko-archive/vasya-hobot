/**
 * Vasya Hobot
 *
 * Copyright (c) 2013-2014 Vyacheslav Slinko
 * Licensed under the MIT License
 */


function addHelpMessage(message) {
    this._helpMessages.push(message);
}


function getHelpMessages() {
    return this._helpMessages.sort(function(a, b) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    });
}


module.exports = function(vasya) {
    vasya._helpMessages = [];
    vasya.addHelpMessage = addHelpMessage.bind(vasya);
    vasya.getHelpMessages = getHelpMessages.bind(vasya);
};
