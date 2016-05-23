var Walls = {
    segments: [],
    boxes:[],
    add: function(x,y,w,h){
        this.segments.push({a:{x:x,y:y}, b:{x:x+w,y:y}});
        this.segments.push({a:{x:x+w,y:y}, b:{x:x+w,y:y+h}});
        this.segments.push({a:{x:x+w,y:y+h}, b:{x:x,y:y+h}});
        this.segments.push({a:{x:x,y:y+h}, b:{x:x,y:y}});
        this.boxes.push({x:x, y:y, w:w, h:h});
    },
    addSegment: function(ax,ay,bx,by){
        this.segments.push({a:{x:ax,y:ay}, b:{x:bx,y:by}});
    }
};
