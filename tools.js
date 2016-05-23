function rotate(array, times) {
    while (times--) {
        var temp = array.shift();
        array.push(temp);
    }
}

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function rad2deg(rad) {
    return rad * (180 / Math.PI);
}

function radNormalize(rad) {
    var result = isNaN(rad) ? 0 : rad;
    result %= RAD;
    if (result < 0) {
        result += RAD;
    }
    return result;
}

function degNormalize(deg) {
    var result = isNaN(deg) ? 0 : deg;
    result %= 360;
    if (result < 0) {
        result += 360;
    }
    return result;
}

function radBetween(rad, start, end) {
    rad = (RAD + (rad % RAD)) % RAD;
    start = (RAD + start) % RAD;
    end = (RAD + end) % RAD;
    if (start < end) return start <= rad && rad <= end;
    return start <= rad || rad <= end;
}

function getIntersection(ray, segment) {

    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x - ray.a.x;
    var r_dy = ray.b.y - ray.a.y;

    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x - segment.a.x;
    var s_dy = segment.b.y - segment.a.y;

    var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
    if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
        return null;
    }

    var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy -
        s_dy * r_dx);
    var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    return {
        x: r_px + r_dx * T1,
        y: r_py + r_dy * T1,
        param: T1
    };
}
