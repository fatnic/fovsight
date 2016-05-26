var heading = 0;
var SPEED = 10;
var FOV = deg2rad(50);
var envImg;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function draw() {

    var wallSegments = [];
    Walls.forEach(function(wall){ wallSegments = wallSegments.concat(wall.segments); });

    var uniquePoints = (function(segments) {
        var a = [];
        segments.forEach(function(seg) {
            a.push(seg.a, seg.b);
        });
        return a;
    })(wallSegments);

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

        var ray = { a: { x: Center.x, y: Center.y }, b: { x: Center.x + dx, y: Center.y + dy } };

        var closestIntersect = null;

        for (var l = 0; l < wallSegments.length; l++) {
            var intersection = getIntersection(ray, wallSegments[l]);
            if (!intersection) continue;
            if (!closestIntersect || intersection.param < closestIntersect.param) {
                closestIntersect = intersection;
            }
        }

        if (!closestIntersect) continue;
        closestIntersect.angle = angler;

        intersects.push(closestIntersect);
    }

    intersects = intersects.sort(function(a, b) { return a.angle - b.angle; });
    rotate(intersects, findWithAttr(intersects, "angle", minFOV));

    ctx.fillStyle = pointInVision(intersects, player) ? 'rgba(255,0,0,0.4)' : 'rgba(255,255,255,0.4)';

    ctx.beginPath();
    ctx.moveTo(Center.x, Center.y);
    for (var g = 0; g < intersects.length; g++) {
        var intersect = intersects[g];
        ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.fill();

    // Player circle
    player.draw(ctx);

}

function renderEnvironment() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(0,0,255)";
        for(var i=0; i < Walls.length; i++) {
            var w = Walls[i];
            if (w.renderable) ctx.fillRect(w.position.x, w.position.y, w.size.w, w.size.h);
        }

        envImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

var lastUpdate = Date.now();

function drawLoop() {
    window.requestAnimationFrame(drawLoop);

    var now = Date.now();
    var dt = (now - lastUpdate)/100;
    lastUpdate = now;

    if (Key.isDown(Key.W)) Events.emit("keyUp", dt, player);
    if (Key.isDown(Key.S)) Events.emit("keyDown", dt, player);
    if (Key.isDown(Key.D)) Events.emit("keyRight", dt, player);
    if (Key.isDown(Key.A)) Events.emit("keyLeft", dt, player);

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
