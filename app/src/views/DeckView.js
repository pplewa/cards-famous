/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    
    var Lightbox = require('famous/views/Lightbox');
    var CardView = require('views/CardView');

    /*
     * @name DeckView
     * @constructor
     * @description
     */

    var CARDS = [
        { title: 'card 1' },
        { title: 'card 2' },
        { title: 'card 3' }
    ];

    function DeckView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            origin: [0, 0],
            align: [0.3, 0.3]
        });

        window.deckView = this;

        this.mainNode = this.add(this.rootModifier);

        _createLightboxes.call(this);
        // _createDeck.call(this);
        // 
        var deckContainer = new ContainerSurface({
            properties: {
                overflow: 'hidden'
            }
        });

        // this.mainNode.add(new CardView());
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

    function _createLightboxes() {
        this.lightboxes = [];
        this.lightboxes[0] = new Lightbox(this.options.lightboxOpts);
        this.lightboxes[1] = new Lightbox(this.options.lightboxOpts);
        this.lightboxes[2] = new Lightbox(this.options.lightboxOpts);
        this.mainNode.add(this.lightboxes[0]);
        this.mainNode.add(this.lightboxes[1]);
        this.mainNode.add(this.lightboxes[2]);

        _createDeck.call(this);
        this.lightboxes[0].show(this.cards[0]);
        this.lightboxes[1].show(this.cards[1]);
        this.lightboxes[2].show(this.cards[2]);

        this.cards[2].drag.setPosition([-225, 0]);

        this.cards[1].drag.sync.on('update', function(evt){
            if (this.cards[1].startDirection < 0) return;
            this.cards[2].drag.setPosition([evt.position[0] - 225, 0]);
        }.bind(this));

        this.cards[1].drag.sync.on('end', function(data){
            if (this.cards[1].startDirection < 0) return;
            if (data.position[0] < 100) {
                this.cards[2].drag.setPosition([-225, 0], { duration: 100 });
            } else {
                this.cards[2].drag.setPosition([0, 0], { duration: 100 });
            }
        }.bind(this));

        // this.cards[1].drag.on('update', function(){
        //     var pos = this.cards[1].drag.getPosition();
        //     this.cards[2].drag.setPosition([pos[0] - 225, pos[1]]);
        //     // this.cards[1].drag._positionState.halt();
        // }.bind(this));

    }

    function _createDeck() {
        this.cards = [];
        // this.currentIndex = 0;

        for (var i = 0; i < CARDS.length; i++) {       
            var cardView = new CardView(CARDS[i]);
            // cardView.on('nextCard', this.showNextCard.bind(this))
            this.cards.push(cardView);
        }

        // this.showCurrentCard();
    }

    module.exports = DeckView;
});
