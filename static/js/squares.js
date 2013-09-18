// holds all the squares
var SQUARES = [];

// base initial location coordinates, and id for elements
var _square_id = 10;
var c1 = 200;
var c2 = 200;

function createSquare(width, height, angle) {
    var rElem = paper.rect(c1, c2, width, height).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});;
    var address = "/" + _square_id;
    rElem.node.id = "" + _square_id;
    _square_id += 1;

    // color
    rElem.attr("fill", "#504");

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
