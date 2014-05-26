/*globals define*/
define(function(require, exports, module) {
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

        _createBackground.call(this);
    }

    CardView.prototype = Object.create(View.prototype);
    CardView.prototype.constructor = CardView;

    CardView.DEFAULT_OPTIONS = {
        title: 'card',
        transform: Transform.behind
    };

    function _createBackground(){
        var background = new Surface({
            size: [390, 590],
            content: this.options.title,
            properties: {
                color: '#000',
                fontSize: '100px',
                lineHeight: '550px',
                textAlign: 'center',
                background: '#f0f0f0',
                border: '5px #333 solid',
                borderRadius: '20px',
                boxShadow: '2px 2px 2px rgba(0,0,0,0.1)',
                zIndex: this.options.zIndex
            }
        });

        var backgroundModifier = new StateModifier({
            origin: [0.5, 0.5],
            transform: this.options.transform
        });

        this.draggable = new Draggable({
            projection: 'x',
            xRange: [-500, 0],
            yRange: [0, 0],
            transition: { duration: 500, curve: 'easeOut' }
        });

        this.draggable.modify = function modify(target) {
            var pos = this.getPosition();
            return {
                transform: Transform.thenMove(Transform.rotateZ(pos[0]/(1500)), [pos[0], pos[1], 0]),
                target: target
            };
        };

        background.pipe(this.draggable);
        this.add(backgroundModifier).add(this.draggable).add(background);
    }

    module.exports = CardView;
});
