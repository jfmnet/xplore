xplore.canvassections = function () {
    this.properties = new xplore.DrawProperties();
    this.selectedproperties = new xplore.DrawProperties();
};

xplore.canvassections.constructor = xplore.canvassections;
let canvassections = xplore.canvassections.prototype;


xplore.canvassections.Rectangle = function (x, y, w, h) {
    xplore.canvassections.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.fields = [
        { name: "x", text: "X", unit: UNITS.length }
    ];
};

xplore.canvassections.Rectangle.prototype = Object.create(canvassections);
xplore.canvassections.Rectangle.constructor = xplore.canvassections.Rectangle;

let rectangle = xplore.canvassections.Rectangle.prototype;

rectangle.Render = function (canvas) {
    canvas.DrawRectangle(this.x, this.y, this.w, this.h, this.Property());
};