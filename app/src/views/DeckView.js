/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    
    var Lightbox = require('famous/views/Lightbox');
    var CardView = require('views/CardView');

    /*
     * @name DeckView
     * @constructor
     * @description
     */

    function DeckView() {
        View.apply(this, arguments);

        _createCard.call(this);
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
    };

    function _createCard() {
        var cardView = new CardView();
        this.add(cardView);
    }

    module.exports = DeckView;
});
