/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    
    // var Lightbox = require('famous/views/Lightbox');
    var CardView = require('views/CardView');

    /*
     * @name DeckView
     * @constructor
     * @description
     */

    function DeckView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            origin: [0, 0],
            align: [0.3, 0.3]
        });

        window.deckView = this;

        this.mainNode = this.add(this.rootModifier);

        // _createLightbox.call(this);
        // _createDeck.call(this);
        // 
        var deckContainer = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });

        this.mainNode.add(new CardView());
        // deckContainer.add(new CardView());
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
        lightboxOpts: {
            // inOpacity: 1,
            outOpacity: 0,
            inOrigin: [1, 1],
            outOrigin: [0, 0],
            showOrigin: [0.5, 0.5],
            // inTransform: Transform.thenMove(Transform.rotateY(0.9), [0, -300, 0]),
            // outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
            inTransition: { duration: 0, curve: 'easeOut' },
            // outTransition: { duration: 0, curve: Easing.inCubic },
            overlap: true
        }
    };

    DeckView.prototype.showCurrentCard = function() {
        this.ready = false;

        var card = this.cards[this.currentIndex];
        this.lightbox.show(card, function() {
            this.ready = true;
            // slide.fadeIn();
        }.bind(this));
    };

    DeckView.prototype.showNextCard = function() {
        this.lightbox._showing = false;

        if (!this.ready) return;

        this.currentIndex++;
        if (this.currentIndex === this.cards.length) this.currentIndex = 0;
        this.showCurrentCard();
    };

    function _createLightbox() {
        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightbox);
    }

    function _createDeck() {
        this.cards = [];
        this.currentIndex = 0;

        for (var i = 1; i < 4; i++) {       
            var cardView = new CardView({ title: 'card ' + i });
            cardView.on('nextCard', this.showNextCard.bind(this))
            this.cards.push(cardView);
        }

        this.showCurrentCard();
    }

    module.exports = DeckView;
});
