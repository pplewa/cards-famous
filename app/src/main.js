/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var DeckView = require('views/DeckView');

    var mainContext = Engine.createContext();
    var deckView = new DeckView();

    mainContext.add(deckView);
});
