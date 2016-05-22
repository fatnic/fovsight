var RAD = 2*Math.PI;
var heading;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function rotate( array , times ){
  while( times-- ){
    var temp = array.shift();
    array.push( temp );
  }
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

function deg2rad(deg){ return deg * (Math.PI/180); }

function rad2deg(rad){ return rad * (180/Math.PI); }

function radNormalize(rad){
	var result = isNaN(rad) ? 0 : rad;
	result %= RAD;
	if(result<0) { result += RAD; }
	return result;
}

function degNormalize(deg){
	var result = isNaN(deg) ? 0 : deg;
	result %= 360;
	if(result<0) { result += 360; }
	return result;
}

function radBetween(rad, start, end){
	rad = (RAD + (rad % RAD)) % RAD;
	start = (RAD + start) % RAD;
	end = (RAD + end) % RAD;
	if(start < end) return start <= rad && rad <= end;
	return start <= rad || rad <= end;
}

function getIntersection(ray,segment){

	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x-ray.a.x;
	var r_dy = ray.b.y-ray.a.y;

	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x-segment.a.x;
	var s_dy = segment.b.y-segment.a.y;

	var r_mag = Math.sqrt(r_dx*r_dx+r_dy*r_dy);
	var s_mag = Math.sqrt(s_dx*s_dx+s_dy*s_dy);
	if(r_dx/r_mag==s_dx/s_mag && r_dy/r_mag==s_dy/s_mag){
		return null;
	}

	var T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px+s_dx*T2-r_px)/r_dx;

	if(T1<0) return null;
	if(T2<0 || T2>1) return null;

	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1
	};
}

function draw() {
	ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#999";

    for (var i=0; i < segments.length; i++) {
        var seg = segments[i];
        ctx.beginPath();
        ctx.moveTo(seg.a.x, seg.a.y);
        ctx.lineTo(seg.b.x, seg.b.y);
        ctx.stroke();
    }

	var points = (function(segments){
		var a = [];
		segments.forEach(function(seg){ a.push(seg.a, seg.b); });
		return a;
	})(segments);

	var uniquePoints = (function(points){
		var set = {};
		return points.filter(function(p){
			var key = p.x + "," + p.y;
			if(key in set) {
				return false;
			} else {
				set[key] = true;
				return true;
			}
		});
	})(points);


	var minFOV = radNormalize(heading - (FOV/2));
	var maxFOV = radNormalize(heading + (FOV/2));

	var uniqueAngles = [];
	uniqueAngles.push(minFOV, maxFOV);

	var precision = 0.000001;
	for(var k=0; k < uniquePoints.length; k++){
		var uniquePoint = uniquePoints[k];
		var angle = Math.atan2(uniquePoint.y - Center.y, uniquePoint.x - Center.x);

		if (!radBetween(angle, minFOV, maxFOV)) continue;

		uniquePoint.angle = radNormalize(angle);
		uniqueAngles.push(radNormalize(angle - precision));
		uniqueAngles.push(radNormalize(angle));
		uniqueAngles.push(radNormalize(angle + precision));
	}

	var intersects = [];

	for(var j=0; j < uniqueAngles.length; j++){
		var angler = uniqueAngles[j];

		var dx = Math.cos(angler);
		var dy = Math.sin(angler);

		var ray = {
			a:{x: Center.x, y: Center.y},
			b:{x: Center.x + dx, y: Center.y + dy}
		};

		var closestIntersect = null;

		for (var l=0; l < segments.length; l++){
			var intersection = getIntersection(ray, segments[l]);
			if (!intersection) continue;
			if (!closestIntersect || intersection.param < closestIntersect.param) {
				closestIntersect = intersection;
			}
		}

		if(!closestIntersect) continue;
		closestIntersect.angle = angler;

		intersects.push(closestIntersect);
	}

	intersects = intersects.sort(function(a,b){ return a.angle - b.angle; });
	rotate(intersects, findWithAttr(intersects, "angle", minFOV));

	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	ctx.beginPath();
	ctx.moveTo(Center.x, Center.y);
	// ctx.moveTo(intersects[0].x, intersects[0].y);
	for(var g=0; g < intersects.length; g++){
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

var segments = [
    // Border
	{a:{x:0,y:0}, b:{x:640,y:0}},
	{a:{x:640,y:0}, b:{x:640,y:360}},
	{a:{x:640,y:360}, b:{x:0,y:360}},
	{a:{x:0,y:360}, b:{x:0,y:0}},
	// Polygon #1
	{a:{x:100,y:150}, b:{x:120,y:50}},
	{a:{x:120,y:50}, b:{x:200,y:80}},
	{a:{x:200,y:80}, b:{x:140,y:210}},
	{a:{x:140,y:210}, b:{x:100,y:150}},
	// Polygon #2
	{a:{x:100,y:200}, b:{x:120,y:250}},
	{a:{x:120,y:250}, b:{x:60,y:300}},
	{a:{x:60,y:300}, b:{x:100,y:200}},
	// Polygon #3
	{a:{x:200,y:260}, b:{x:220,y:150}},
	{a:{x:220,y:150}, b:{x:300,y:200}},
	{a:{x:300,y:200}, b:{x:350,y:320}},
	{a:{x:350,y:320}, b:{x:200,y:260}},
	// Polygon #4
	{a:{x:340,y:60}, b:{x:360,y:40}},
	{a:{x:360,y:40}, b:{x:370,y:70}},
	{a:{x:370,y:70}, b:{x:340,y:60}},
	// Polygon #5
	{a:{x:450,y:190}, b:{x:560,y:170}},
	{a:{x:560,y:170}, b:{x:540,y:270}},
	{a:{x:540,y:270}, b:{x:430,y:290}},
	{a:{x:430,y:290}, b:{x:450,y:190}},
	// Polygon #6
	{a:{x:400,y:95}, b:{x:580,y:50}},
	{a:{x:580,y:50}, b:{x:480,y:150}},
	{a:{x:480,y:150}, b:{x:400,y:95}}

];

var updateCanvas = true;
function drawLoop(){
    window.requestAnimationFrame(drawLoop);
    if (updateCanvas){
        draw();
        updateCanvas = false;
    }
}

var FOV = deg2rad(60);

window.onload = function() { drawLoop(); };

var Center = { x: canvas.width/2, y: canvas.height/2 };

canvas.onmousemove = function(event){
	heading = Math.atan2(event.clientY - Center.y, event.clientX - Center.x);
	updateCanvas = true;
};

canvas.onclick = function(event){
    Center.x = event.clientX;
    Center.y = event.clientY;
    updateCanvas = true;
};
