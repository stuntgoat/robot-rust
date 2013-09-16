// holds objects and functions common to different shapes

var LOGGING = false;

var w = new WebSocket("ws://127.0.0.1:9000/ws");

var paper = Raphael(0, 0, "100%", "100%");

var SILENCED = {};
var SILENCED_CIRCLES = {};

paper.canvas.onmousemove = function (event) {
    var i = SQUARES.length;
    while (i--) {
	if (SQUARES[i].isPointInside(event.pageX, event.pageY)) {
	    getRelCoords(SQUARES[i], event.pageX, event.pageY);
	    SILENCED[i] = false;
	} else {
	    // check the existence of the silenced node
	    if (SILENCED[i]) {
		continue;
	    } else {
		// JANK!!
		// due to some race condition we have to call silence twice
		silenceInstrument("/" + SQUARES[i].node.id);
		silenceInstrument("/" + SQUARES[i].node.id);
		SILENCED[i] = true;
	    }
	};
    };
    var _x = event.offsetX;
    var _y = event.offsetY;

    var j = CIRCLES.length;
    while (j--) {
        var radius = CIRCLES[i].attrs.r;
        var cx = CIRCLES[j].attrs.cx;
        var cy = CIRCLES[j].attrs.cy;
        var dist = distBetween(_x, _y, x, y);
        if ( dist <= radius) {
	    sendOCSCoords(CIRCLES[j]
        } else {
	    if (SILENCED_CIRCLES[j]) {
		continue;
	    } else {
		// JANK!!
		// due to some race condition we have to call silence twice
		silenceInstrument("/" + CIRCLES[j].node.id);
		silenceInstrument("/" + CIRCLES[j].node.id);
		SILENCED_CIRCLES[j] = true;
	    }
	}
    }
};

function sendOSCCoords(rElem, mx, my) {


            var pos = relPosition(_x, _y, x, y, radius);
            sendOCSCoords(pos, CIRCLES[i].node.id);

    var m = new OSCMessage();
    m.address = "/" + address;
    m.addFloat(coords.x * 2.1);
    m.addFloat(coords.y * 2.6); // should always be < 1
    w.send(m.getString());
    if (LOGGING) {
        console.log(m.address, coords);
    };
}


function getRelCoords(rElem, mx, my) {
    var oldTLx = rElem.attrs.x;
    var oldTLy = rElem.attrs.y;

    var inverse = rElem.matrix.invert();
    var rX = inverse.x(mx, my);
    var rY = inverse.y(mx, my);

    var dx = rX - oldTLx;
    var dy = rY - oldTLy;
    var x = relativePercentage(dx, rElem.attrs.width);
    var y = relativePercentage(dy, rElem.attrs.height);
    var address = "/" + rElem.node.id;
    
    sendMessage(address, x, y, DEFAULT_GAIN_ON, "on");

    if (LOGGING) {
        console.log(address, 'sent x: ', x );
        console.log(address, 'sent y: ', y );
    };
}

function sendMessage(address, x, y, gain, msg) {
    var m = new OSCMessage();
    if (LOGGING) {
	console.log('address', address);
    };
    m.address = address;
    m.addFloat(x);
    m.addFloat(y);
    m.addFloat(gain);
    m.addString(msg);
    w.send(m.getString());
};


function silenceInstrument(address) {
    var m = new OSCMessage();
    m.address = address;
    m.addFloat(0);
    m.addFloat(0);
    m.addFloat(0);
    m.addString("silence");
    w.send(m.getString());	
};

var chuckMakeInst = function(instrument, id, min, max) {
    var m = new OSCMessage();
    m.address = "/control";
    m.addFloat(min); 
    m.addFloat(max); 
    m.addString(instrument);
    m.addString("/" + id);
    w.send(m.getString());
};

function addRect(width, height, min, max, instrumentName) {
    var s = createSquare(width, height);
    chuckMakeInst(instrumentName, s.node.id, min, max);
    SQUARES.push(s);    
};

function addCircle(radius, min, max, instrumentName) {
    var c = createCircle(radius);
    chuckMakeInst(instrumentName, c.node.id, min, max);
    CIRCLES.push(c);    
};

// create an arbitrary number of circles for this demo
var START = function () {
    if (w.readyState == 1) {
        for (var i=0; i < 2; i++) {
	    addRect(200, 200, 1, 500, 'SinOsc');
        }
        for (var j=0; i < 2; i++) {
	    
        }
    }
};

function relativePercentage(value, total) {
    return Math.abs(value / total);
};

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
