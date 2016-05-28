function Vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vec2.prototype = {

    set: function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    negative: function() {
        return new Vec2(-this.x, -this.y);
    },

    add: function(v) {
        if (v instanceof Vec2) return new Vec2(this.x + v.x, this.y + v.y);
        else return new Vec2(this.x + v, this.y + v);
    },

    subtract: function(v) {
        if (v instanceof Vec2) return new Vec2(this.x - v.x, this.y - v.y);
        else return new Vec2(this.x - v, this.y - v);
    },

    multiply: function(v) {
        if (v instanceof Vec2) return new Vec2(this.x * v.x, this.y * v.y);
        else return new Vec2(this.x * v, this.y * v);
    },

    divide: function(v) {
        if (v instanceof Vec2) return new Vec2(this.x / v.x, this.y / v.y);
        else return new Vec2(this.x / v, this.y / v);
    },

    equals: function(v) {
        return this.x == v.x && this.y == v.y;
    },

    dot: function(v) {
        return this.x * v.x + this.y * v.y;
    },

    length: function() {
        return Math.sqrt(this.dot(this));
    },

    unit: function() {
        return this.divide(this.length());
    },

    toAngle: function() {
        return Math.asin(this.y / this.length());
    },

    // angleTo: function(a) {
    //     return Math.acos(this.dot(a) / (this.length() * a.length()));
    // },

    angleTo: function(a) {
        // return Math.acos(this.dot(a) / (this.length() * a.length()));
        return Math.atan2(a.y - this.y, a.x - this.x);
    },

    toArray: function(n) {
        return [this.x, this.y].slice(0, n || 2);
    },

    clone: function() {
        return new Vec2(this.x, this.y);
    },

};
