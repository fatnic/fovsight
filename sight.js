var heading = 0;
var SPEED = 10;
var FOV = deg2rad(50);
var envImg;
var Baddie = {x:180,y:170};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function pointInVision(poly, point){
    for(var i=0; i < poly.length; i++){
        if(i == poly.length - 1) continue;
        t1 = Center;
        t2 = poly[i];
        t3 = poly[i+1];
        if(pointInTriangle(point, t1, t2, t3)) return true;
    }
    return false;
}

function pointInTriangle(p, t1, t2, t3){
    var d = ((t2.y-t3.y)*(t1.x-t3.x) + (t3.x-t2.x)*(t1.y-t3.y));

    var a = ((t2.y-t3.y)*(p.x-t3.x) + (t3.x-t2.x)*(p.y-t3.y)) / d;
    var b = ((t3.y-t1.y)*(p.x-t3.x) + (t1.x-t3.x)*(p.y-t3.y)) / d;
    var c = 1 - a - b;

    return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
}

function draw() {

    var points = (function(segments) {
        var a = [];
        segments.forEach(function(seg) {
            a.push(seg.a, seg.b);
        });
        return a;
    })(Walls.segments);

    // var uniquePoints = (function(points) {
    //     var set = {};
    //     return points.filter(function(p) {
    //         var key = p.x + "," + p.y;
    //         if (key in set) {
    //             return false;
    //         } else {
    //             set[key] = true;
    //             return true;
    //         }
    //     });
    // })(points);

    var uniquePoints = points;

    var minFOV = radNormalize(heading - (FOV / 2));
    var maxFOV = radNormalize(heading + (FOV / 2));

    var uniqueAngles = [];
    uniqueAngles.push(minFOV, maxFOV);

    var precision = 0.000001;
    for (var k = 0; k < uniquePoints.length; k++) {
        var uniquePoint = uniquePoints[k];
        var angle = Math.atan2(uniquePoint.y - Center.y, uniquePoint.x - Center.x);

        if (!radBetween(angle, minFOV, maxFOV)) continue;

        uniquePoint.angle = radNormalize(angle);
        uniqueAngles.push(radNormalize(angle - precision));
        uniqueAngles.push(radNormalize(angle));
        uniqueAngles.push(radNormalize(angle + precision));
    }

    var intersects = [];

    for (var j = 0; j < uniqueAngles.length; j++) {
        var angler = uniqueAngles[j];

        var dx = Math.cos(angler);
        var dy = Math.sin(angler);

        var ray = {
            a: {
                x: Center.x,
                y: Center.y
            },
            b: {
                x: Center.x + dx,
                y: Center.y + dy
            }
        };

        var closestIntersect = null;

        for (var l = 0; l < Walls.segments.length; l++) {
            var intersection = getIntersection(ray, Walls.segments[l]);
            if (!intersection) continue;
            if (!closestIntersect || intersection.param < closestIntersect.param) {
                closestIntersect = intersection;
            }
        }

        if (!closestIntersect) continue;
        closestIntersect.angle = angler;

        intersects.push(closestIntersect);
    }

    intersects = intersects.sort(function(a, b) {
        return a.angle - b.angle;
    });
    rotate(intersects, findWithAttr(intersects, "angle", minFOV));

    ctx.fillStyle = pointInVision(intersects, Baddie) ? 'rgba(255,0,0,0.4)' : 'rgba(255,255,255,0.4)';

    // ctx.fillStyle = 'rgba(255,255,255,0.4)';
    // ctx.shadowBlur = 30;
    // ctx.shadowColor = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.moveTo(Center.x, Center.y);
    for (var g = 0; g < intersects.length; g++) {
        var intersect = intersects[g];
        ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.fill();

    ctx.fillStyle = 'rgb(255,0,0)';
	ctx.beginPath();
	ctx.arc(Baddie.x, Baddie.y, 4, 0, RAD, false);
	ctx.fill();

    // ctx.fillStyle = "#dd3838";
    // for(var n=0; n < intersects.length; n++){
    // 	var intersect = intersects[n];
    // 	ctx.strokeStyle = (intersect.angle == minFOV || intersect.angle == maxFOV) ? "rgba(0,255,255,0.2)" : "rgba(255,0,0,0.2)";

    // ctx.strokeStyle = 'rgb(255,0,0)';
    // for (var g = 0; g < intersects.length; g++) {
    //     ctx.beginPath();
    //     ctx.moveTo(Center.x, Center.y);
    //     ctx.lineTo(intersects[g].x, intersects[g].y);
    //     ctx.stroke();
    //
    // }


    // 	// ctx.beginPath();
    // 	// ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
    // 	// ctx.fill();
    // }
}

function renderEnvironment() {
    // var bgImg = new Image();
    // bgImg.onload = function(){
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ctx.strokeStyle = "#999";
        // for (var i = 0; i < Walls.segments.length; i++) {
        //     var seg = Walls.segments[i];
        //     ctx.beginPath();
        //     ctx.moveTo(seg.a.x, seg.a.y);
        //     ctx.lineTo(seg.b.x, seg.b.y);
        //     ctx.stroke();
        // }

        // ctx.drawImage(this, 0, 0);

        ctx.fillStyle = "#8ab325";
        for(var i=0; i < Walls.boxes.length; i++) {
            var w = Walls.boxes[i];
            ctx.fillRect(w.x, w.y, w.w, w.h);
        }
        envImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // };
    // bgImg.src = "bg.jpg";
}

var lastUpdate = Date.now();

function drawLoop() {
    window.requestAnimationFrame(drawLoop);

    var now = Date.now();
    var dt = (now - lastUpdate)/100;
    lastUpdate = now;

    if (Key.isDown(Key.W)) Baddie.y -= SPEED*dt;
    if (Key.isDown(Key.S)) Baddie.y += SPEED*dt;
    if (Key.isDown(Key.D)) Baddie.x += SPEED*dt;
    if (Key.isDown(Key.A)) Baddie.x -= SPEED*dt;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(envImg,0, 0);
    draw();
}

window.onload = function() {
    renderEnvironment();
    drawLoop();
};

var Center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.onmousemove = function(event) {
    heading = Math.atan2(event.clientY - Center.y, event.clientX - Center.x);
    updateCanvas = true;
};

canvas.onclick = function(event) {
    Center.x = event.clientX;
    Center.y = event.clientY;
    updateCanvas = true;
};
