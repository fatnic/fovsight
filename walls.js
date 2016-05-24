var Walls = {
    segments: [],
    boxes:[],
    add: function(x,y,w,h,solid=true){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
        if(solid) this.boxes.push({x:x,y:y,w:w,h:h});
    }
};

function gridWall(x,y,w,h,g=16){
    Walls.add(x*g,y*g,w*g,h*g);
}

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
gridWall(4, 20, 12, 1);
gridWall(4, 30, 12, 1);
gridWall(4, 21, 1, 9);
gridWall(15, 21, 1, 3);
gridWall(15, 27, 1, 3);
