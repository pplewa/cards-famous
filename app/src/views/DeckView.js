/*globals define*/
define(function(require, exports, module) {
	'use strict';

	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
	var Transform = require('famous/core/Transform');
	// var StateModifier = require('famous/modifiers/StateModifier');
	var Modifier = require('famous/core/Modifier');
	var Transitionable = require('famous/transitions/Transitionable');

	var RenderNode = require('famous/core/RenderNode');
	var CardView = require('views/CardView');

	var CardData = require('data/CardData');

	/*
	 * @name DeckView
	 * @constructor
	 * @description
	 */
	function DeckView() {
		View.apply(this, arguments);

		this.opacity = new Transitionable(1);
		this.rootModifier = new Modifier({
			origin: [0.5, 0.5],
			opacity: this.opacity
			// align: [0.5, 0.5]
		});

		this.deckContainer = new ContainerSurface({
			size: [400, 660],
			properties: {
				overflow: 'hidden'
			}
		});

		window.opacity = this.opacity;

		this.mainNode = this.add(this.rootModifier).add(this.deckContainer);

		this.currentIndex = 0;
		_createDeck.call(this);
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
				this.opacity.set(0, { duration: 0 });
				for (var i = 0; i < 3; i++) {
					this.cards[i].draggable.setPosition([0, 0]);
					this.renderNodes[i].set(new Modifier());
				}
				this.renderNodes[0].set(this.cards[0]);
				this.opacity.set(1, { duration: 100 }, function() {
					this.renderNodes[1].set(this.cards[1]);
					this.renderNodes[2].set(this.cards[2]);
				}.bind(this));
			}
		}
		this._eventOutput.emit('updateIndex', this.currentIndex + 1);
	};

	DeckView.prototype.showPrevCard = function() {
		this.currentIndex -= 1;
		if (this.currentIndex > 0) {
			var index = (this.currentIndex - 1) % 3;
			var card = this.cards[this.currentIndex - 1];
			if (card) {
				card.draggable.setPosition([-500, 0]);
				this.renderNodes[index].set(card);
			}
		}
		this._eventOutput.emit('updateIndex', this.currentIndex + 1);
	};

	function _createDeck() {
		this.cards = [];
		for (var i = 0; i < CardData.length; i++) {
			var cardView = new CardView({
				title: CardData[i].title,
				properties: {
					color: '#000',
					fontSize: '100px',
					lineHeight: '550px',
					textAlign: 'center',
					background: '#f0f0f0',
					border: '5px #333 solid',
					borderRadius: '20px',
					boxShadow: '2px 2px 2px rgba(0,0,0,0.1)',
					zIndex: CardData.length - i
				}
			});

			// slide left
			cardView.draggable.on('update', function(data) {
				var currentCard = this.cards[this.currentIndex];
				if (!currentCard.startDirection) {
					currentCard.startDirection = data.position[0];
				}
				if (currentCard.startDirection >= 0 && currentCard.draggable._active) {
					return currentCard.draggable.deactivate();
				}
			}.bind(this));
			cardView.draggable.on('end', function(data) {
				var currentCard = this.cards[this.currentIndex];
				currentCard.startDirection = 0;
				if (data.position[0] < -100) {
					currentCard.draggable.setPosition([-500, 0], { duration: 100 }, this.showNextCard.bind(this));
				} else {
					currentCard.draggable.setPosition([0, 0], { duration: 100 });
				}
			}.bind(this));

			// slide right
			cardView.draggable.sync.on('update', function(evt) {
				var previousCard = this.cards[this.currentIndex - 1];
				if (cardView.startDirection < 0 || !previousCard) return;
				previousCard.draggable.setPosition([evt.position[0] - 500, 0]);
			}.bind(this));
			cardView.draggable.sync.on('end', function(data) {
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
		for (var j = 0; j < 3; j++) {
			var renderNode = new RenderNode();
			this.renderNodes.push(renderNode);
			renderNode.add(this.cards[j]);
			this.deckContainer.add(renderNode);
		}
	}

	module.exports = DeckView;
});
