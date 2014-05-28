/*globals define*/
define(function(require, exports, module) {
	'use strict';

	var View = require('famous/core/View');
	var Surface = require('famous/core/Surface');
	var Transform = require('famous/core/Transform');
	var StateModifier = require('famous/modifiers/StateModifier');
	var Draggable = require('famous/modifiers/Draggable');

	/*
	 * @name CardView
	 * @constructor
	 * @description
	 */
	function CardView() {
		View.apply(this, arguments);
		_createCard.call(this);
	}

	CardView.prototype = Object.create(View.prototype);
	CardView.prototype.constructor = CardView;

	CardView.DEFAULT_OPTIONS = {
		content: 'card',
		properties: {},
		transform: Transform.behind
	};

	function _createCard(){
		this.background = new Surface({
			size: this.options.size,
			content: this.options.content,
			properties: this.options.properties
		});

		var cardModifier = new StateModifier({
			origin: this.options.origin,
			transform: this.options.transform
		});

		this.draggable = new Draggable({
			projection: 'x',
			xRange: [-500, 0],
			yRange: [0, 0]
		});

		this.draggable.modify = function modify(target) {
			var pos = this.getPosition();
			return {
				transform: Transform.thenMove(Transform.rotateZ(pos[0]/(1500)), [pos[0], pos[1], 0]),
				target: target
			};
		};

		this.background.pipe(this.draggable);
		this.add(cardModifier).add(this.draggable).add(this.background);
	}

	module.exports = CardView;
});
