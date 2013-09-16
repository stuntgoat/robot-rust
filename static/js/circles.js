var CIRCLES = [];

var _circle_id = 0;
var _offsetx = 100;
var _offsety = 200;
function createCircle(radius) {

    var rElem = paper.circle(c1, c2, radius).attr({fill: "hsb(0, 1, 1)", stroke: "none", opacity: .5});
    rElem.attr("fill", "#504");


    rElem.node.id = "circle" + _circle_id;
    _circle_id += 1;

    var start = function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
        this.animate({opacity: .25}, 500, ">");
    };

    var move = function (dx, dy) {
        this.attr({cx: this.ox + dx, cy: this.oy + dy});
    };

    var up = function () {
        this.animate({r: RADIUS, opacity: .5}, 500, ">");
        this.center = {x: this.data("cx"), y: this.data("cy")};
    };

    paper.set(rElem).drag(move, start, up);

    _offsetx += 40;
    _offsetx += 40;
    return rElem;
};
