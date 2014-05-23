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
    };

    function _createBackground(){
        var background = new Surface({
            content: 'card'
        });

        this.add(background);
    }

    module.exports = CardView;
});
