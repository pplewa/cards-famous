/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    
    var RenderNode = require('famous/core/RenderNode');
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
        { title: 'card 3' },
        { title: 'card 4' },
        { title: 'card 5' },
        { title: 'card 6' },
        { title: 'card 7' },
        { title: 'card 8' },
        { title: 'card 9' },
        { title: 'card 10' },
        { title: 'card 11' }
    ];

    function DeckView() {
        View.apply(this, arguments);

        this.rootModifier = new StateModifier({
            origin: [0.5, 0.5]
            // align: [0.5, 0.5]
        });

        this.mainNode = this.add(this.rootModifier);

        this.currentIndex = 0;
        _createDeck.call(this);

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
        this.currentIndex += 1;
        console.log('next');
        this.showCard();
        // this.lightbox._showing = false;

        // if (!this.ready) return;

        // if (this.currentIndex === this.cards.length) this.currentIndex = 0;
        // this.showCurrentCard();
    };

    DeckView.prototype.showPrevCard = function() {
        this.currentIndex -= 1;
        console.log('prev');
        // this.lightbox._showing = false;

        // if (!this.ready) return;

        // if (this.currentIndex === this.cards.length) this.currentIndex = 0;
        // this.showCurrentCard();
    };

    DeckView.prototype.showCard = function() {
        if (this.currentIndex > 1) {
            var index = (this.currentIndex + 1) % 3;
            var card = this.cards[this.currentIndex + 1];
            card.drag.setPosition([0, 0]);
            this.renderNodes[index].set(card);
        }

        this.cards[this.currentIndex].drag.sync.on('update', function(evt){
            if (this.cards[this.currentIndex].startDirection < 0) return;
            this.cards[this.currentIndex - 1].drag.setPosition([evt.position[0] - 225, 0]);
        }.bind(this));

        this.cards[this.currentIndex].drag.sync.on('end', function(data){
            if (this.cards[this.currentIndex].startDirection < 0) return;
            if (data.position[0] < 100) {
                this.cards[this.currentIndex - 1].drag.setPosition([-225, 0], { duration: 100 });
            } else {
                this.cards[this.currentIndex - 1].drag.setPosition([0, 0], { duration: 100 });
                this.showPrevCard();
            }
        }.bind(this));
    };

    function _createDeck() {
        this.cards = [];
        for (var i = 0; i < CARDS.length; i++) {       
            var cardView = new CardView({ title: CARDS[i].title, transform: Transform.translate(0, 0, -i*0.1) });
            cardView.on('nextCard', this.showNextCard.bind(this));
            this.cards.push(cardView);
        }

        this.renderNodes = [];
        for (var i = 0; i < 3; i++) {
            var renderNode = new RenderNode();
            this.renderNodes.push(renderNode);
            renderNode.add(this.cards[i])
            this.mainNode.add(renderNode);
        }
        
        // this.cards[2].drag.setPosition([-225, 0]);
        // this.cards[1].drag.sync.on('update', function(evt){
        //     if (this.cards[1].startDirection < 0) return;
        //     this.cards[0].drag.setPosition([evt.position[0] - 225, 0]);
        // }.bind(this));

        // this.cards[1].drag.sync.on('end', function(data){
        //     if (this.cards[1].startDirection < 0) return;
        //     if (data.position[0] < 100) {
        //         this.cards[0].drag.setPosition([-225, 0], { duration: 100 });
        //     } else {
        //         this.cards[0].drag.setPosition([0, 0], { duration: 100 });
        //         this.showPrevCard();
        //     }
        // }.bind(this));
    }

    module.exports = DeckView;
});
