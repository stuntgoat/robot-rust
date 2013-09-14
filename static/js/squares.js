var LOGGING = false;

// ARGUMENTS: mouse x, mouse y, element x, element y, radius
// send the x, y coordinates relative to the top left corner of
// the objects bounding box.
var relPosition = function(mX, mY, ex, ey, r) {
    var topLeft = {x: ex - r, y: ey - r};
    return {x: mX - topLeft.x, y: mY - topLeft.y};
};

// detect the mouse collision in each instrument in INSTRUMENTS
var squareDetect = function(event) {
    var _x = event.offsetX;
    var _y = event.offsetY;
    var instrument = undefined;
    // iterate over each shape
    for (i in INSTRUMENTS) {
        instrument = INSTRUMENTS[i];
        // detect which type of shape this is
        if (instruments.type == 'rect') {


        };
    }
};


function sendCoordsOSC(event) {

};

var paper = Raphael(0, 0, "100%", "100%");
paper.canvas.onmousemove = cDetect;

var INSTRUMENTS = [];

// creates a square; adds Raphael specific attributes to the raphael element
var SQUARE_ID = 10;
function createSquare(radius) {
    var c1 = 100;
    var c2 = 100;
    var rElem = paper.rect(10, 10, 50, 50).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;
    rElem.attr("fill", "#504");

    rElem.node.id = "" + SQUARE_ID;
    SQUARE_ID += 1;

    var start = function () {
        this.x = this.attr("x");
        this.y = this.attr("y");
        this.animate({opacity: .25}, 500, ">");
    };

    var move = function (dx, dy) {
        this.attr({x: this.x + dx, y: this.y + dy});
    };

    var up = function () {
        this.animate({opacity: .5}, 500, ">");
        this.center = {x: this.data("x"), y: this.data("y")};
    };

    paper.set(rElem).drag(move, start, up);

    c1 += 40;
    c2 += 40;

    rElem.mousemove(function (event){console.log(event.target);});
    return rElem;
};



var is = [];
// create an arbitrary number of circles for this demo
var START = function () {
    if (w.readyState == 1) {
        for (var i=0; i < 8; i++) {
            var e = createSquare(100);
            INSTRUMENTS.push(e);
            if (w.readyState == 1){
                chuckMakeInst("SinOsc", e.node.id);
            };
        }
    }
};

// send a message to Chuck to create an instrument with this id
