var CIRCLES = [];

var _circle_id = 0;
var _offsetx = 100;
var _offsety = 200;
function createCircle(radius, angle) {
    var rElem = paper.circle(c1, c2, radius).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
    rElem.attr("fill", "#504");


    rElem.node.id = "circle" + _circle_id;
    _circle_id += 1;


    // var start = function () {
    //     this.ox = this.attrs("cx");
    //     this.oy = this.attrs("cy");

    //     this.animate({opacity: .25}, 500, ">");
    // };

    // var move = function (dx, dy) {
    //     this.attr({cx: this.ox + dx, cy: this.oy + dy});
    // };

    // var up = function () {
    //     this.animate({opacity: .5}, 500, ">");
    //     this.center = {x: this.data("cx"), y: this.data("cy")};
    // };

    // // set initial rotation
    // if (angle == undefined) {
    //     angle = 0;
    // };
//     paper.set(rElem).drag(move, start, up);;

    var ft = paper.freeTransform(rElem);
    console.log('attrs', ft.attrs);
    // ft.attrs.rotate = angle;

    // sorry, no scaling dynamically; it works but it's annoying.
    ft.setOpts({'scale': false});
    ft.apply();
    cx = rElem.attrs.cx;
    cy = rElem.attrs.cy;
    rElem.data({'_x': cx - radius});
    rElem.data({'_y': cy - radius});



// 
    _offsetx += 40;
    _offsetx += 40;
    return rElem;
};
