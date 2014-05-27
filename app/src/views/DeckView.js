/*globals define*/
define(function(require, exports, module) {
	'use strict';

	var View = require('famous/core/View');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
	// var Surface = require('famous/core/Surface');
	// var Transform = require('famous/core/Transform');
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

		window.DeckView = this;

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

	function _onLeftMove(data) {
		var currentCard = this.cards[this.currentIndex];
		if (!currentCard.startDirection) {
			currentCard.startDirection = data.position[0];
		} else if (currentCard.startDirection >= 0 && currentCard.draggable._active) {
			currentCard.draggable.deactivate();
		}
	}

	function _onLeftEnd(data) {
		var currentCard = this.cards[this.currentIndex];
		currentCard.startDirection = 0;
		if (data.position[0] < -100) {
			currentCard.draggable.setPosition([-500, 0], { duration: 100 }, this.showNextCard.bind(this));
		} else {
			currentCard.draggable.setPosition([0, 0], { duration: 100 });
		}
	}

	function _onRightMove(evt) {
		var previousCard = this.cards[this.currentIndex - 1];
		var currentCard = this.cards[this.currentIndex];
		if (currentCard.startDirection < 0) return;
		if (!previousCard) {
			currentCard.draggable.setPosition([evt.position[0], 0]);
			this.cards[this.currentIndex + 1].draggable.setPosition([evt.position[0], 0]);
			this.cards[this.currentIndex + 2].draggable.setPosition([evt.position[0], 0]);
		} else {
			previousCard.draggable.setPosition([evt.position[0] - 500, 0]);
		}
	}

	function _onRightEnd(data) {
		var previousCard = this.cards[this.currentIndex - 1];
		var currentCard = this.cards[this.currentIndex];
		currentCard.draggable.activate();
		// if (currentCard.startDirection < 0) return;
		// currentCard.startDirection = 0;

		if (!previousCard) {
			if (data.position[0] < 100) {
				currentCard.draggable.setPosition([0, 0], { duration: 100 });
				this.cards[this.currentIndex + 1].draggable.setPosition([0, 0], { duration: 100 });
				this.cards[this.currentIndex + 2].draggable.setPosition([0, 0], { duration: 100 });
			} else {
				// currentCard.draggable.setPosition([500, 0], { duration: 100 });
				// this.cards[this.currentIndex + 1].draggable.setPosition([500, 0], { duration: 100 });
				// this.cards[this.currentIndex + 2].draggable.setPosition([500, 0], { duration: 100 });
				this.currentIndex = CardData.length - 1;
				// this.opacity.set(0, { duration: 0 });
				// this.cards[CardData.length-3].draggable.setPosition([0, 0]);
				// this.renderNodes[0].set(new Modifier());
				// this.renderNodes[1].set(new Modifier());
				// this.renderNodes[2].set(new Modifier());

				this.cards[CardData.length-1].draggable.setPosition([0, 0]);
				this.renderNodes[2].set(this.cards[CardData.length-1]);
				// this.opacity.set(1, { duration: 100 });

				this.cards[CardData.length-2].draggable.setPosition([-500, 0]);
				this.renderNodes[1].set(this.cards[CardData.length-2]);

				this.cards[CardData.length-3].draggable.setPosition([-500, 0]);
				this.renderNodes[0].set(this.cards[CardData.length-3]);
			}
		} else {
			if (data.position[0] < 100) {
				previousCard.draggable.setPosition([-500, 0], { duration: 100 });
			} else {
				previousCard.draggable.setPosition([0, 0], { duration: 100 });
				this.showPrevCard();
			}
		}
	}

	function _createDeck() {
		this.cards = [];
		for (var i = 0; i < CardData.length; i++) {
			var cardView = new CardView({
				content: CardData[i].content,
				properties: {
					zIndex: CardData.length - i
				}
			});

			cardView.draggable.on('update', _onLeftMove.bind(this));
			cardView.draggable.on('end', _onLeftEnd.bind(this));
			// cardView.draggable.sync.on('update', _onRightMove.bind(this));
			// cardView.draggable.sync.on('end', _onRightEnd.bind(this));

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
