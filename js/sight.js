var heading = 0;
var SPEED = 10;
var FOV = deg2rad(50);
var envImg;
var Player = {
    x: 180,
    y: 170,
    moveUp: function(dt) { this.y -= SPEED * dt; },
    moveDown: function(dt) { this.y += SPEED * dt; },
    moveLeft: function(dt) { this.x -= SPEED * dt; },
    moveRight: function(dt) { this.x += SPEED * dt; }
};
// function Player(){
//     this.x = 180;
//     this.y = 170;
//     // this.moveUp = function(dt) { this.y -= SPEED * dt; };
//     // this.moveDown = function(dt) { this.y += SPEED * dt; };
//     // this.moveLeft = function(dt) { this.x -= SPEED * dt; };
//     // this.moveRight = function(dt) { this.x += SPEED * dt; };
// }

function moveplayerUp(dt){ Player.moveUp(dt); }
function moveplayerDown(dt){ Player.moveDown(dt); }
function moveplayerLeft(dt){ Player.moveLeft(dt); }
function moveplayerRight(dt){ Player.moveRight(dt); }

Events.on("keyUp", moveplayerUp);
Events.on("keyDown", moveplayerDown);
Events.on("keyLeft", moveplayerLeft);
Events.on("keyRight", moveplayerRight);


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

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

    ctx.fillStyle = pointInVision(intersects, Player) ? 'rgba(255,0,0,0.4)' : 'rgba(255,255,255,0.4)';

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

    // Player circle
    ctx.fillStyle = 'rgb(255,255,100)';
	ctx.beginPath();
	ctx.arc(Player.x, Player.y, 4, 0, RAD, false);
	ctx.fill();

    // ctx.fillStyle = "#dd3838";
    // for(var n=0; n < intersects.length; n++){
    // 	var intersect = intersects[n];
    // 	ctx.strokeStyle = (intersect.angle == minFOV || intersect.angle == maxFOV) ? "rgba(0,255,255,0.2)" : "rgba(255,0,0,0.2)";

    // DRAW DEBUG RAYS
    // ctx.strokeStyle = 'rgb(255,0,0)';
    // for (var g = 0; g < intersects.length; g++) {
    //     ctx.beginPath();
    //     ctx.moveTo(Center.x, Center.y);
    //     ctx.lineTo(intersects[g].x, intersects[g].y);
    //     ctx.stroke();
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

        ctx.fillStyle = "rgb(0,0,255)";
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

    // if (Key.isDown(Key.W)) Player.y -= SPEED*dt;
    // if (Key.isDown(Key.S)) Player.y += SPEED*dt;
    // if (Key.isDown(Key.D)) Player.x += SPEED*dt;
    // if (Key.isDown(Key.A)) Player.x -= SPEED*dt;

    // if (Key.isDown(Key.W)) Player.moveUp(dt);
    // if (Key.isDown(Key.S)) Player.y += SPEED*dt;
    // if (Key.isDown(Key.D)) Player.x += SPEED*dt;
    // if (Key.isDown(Key.A)) Player.x -= SPEED*dt;

    if (Key.isDown(Key.W)) Events.emit("keyUp", dt);
    if (Key.isDown(Key.S)) Events.emit("keyDown", dt);
    if (Key.isDown(Key.D)) Events.emit("keyRight", dt);
    if (Key.isDown(Key.A)) Events.emit("keyLeft", dt);

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
