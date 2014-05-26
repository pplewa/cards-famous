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

        this.deckContainer = new ContainerSurface({
            size: [400, 660],
            properties: {
                overflow: 'hidden'
            }
        });

        // this.deckContainer.add(new StateModifier({
        //     transform: Transform.translate(0, 0, 0.1)
        // }));

        this.mainNode = this.add(this.rootModifier).add(this.deckContainer);

        this.currentIndex = 0;
        _createDeck.call(this);
        _createCounter.call(this);
    }

    DeckView.prototype = Object.create(View.prototype);
    DeckView.prototype.constructor = DeckView;

    DeckView.DEFAULT_OPTIONS = {
    };

    DeckView.prototype.showNextCard = function() {
        this.currentIndex += 1;
        if (this.currentIndex > 1) {
            var index = (this.currentIndex + 1) % 3;
            var card = this.cards[this.currentIndex + 1];
            if (card) {
                card.draggable.setPosition([0, 0]);
                this.renderNodes[index].set(card);
            } 
            if (!this.cards[this.currentIndex]) {
                this.currentIndex = 0;
                for (var i = 0; i < 3; i++) {
                    this.cards[i].draggable.setPosition([0, 0]);
                    this.renderNodes[i].set(this.cards[i]);
                }
            }
        }
        this.counter.setContent(this.currentIndex + 1);
    };

    DeckView.prototype.showPrevCard = function() {
        this.currentIndex -= 1;
        // this._eventOutput.emit('updateCounter')
        if (this.currentIndex > 0) {
            var index = (this.currentIndex - 1) % 3;
            var card = this.cards[this.currentIndex - 1];
            if (card) {
                card.draggable.setPosition([-500, 0]);
                this.renderNodes[index].set(card);
            }
        }
        this.counter.setContent(this.currentIndex + 1);
    };

    function _createDeck() {
        this.cards = [];
        for (var i = 0; i < CARDS.length; i++) {       
            var cardView = new CardView({ 
                title: CARDS[i].title, 
                zIndex: CARDS.length-i
                // transform: Transform.translate(0, 0, (i * 0.1))
            });

            // slide left
            cardView.draggable.on('update', function(data){
                var currentCard = this.cards[this.currentIndex];
                if (!currentCard.startDirection) {
                    currentCard.startDirection = data.position[0];
                }
                if (currentCard.startDirection >= 0 && currentCard.draggable._active) {
                    return currentCard.draggable.deactivate();
                }
            }.bind(this));
            cardView.draggable.on('end', function(data){
                var currentCard = this.cards[this.currentIndex];
                currentCard.startDirection = 0;
                if (data.position[0] < -100) {
                    currentCard.draggable.setPosition([-500, 0], { duration: 100 }, this.showNextCard.bind(this));
                } else {
                    currentCard.draggable.setPosition([0, 0], { duration: 100 });
                }
            }.bind(this));

            // slide right
            cardView.draggable.sync.on('update', function(evt){
                var previousCard = this.cards[this.currentIndex - 1];
                if (cardView.startDirection < 0 || !previousCard) return;
                previousCard.draggable.setPosition([evt.position[0] - 500, 0]);
            }.bind(this));
            cardView.draggable.sync.on('end', function(data){
                this.cards[this.currentIndex].draggable.activate();
                var previousCard = this.cards[this.currentIndex - 1];
                if (cardView.startDirection < 0 || !previousCard) return;
                if (data.position[0] < 100) {
                    previousCard.draggable.setPosition([-500, 0], { duration: 100 });
                } else {
                    previousCard.draggable.setPosition([0, 0], { duration: 100 });
                    this.showPrevCard();
                }
            }.bind(this));

            this.cards.push(cardView);
        }

        this.renderNodes = [];
        for (var i = 0; i < 3; i++) {
            var renderNode = new RenderNode();
            this.renderNodes.push(renderNode);
            renderNode.add(this.cards[i])
            this.deckContainer.add(renderNode);
        }
    }

    function _createCounter() {
        this.counterModifier = new StateModifier({
            origin: [0.5, 0.75]
        });

        this.counter = new Surface({
            size: [100, 20],
            content: this.currentIndex + 1,
            properties: {
                background: '#ccc',
                textAlign: 'center'
            }
        });

        this.mainNode.add(this.counterModifier).add(this.counter);
    }

    module.exports = DeckView;
});
