// the circles channel
var w = new WebSocket("ws://127.0.0.1:9000/circles");


// send the relative coordinates from the bounding box
var relMouseCoords = function(event){
    console.log('target', event.target);
    var X = event.target.cx.baseVal.value;
    var Y = event.target.cy.baseVal.value;
    var R = event.target.r.baseVal.value;
    if (event.offsetX !== undefined && event.offsetY !== undefined) {
        return {x:event.offsetX - X + R, y:event.offsetY - Y + R};
    }
    return {};
};


// send the OSC message. This is for the demo which expects an integer and a float for
// controlling an oscillator and a reverb filter
function sendOCSCoords(coords, address) {
    var m = new OSCMessage();
    m.address = "/" + address;
    m.addInt(coords.x);
    m.addInt(coords.y); // should always be < 1
    w.send(m.getString());
    console.log('coords from sendOCSCoords', coords);
}

// distance between 2 points in 2D.
var distBetween = function(x1, y1, x2, y2) {
    var dx = Math.abs(x1 - x2);
    var dy = Math.abs(y1 - y2);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
};


// ARGUMENTS: mouse x, mouse y, element x, element y, radius
// send the x, y coordinates relative to the top left corner of
// the objects bounding box.
var relPosition = function(mX, mY, ex, ey, r) {
    var topLeft = {x: ex - r, y: ey - r};
    return {x: mX - topLeft.x, y: mY - topLeft.y};
};

// detect the mouse collision in each instrument in INSTRUMENTS
var cDetect = function(event) {
    var _x = event.offsetX;
    var _y = event.offsetY;

    // iterate over each shape
    for (i in INSTRUMENTS) {
        var radius = INSTRUMENTS[i].attrs.r;

        var x = INSTRUMENTS[i].attrs.cx;
        var y = INSTRUMENTS[i].attrs.cy;
        var id = INSTRUMENTS[i].node.id;
        var center = {'x': x, 'y': y};
        var dist = distBetween(_x, _y, x, y);

        if ( dist <= radius) {
            var pos = relPosition(_x, _y, center.x, center.y, radius);
            sendOCSCoords(pos, id);
        };
    };
};


var paper = Raphael(0, 0, "100%", "100%");
paper.canvas.onmousemove = cDetect;

var INSTRUMENTS = [];

// creates a circle and
function createCircle(radius) {
    var c1 = 100;
    var c2 = 100;
    var a = paper.circle(c1, c2, radius).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});

    c1 += 40;
    c2 += 40;
    return a;
};

var NODES = ['biggie', 'smalls', 'beyonce'];

// adds Raphael specific attributes to the raphael element
var ID = 0;
function addSendCoordListener(rElem) {
    rElem.attr("fill", "#f04");
    rElem.node.id = NODES[ID];
    ID += 1;
    var RADIUS = 50;
    rElem.radius = RADIUS;
    var start = function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        this.animate({r: RADIUS, opacity: .25}, 500, ">");
    };

    var move = function (dx, dy) {
        this.attr({cx: this.ox + dx, cy: this.oy + dy});
    };

    var up = function () {
        this.animate({r: RADIUS, opacity: .5}, 500, ">");
        this.center = {x: this.data("cx"), y: this.data("cy")};
    };

    paper.set(rElem).drag(move, start, up);
    return rElem;
};


// create an arbitrary number of circles for this demo
var START = function () {
    for (var i=0; i < 3; i++) {
        var e = addSendCoordListener(createCircle(50));
        INSTRUMENTS.push(e);
    }
};