var Walls = {
    segments: [],
    boxes:[],
    add: function(x,y,w,h,solid=true){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
        if(solid) this.boxes.push({x:x, y:y, w:w, h:h});
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
Walls.add(50,280,20,200);
Walls.add(250,280,20,80);
Walls.add(250,400,20,80);
Walls.add(70,280,180,20);
Walls.add(70,460,180,20);
