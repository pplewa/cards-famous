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

        var draggable = new Draggable({
            // projection: Draggable.DIRECTION_X,
            xRange: [-220, 0],
            yRange: [0, 0],
            transition: { duration: 500, curve: 'easeOut' }
        });

        draggable.modify = function modify(target) {
            var pos = this.getPosition();
            return {
                // transform: Transform.translate(pos[0], pos[1]),
                transform: Transform.thenMove(Transform.rotateZ(pos[0]/(1500)), [pos[0], pos[1], 0]),
                target: target
            };
        };

        background.pipe(draggable);

        draggable.on('start', function(){
            this._eventOutput.emit('nextCard');
            // console.log('abc');
        }.bind(this));

        draggable.on('end', function(data){
            if (data.position[0] < -100) {
                this.setPosition([-250, 0], { duration: 100 });
            } else {
                this.setPosition([0, 0], { duration: 100 });
            }
            // this._eventOutput.emit('nextCard');
            // console.log('abc');
        });

        this.add(draggable).add(background);
    }

    module.exports = CardView;
});
