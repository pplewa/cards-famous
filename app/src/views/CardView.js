/*globals define*/
define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    /*
     * @name CardView
     * @constructor
     * @description
     */

    function CardView() {
        View.apply(this, arguments);

        _createBackground.call(this);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {
        title: 'card'
    };

    function _createBackground(){
        var background = new Surface({
            size: [200, 300],
            content: this.options.title,
            properties: {
                color: '#fff',
                textAlign: 'center',
                background: '#333'
            }
        });

        var backgroundModifier = new StateModifier({
            // origin: [0.5, 0.5]
        });

        this.add(backgroundModifier).add(background);
    }

    module.exports = CardView;
});
