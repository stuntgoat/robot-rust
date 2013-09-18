var CIRCLES = [];

var _circle_id = 0;
var _offsetx = 100;
var _offsety = 200;
function createCircle(radius, angle) {
    var rElem = paper.circle(c1, c2, radius).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
    rElem.attr("fill", "#504");


    rElem.node.id = "circle" + _circle_id;
    _circle_id += 1;

    var ft = paper.freeTransform(rElem);
    console.log('attrs', ft.attrs);

    // sorry, no scaling dynamically; it works but it's annoying.
    ft.setOpts({'scale': false});
    ft.apply();

    var cx = rElem.attrs.cx;
    var cy = rElem.attrs.cy;

    rElem.data({'_x': cx - radius});
    rElem.data({'_y': cy - radius});

    // offset so multiple shapes aren't stacked together
    _offsetx += 40;
    _offsetx += 40;

    return rElem;
};
