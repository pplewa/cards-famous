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

        var deckContainer = new ContainerSurface({
            size: [190, 290],
            properties: {
                overflow: 'hidden'
            }
        });

        this.mainNode = this.add(this.rootModifier);

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
                card.drag.setPosition([0, 0]);
                this.renderNodes[index].set(card);
            } 
            if (!this.cards[this.currentIndex]) {
                this.currentIndex = 0;
                for (var i = 0; i < 3; i++) {
                    this.cards[i].drag.setPosition([0, 0]);
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
                card.drag.setPosition([-225, 0]);
                this.renderNodes[index].set(card);
            }
        }
        this.counter.setContent(this.currentIndex + 1);
    };

    function _createDeck() {
        this.cards = [];
        for (var i = 0; i < CARDS.length; i++) {       
            var cardView = new CardView({ title: CARDS[i].title, transform: Transform.translate(0, 0, -i*0.1) });
            cardView.on('nextCard', this.showNextCard.bind(this));

            cardView.drag.sync.on('update', function(evt){
                var previousCard = this.cards[this.currentIndex - 1];
                if (cardView.startDirection < 0 || !previousCard) return;
                previousCard.drag.setPosition([evt.position[0] - 225, 0]);
            }.bind(this));

            cardView.drag.sync.on('end', function(data){
                var previousCard = this.cards[this.currentIndex - 1];
                if (cardView.startDirection < 0 || !previousCard) return;
                if (data.position[0] < 100) {
                    previousCard.drag.setPosition([-225, 0], { duration: 100 });
                } else {
                    previousCard.drag.setPosition([0, 0], { duration: 100 });
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
            this.mainNode.add(renderNode);
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
