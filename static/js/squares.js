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


function createSquare(length, angle) {
    var rElem = paper.rect(c1, c2, length, length).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;

    // callback for mouse move
    function getRelCoords(event) {
        mx = event.pageX;
        my = event.pageY;
        console.log('mx', mx);
        console.log('my', my);
        console.log('angle', rElem.data('angle'));

        ex = rElem.matrix.x(rElem.attrs.x, rElem.attrs.y);
        ey = rElem.matrix.y(rElem.attrs.x, rElem.attrs.y);

        console.log('ex', ex);
        console.log('ey', ey);
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
        this.x = this.attr("x");
        this.y = this.attr("y");
        this.animate({opacity: .25}, 500, ">");
    };

    var move = function (dx, dy) {
        console.log('moving');
        this.attr({x: this.x + dx, y: this.y + dy});
    };

    var up = function () {
    };

    // var start = function () {
    //     this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
    //     this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
    // };

    // var move = function (dx, dy) {
    //     var r = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    //     var ang = Math.atan2(dy,dx);
    //     ang = ang - this.angle * (Math.PI / 180);

    //     dx = r * Math.cos(ang);
    //     dy = r * Math.sin(ang);

    //     var att = this.type == "rect" ? { x: this.ox + dx, y: this.oy + dy} : { cx: this.ox + dx, cy: this.oy + dy };
    //     this.attr(att);
    // };

    // var up = function () {
    // };


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
