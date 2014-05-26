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
            size: [190, 290],
            content: this.options.title,
            properties: {
                color: '#fff',
                textAlign: 'center',
                background: '#333',
                border: '5px #ff0 solid'
            }
        });

        var backgroundModifier = new StateModifier({
            // origin: [0.5, 0.5]
            transform: this.options.transform
        });

        var draggable = this.drag = new Draggable({
            projection: 'x',
            xRange: [-225, 0],
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

        // draggable.sync.on('update', function(evt){
        //     if (evt.delta[0] !== 1) return;
        //     // this._eventOutput.emit('nextCard');
        //     console.log(evt.offsetX);
        // });
        // 
        var _this = this;
        draggable.on('update', function(data){
            if (!_this.startDirection) {
                _this.startDirection = data.position[0];
            }
            if (_this.startDirection >= 0 && this._active) {
                return this.deactivate();
            }
        });

        draggable.sync.on('end', function(){
            draggable.activate();
        })

        draggable.on('end', function(data){
            _this.startDirection = 0;
            if (data.position[0] < -100) {
                this.setPosition([-225, 0], { duration: 100 }, function(){
                    _this._eventOutput.emit('nextCard');
                });
            } else {
                this.setPosition([0, 0], { duration: 100 });
                // _this._eventOutput.emit('prevCard');
            }
        });

        this.add(backgroundModifier).add(draggable).add(background);
    }

    module.exports = CardView;
});
