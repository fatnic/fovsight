var Wall = function(x,y,w,h,render){
    this.position = new Vec2(x, y);
    this.size = new Vec2(w, h);
    if (typeof(render) === 'undefined') this.render = true;

    this.segments = [];

    // this.init = function(){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
    // };
    // this.init();
};

Wall.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgb(0,0,255)";
    if (this.render) ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
};

Wall.prototype.debugDraw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255,255,0)';
    ctx.strokeWidth = 3;
    ctx.rect(this.position.x,  this.position.y, this.size.x, this.size.y);
    ctx.stroke();
};

function wallByGrid(x,y,w,h,grid,render) {
    if (typeof(grid) === 'undefined') grid = 16;
    Walls.push(new Wall(x*grid, y*grid, w*grid, h*grid,render));
}

function allWallSegments(){
    var wallSegments = [];
    Walls.forEach(function(wall){ wallSegments = wallSegments.concat(wall.segments); });
    return wallSegments;
}
