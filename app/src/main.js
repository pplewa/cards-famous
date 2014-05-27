/* globals define */
define(function(require, exports, module) {
	'use strict';
	// import dependencies
	var Engine = require('famous/core/Engine');
	var DeckView = require('views/DeckView');

	var mainContext = Engine.createContext();
   	// mainContext.setPerspective(1000);

	var deckView = new DeckView();

	// deckView.on('updateIndex', function(index){
	// 	console.log(index);
	// });
	mainContext.add(deckView);
});
