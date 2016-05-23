var Key = {
    _pressed: {},

    SPACE: 32,
    A: 65,
    B: 66,
    C: 68,
    W: 87,
    D: 68,
    S: 83,


    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) {
    Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
    Key.onKeydown(event);
}, false);
