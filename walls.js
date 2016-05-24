var Walls = {
    segments: [],
    boxes:[],
    grid: 16,
    add: function(x,y,w,h,solid=true){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
        if(solid) this.boxes.push({x:x,y:y,w:w,h:h});
    },
    addByGrid: function(x,y,w,h,solid=true){
        this.add(x*this.grid, y*this.grid, w*this.grid, h*this.grid,solid);
    }
};

// Outer wall
Walls.add(0, 0, canvas.width, canvas.height, false);

// Random walls
Walls.add(50,50,100,200);
Walls.add(850,50,50,400);
Walls.add(750,50,50,400);
Walls.add(250,50,100,50);
Walls.add(650,50,100,50);
Walls.add(400,50,100,50);
Walls.add(750,480,150,50);

// Room walls
Walls.addByGrid(4, 20, 12, 1);
Walls.addByGrid(4, 30, 12, 1);
Walls.addByGrid(4, 21, 1, 9);
Walls.addByGrid(15, 21, 1, 3);
Walls.addByGrid(15, 27, 1, 3);
