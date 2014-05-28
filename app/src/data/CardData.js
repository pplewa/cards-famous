define(function(require, exports, module) {
	var CardData = [];
	var SUIT = {
		club: { name: 'club', symbol: '♣', color: 'black' },
		diamond: { name: 'diamond', symbol: '&diams;', color: 'red' },
		spade: { name: 'spade', symbol: '&spades;', color: 'black' },
		heart: { name: 'heart', symbol: '&hearts;', color: 'red' }
	};
	var SUITS = [SUIT.club, SUIT.diamond, SUIT.spade, SUIT.heart];

	var RANK = {
		ace: { name: 'ace', symbol: 'A', classes: ['middle_center'] },
		two: { name: 'two', symbol: '2', classes: ['top_center', 'bottom_center'] },
		three: { name: 'three', symbol: '3', classes: ['top_center', 'middle_center', 'bottom_center'] },
		four: { name: 'four', symbol: '4', classes: ['top_left', 'top_right', 'bottom_left', 'bottom_right'] },
		five: { name: 'five', symbol: '5', classes: ['top_left', 'top_right', 'middle_center', 'bottom_left', 'bottom_right'] },
		six: { name: 'six', symbol: '6', classes: ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'middle_left', 'middle_right'] },
		seven: { name: 'seven', symbol: '7', classes: ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'middle_top', 'middle_left', 'middle_right'] },
		eight: { name: 'eight', symbol: '8', classes: ['top_left', 'top_right', 'bottom_left', 'bottom_right', 'middle_top', 'middle_bottom', 'middle_left', 'middle_right'] },
		nine: { name: 'nine', symbol: '9', classes: ['top_left', 'top_right', 'middle_top_left', 'middle_center', 'middle_top_right', 'bottom_left', 'bottom_right', 'middle_bottom_left', 'middle_bottom_right'] },
 		ten: { name: 'ten', symbol: '10', classes: ['top_left', 'top_right', 'middle_top_left', 'middle_top_center', 'middle_top_right', 'bottom_left', 'bottom_right', 'middle_bottom_left', 'middle_bottom_center', 'middle_bottom_right'] },
		jack: { name: 'jack', symbol: 'J', classes: [] },
		queen: { name: 'queen', symbol: 'Q', classes: [] },
		king: { name: 'king', symbol: 'K', classes: [] }
	};
	var RANKS = [RANK.ace, RANK.two, RANK.three, RANK.four, RANK.five, RANK.six, RANK.seven, RANK.eight, RANK.nine, RANK.ten, RANK.jack, RANK.queen, RANK.king];

	SUITS.forEach(function(suit) {
		RANKS.forEach(function(rank, i) {
			var middle = '';
			if (i < 10) {
				rank.classes.forEach(function(cls){
					middle += '<span class="suit ' + cls + '">' + suit.symbol + '</span>';
				});
			} else {
				middle = '<span class="face middle_center"><img src="content/images/faces/face-' + rank.name + '-' + suit.name + '.png"></span>';
			}
			var card = { 
				content: '<div class="card">' + 
					'<div class="card-' + rank.name + ' ' + suit.name + '">' +
						'<div class="corner top">' +
							'<span class="number">' + rank.symbol + '</span>' + 
							'<span>' + suit.symbol + '</span>' + 
						'</div>' + 
						middle + 
						'<div class="corner bottom"><span class="number">' + rank.symbol + '</span><span>' + suit.symbol + '</span></div>' +
					'</div>' +
				'</div>'
			};
			CardData.push(card);
		});
	});

	module.exports = CardData;
});