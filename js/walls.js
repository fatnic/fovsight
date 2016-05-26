var Wall = function(x,y,w,h,render){
    this.position = {x: x, y: y};
    this.size = {w: w, h: h};
    if (typeof(render) === 'undefined') this.render = true;

    this.segments = [];

    this.init = function(){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
    };
    this.init();

    return {
        position: this.position,
        size: this.size,
        renderable : this.render,
        segments: this.segments
    };
};

function wallByGrid(x,y,w,h,grid,render) {
    if (typeof(grid) === 'undefined') grid = 16;
    Walls.push(new Wall(x*grid, y*grid, w*grid, h*grid,render));
}

var Walls = [];

Walls.push(new Wall(0, 0, canvas.width, canvas.height, false));
Walls.push(new Wall(50,50,100,200));
Walls.push(new Wall(850,50,50,400));
Walls.push(new Wall(750,50,50,400));
Walls.push(new Wall(250,50,100,50));
Walls.push(new Wall(650,50,100,50));
Walls.push(new Wall(400,50,100,50));
Walls.push(new Wall(750,480,150,50));

wallByGrid(4, 20, 12, 1);
wallByGrid(4, 30, 12, 1);
wallByGrid(4, 21, 1, 9);
wallByGrid(15, 21, 1, 3);
wallByGrid(15, 27, 1, 3);
