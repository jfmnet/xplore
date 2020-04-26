var structuregraphics = function () {
};

structuregraphics.constructor = structuregraphics;

structuregraphics.Frame = function (x1, y1, x2, y2) {
    xplore.Canvas2dGraphics.Line.call(this, x1, y1, x2, y2);
};

structuregraphics.Frame.prototype = Object.create(xplore.Canvas2dGraphics.Line.prototype);
structuregraphics.Frame.constructor = structuregraphics.Frame;

structuregraphics.Frame.prototype.Render = function (canvas) {
    let property = this.Property();
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, property);

    let width = canvas.ToPointWidth(5);
    canvas.DrawRectangle(this.x1, this.y1, width, width, property);
    canvas.DrawRectangle(this.x2, this.y2, width, width, property);
};