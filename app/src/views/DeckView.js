/*globals define*/
define(function(require, exports, module) {
	'use strict';

	var View = require('famous/core/View');
	var ContainerSurface = require('famous/surfaces/ContainerSurface');
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

		if (this.options.cards.length < 3) {
			throw new Error("Slider requires at least 3 cards in the deck.");
		}

		this.opacity = new Transitionable(1);
		this.rootModifier = new Modifier({
			origin: [0.5, 0.5],
			opacity: this.opacity
			// align: [0.5, 0.5]
		});

		this.deckContainer = new ContainerSurface({
			size: [this.options.size * 18, this.options.size * 24],
			properties: {
				overflow: 'hidden',
				fontSize: this.options.size + 'px'
			}
		});

		this.mainNode = this.add(this.rootModifier).add(this.deckContainer);

		this.currentIndex = 0;
		_createDeck.call(this);
	}

	DeckView.prototype = Object.create(View.prototype);
	DeckView.prototype.constructor = DeckView;

	DeckView.DEFAULT_OPTIONS = {
		cards: CardData,
		size: 18
	};

	DeckView.prototype.showCard = function(index) {
	};

	DeckView.prototype.showNextCard = function() {
		var currentCard = this.cards[this.currentIndex];
		if (currentCard.draggable.getPosition()[0] === 0) {
			currentCard.draggable.setPosition([-this.options.size * 20, 0], { duration: 200 }, this.showNextCard.bind(this));
			return;
		}

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
		var previousCard = this.cards[this.currentIndex - 1];
		if (!previousCard) {
			this.currentIndex = this.options.cards.length - 1;
			previousCard = this.cards[this.currentIndex - 1];

			this.cards[this.options.cards.length - 1].draggable.setPosition([0, 0]);
			this.renderNodes[0].set(this.cards[this.options.cards.length - 1]);

			this.cards[this.options.cards.length - 2].draggable.setPosition([-this.options.size * 20, 0]);
			this.renderNodes[2].set(this.cards[this.options.cards.length - 2]);

			this.cards[this.options.cards.length - 3].draggable.setPosition([-this.options.size * 20, 0]);
			this.renderNodes[1].set(this.cards[this.options.cards.length - 3]);

			this.opacity.set(0, { duration: 0 });
			this.opacity.set(1, { duration: 100 });
			this._eventOutput.emit('updateIndex', this.currentIndex + 1);
		} else if (previousCard.draggable.getPosition()[0] !== 0) {
			previousCard.draggable.setPosition([0, 0], { duration: 200 }, this.showPrevCard.bind(this));
		} else {
			this.currentIndex -= 1;
			if (this.currentIndex > 0) {
				var index = (this.currentIndex - 1) % 3;
				var card = this.cards[this.currentIndex - 1];
				if (card && this.currentIndex) {
					card.draggable.setPosition([-this.options.size * 20, 0]);
					this.renderNodes[index].set(card);
				}
			}
			this._eventOutput.emit('updateIndex', this.currentIndex + 1);
		}
	};

	function _onLeftMove(data) {
		var currentCard = this.cards[this.currentIndex];
		if (!currentCard.startDirection) {
			currentCard.startDirection = data.position[0];
		}
		if (currentCard.startDirection >= 0 && currentCard.draggable._active) {
			currentCard.draggable.deactivate();
		}
	}

	function _onLeftEnd(data) {
		var currentCard = this.cards[this.currentIndex];
		if (data.position[0] < -100) {
			currentCard.draggable.setPosition([-this.options.size * 20, 0], { duration: 100 }, this.showNextCard.bind(this));
		} else {
			currentCard.draggable.setPosition([0, 0], { duration: 100 });
		}
	}

	function _onRightMove(evt) {
		var previousCard = this.cards[this.currentIndex - 1];
		if (this.cards[this.currentIndex].startDirection < 0) return;
		if (!previousCard) {
			for (var i = 0; i < 3; i++) {
				this.cards[this.currentIndex + i].draggable.setPosition([evt.position[0], 0]);
			}
		} else {
			previousCard.draggable.setPosition([evt.position[0] - this.options.size * 20, 0]);
		}
	}

	function _onRightEnd(data) {
		var previousCard = this.cards[this.currentIndex - 1];
		var currentCard = this.cards[this.currentIndex];
		currentCard.draggable.activate();

		if (currentCard.startDirection < 0) {
			currentCard.startDirection = 0;
			return;
		}
		currentCard.startDirection = 0;
		if (!previousCard) {
			for (var i = 0; i < 3; i++) {
				if (data.position[0] < 100) {
					this.cards[this.currentIndex + i].draggable.setPosition([0, 0], { duration: 100 });
				} else {
					this.cards[this.currentIndex + i].draggable.setPosition([500, 0], { duration: 100 }, function(i) {
						if (i === 0) { 
							this.showPrevCard();
						}
					}.bind(this, i));
				}
			}
		} else {
			if (data.position[0] < 100) {
				previousCard.draggable.setPosition([-this.options.size * 20, 0], { duration: 100 });
			} else {
				previousCard.draggable.setPosition([0, 0], { duration: 100 });
				this.showPrevCard();
			}
		}
	}

	function _createDeck() {
		this.cards = [];
		for (var i = 0; i < this.options.cards.length; i++) {
			var cardView = new CardView({
				content: this.options.cards[i].content,
				properties: {
					zIndex: this.options.cards.length - i
				}
			});

			cardView.draggable.sync.on('update', _onRightMove.bind(this));
			cardView.draggable.sync.on('end', _onRightEnd.bind(this));
			cardView.draggable.on('update', _onLeftMove.bind(this));
			cardView.draggable.on('end', _onLeftEnd.bind(this));

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
