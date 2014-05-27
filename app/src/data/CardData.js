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
		ace: { name: 'ace', symbol: 'A' },
		two: { name: 'two', symbol: '2' },
		three: { name: 'three', symbol: '3' },
		four: { name: 'four', symbol: '4' },
		five: { name: 'five', symbol: '5' },
		six: { name: 'six', symbol: '6' },
		seven: { name: 'seven', symbol: '7' },
		eight: { name: 'eight', symbol: '8' },
		nine: { name: 'nine', symbol: '9' },
		ten: { name: 'ten', symbol: '10' },
		jack: { name: 'jack', symbol: 'J' },
		queen: { name: 'queen', symbol: 'Q' },
		king: { name: 'king', symbol: 'K' }
	};
	var RANKS = [RANK.ace, RANK.two, RANK.three, RANK.four, RANK.five, RANK.six, RANK.seven, RANK.eight, RANK.nine, RANK.ten, RANK.jack, RANK.queen, RANK.king];

	SUITS.forEach(function(suit) {
		RANKS.forEach(function(rank, i) {
			var middle = '';
			if (i === 0) {
				middle = '<span class="suit middle_center">' + suit.symbol + '</span>';
			} else if (i === 1) {
				middle = '<span class="suit top_center">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_center">' + suit.symbol + '</span>';
			} else if (i === 2) {
				middle = '<span class="suit top_center">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_center">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_center">' + suit.symbol + '</span>';
			} else if (i === 3) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
			} else if (i === 4) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_center">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
			} else if (i === 5) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_right">' + suit.symbol + '</span>';
			} else if (i === 6) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_right">' + suit.symbol + '</span>';
			} else if (i === 7) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_right">' + suit.symbol + '</span>';
			} else if (i === 8) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_center">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom_right">' + suit.symbol + '</span>';
			} else if (i === 9) {
				middle = '<span class="suit top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top_center">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_top_right">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit bottom_right">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom_left">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom_center">' + suit.symbol + '</span>';
				middle += '<span class="suit middle_bottom_right">' + suit.symbol + '</span>';
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