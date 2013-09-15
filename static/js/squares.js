var w = new WebSocket("ws://127.0.0.1:9000/ws");

var LOGGING = false;




var paper = Raphael(0, 0, "100%", "100%");
paper.canvas.onmousemove = function (event) {
    console.log('mx my', event.pageX, event.pageY);
};

var INSTRUMENTS = [];

// creates a square; adds Raphael specific attributes to the raphael element
var SQUARE_ID = 10;
var c1 = 100;
var c2 = 100;


function createSquare(width, height, angle) {
    var rElem = paper.rect(c1, c2, width, height).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;

    // callback for mouse move
    function getRelCoords(event) {
        mx = event.pageX;
        my = event.pageY;
        console.log('mx', mx);
        console.log('my', my);
        console.log('angle', rElem.data('angle'));

        oldTLx = rElem.attrs.x;
        oldTLy = rElem.attrs.y;

        newTLx = rElem.matrix.x(oldTLx, oldTLy);
        newTLy = rElem.matrix.y(oldTLx, oldTLy);

        console.log('newTLx', newTLx);
        console.log('newTLy', newTLy);

        oldBRx = oldTLx;
        oldBRy = oldTLy + height;

        newBRx = rElem.matrix.x(oldBRx, oldBRy);
        newBRy = rElem.matrix.y(oldBRx, oldBRy);

        console.log('newBRx', newBRx);
        console.log('newBRy', newBRy);

        // mx = mx - oldTLx;
        // my = my - oldTLy;
        // var r = Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2));
        // var ang = Math.atan2(my, mx);
        // ang = ang - angle * (Math.PI / 180);

        // dx = r * Math.cos(ang);
        // dy = r * Math.sin(ang);

        inverse = rElem.matrix.invert();
        rX = inverse.x(mx, my);
        rY = inverse.y(mx, my);

        dx = rX - oldTLx;
        dy = rY - oldTLy;

        console.log('dx', dx);
        console.log('dy', dy);

        console.log('');
    };

    if (angle == undefined) {
        angle = 0;
    };

    rElem.attr("fill", "#504");

    rElem.node.id = "" + SQUARE_ID;
    SQUARE_ID += 1;

    rElem.data('angle', angle);
    rElem.transform('r' + angle);

    var start = function () {
        this.ox = this.attr("x");
        this.oy = this.attr("y");
    };

    var move = function (dx, dy) {
        var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var ang = Math.atan2(dy, dx);
        ang = ang - angle * (Math.PI / 180);

        dx = r * Math.cos(ang);
        dy = r * Math.sin(ang);
        this.attr({ x: this.ox + dx, y: this.oy + dy});
    };

    var up = function () {
    };


    paper.set(rElem).drag(move, start, up);

    c1 += 40;
    c2 += 40;

    // rElem.mousemove(function (event){console.log(event.target);});
    rElem.mousemove(getRelCoords);
    rElem.click(whereIsXY);

    return rElem;
};

function whereIsXY(event) {
    console.log('event', event.target);
};

var is = [];
// create an arbitrary number of circles for this demo
var START = function () {
    if (w.readyState == 1) {
        for (var i=0; i < 8; i++) {
            createSquare(100);
        }
    }
};

// send a message to Chuck to create an instrument with this id
