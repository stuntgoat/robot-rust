// holds all the squares
var SQUARES = [];

// base initial location coordinates, and id for elements
var SQUARE_ID = 10;
var c1 = 100;
var c2 = 100;

function createSquare(width, height, angle) {
    var rElem = paper.rect(c1, c2, width, height).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;
    var address = '';

    // callback for mouse move
    // color
    rElem.attr("fill", "#504");

    // set id and increment base value
    rElem.node.id = "" + SQUARE_ID;
    address = "/" + SQUARE_ID;
    SQUARE_ID += 1;

    // set initial rotation
    if (angle == undefined) {
        angle = 0;
    };

    var ft = paper.freeTransform(rElem);
    ft.attrs.rotate = angle;

    // sorry, no scaling dynamically; it works but it's annoying.
    ft.setOpts({'scale': false});
    ft.apply();

    // offset so multiple shapes aren't stacked together
    c1 += 40;
    c2 += 40;
    
    return rElem;
};


// audio prefs: IN: line in OUT: headphones
// soundflower: soundflower 2ch : builtin output - selecte use this device for sound input


