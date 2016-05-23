var RAD = 2 * Math.PI;
var heading = 0;
var FOV = deg2rad(60);

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#999";

    for (var i = 0; i < segments.length; i++) {
        var seg = segments[i];
        ctx.beginPath();
        ctx.moveTo(seg.a.x, seg.a.y);
        ctx.lineTo(seg.b.x, seg.b.y);
        ctx.stroke();
    }

    var points = (function(segments) {
        var a = [];
        segments.forEach(function(seg) {
            a.push(seg.a, seg.b);
        });
        return a;
    })(segments);

    var uniquePoints = (function(points) {
        var set = {};
        return points.filter(function(p) {
            var key = p.x + "," + p.y;
            if (key in set) {
                return false;
            } else {
                set[key] = true;
                return true;
            }
        });
    })(points);


    var minFOV = radNormalize(heading - (FOV / 2));
    var maxFOV = radNormalize(heading + (FOV / 2));

    var uniqueAngles = [];
    uniqueAngles.push(minFOV, maxFOV);

    var precision = 0.000001;
    for (var k = 0; k < uniquePoints.length; k++) {
        var uniquePoint = uniquePoints[k];
        var angle = Math.atan2(uniquePoint.y - Center.y, uniquePoint.x - Center
            .x);

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

        for (var l = 0; l < segments.length; l++) {
            var intersection = getIntersection(ray, segments[l]);
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

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.moveTo(Center.x, Center.y);
    // ctx.moveTo(intersects[0].x, intersects[0].y);
    for (var g = 0; g < intersects.length; g++) {
        var intersect = intersects[g];
        ctx.lineTo(intersect.x, intersect.y);
    }
    ctx.fill();

    // ctx.fillStyle = "#dd3838";
    // for(var n=0; n < intersects.length; n++){
    // 	var intersect = intersects[n];
    // 	ctx.strokeStyle = (intersect.angle == minFOV || intersect.angle == maxFOV) ? "rgba(0,255,255,0.2)" : "rgba(255,0,0,0.2)";
    // 	ctx.beginPath();
    // 	ctx.moveTo(Center.x, Center.y);
    // 	ctx.lineTo(intersect.x, intersect.y);
    // 	ctx.stroke();
    //
    // 	// ctx.beginPath();
    // 	// ctx.arc(intersect.x, intersect.y, 4, 0, 2*Math.PI, false);
    // 	// ctx.fill();
    // }
}

var updateCanvas = true;

function drawLoop() {
    window.requestAnimationFrame(drawLoop);

    if (Key.isDown(Key.W)) Center.y -= 1;
    if (Key.isDown(Key.S)) Center.y += 1;
    if (Key.isDown(Key.D)) Center.x += 1;
    if (Key.isDown(Key.A)) Center.x -= 1;

    draw();
}

window.onload = function() {
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
