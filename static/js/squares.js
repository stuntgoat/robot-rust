var DEFAULT_GAIN_ON = .2;

var w = new WebSocket("ws://127.0.0.1:9000/ws");

var LOGGING = true;

var paper = Raphael(0, 0, "100%", "100%");
paper.canvas.onmousemove = function (event) {
    // console.log('mx my', event.pageX, event.pageY);
};

// holds all the squares
var SQUARES = [];

// base initial location coordinates, and id for elements
var SQUARE_ID = 10;
var c1 = 100;
var c2 = 100;

function relativePercentage(value, total) {
    return Math.abs(value / total);
};

function createSquare(width, height, angle) {
    var rElem = paper.rect(c1, c2, width, height).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;

    // callback for mouse move
    function getRelCoords(event) {
        mx = event.pageX;
        my = event.pageY;
        oldTLx = rElem.attrs.x;
        oldTLy = rElem.attrs.y;

        inverse = rElem.matrix.invert();
        rX = inverse.x(mx, my);
        rY = inverse.y(mx, my);

        dx = rX - oldTLx;
        dy = rY - oldTLy;

        var m = new OSCMessage();
        m.address = "/" + rElem.node.id;
        m.addFloat(dx);
        m.addFloat(dy);
        m.addFloat(DEFAULT_GAIN_ON);
        w.send(m.getString());
        if (LOGGING) {
            console.log(m.address, coords);
        };

        if (LOGGING) {
            console.log('dx', relativePercentage(dx, width));
            console.log('dy', relativePercentage(dy, height));
        };
    }

    // color
    rElem.attr("fill", "#504");

    // set id and increment base value
    rElem.node.id = "" + SQUARE_ID;
    SQUARE_ID += 1;

    // set initial rotation
    if (angle == undefined) {
        angle = 0;
    };
    rElem.data('angle', angle);
    rElem.mousemove(getRelCoords);

    var ft = paper.freeTransform(rElem);

    ft.attrs.rotate = angle;
    ft.setOpts({'scale': false});
    ft.apply();

    c1 += 40;
    c2 += 40;



    return ft;
};


// create an arbitrary number of circles for this demo
var START = function () {
    if (w.readyState == 1) {
        for (var i=0; i < 8; i++) {
            var s = createSquare(100);
            SQUARES.push(s);
        }
    }
};

var b = createSquare(100, 100, 45);