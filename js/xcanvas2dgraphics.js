xplore.DrawProperties = function () {
    this.showfill = true;
    this.showline = true;
    this.scale = true;

    this.fillcolor = "#CCC";
    this.linecolor = "#000";
    this.thickness = 1;
};

xplore.TextProperties = function () {
    this.font = "Arial";
    this.size = 12;
    this.color = "#CCC";
    this.scale = true;
};


//CanvasGraphics

xplore.Canvas2dGraphics = function () {
    this.properties = new xplore.DrawProperties();
    this.selectedproperties = new xplore.DrawProperties();

    this.points = [];
    this.selected = false;
};

xplore.Canvas2dGraphics.constructor = xplore.Canvas2dGraphics;


xplore.Canvas2dGraphics.prototype.Clone = function () {
    let object = Object.create(this);

    for (let name in this) {
        object[name] = this[name];
    }

    return object;
};

xplore.Canvas2dGraphics.prototype.Move = function (x, y) {
    for (let i = 0; i < this.points.length; i++) {
        this.points[i].x += x;
        this.points[i].y += y;
    }
};

xplore.Canvas2dGraphics.prototype.Scale = function (x, y) {
    for (let i = 0; i < this.points.length; i++) {
        this.points[i].x *= x;
        this.points[i].y *= y;
    }
};

/**
 * @param  {float} angle - in radians
 * @param  {float} cx    - center of rotation along x
 * @param  {float} cy    - center of rotation along y
 */
xplore.Canvas2dGraphics.prototype.Rotate = function (angle, cx, cy) {
    if (cx === undefined)
        cx = 0;

    if (cy === undefined)
        cy = 0;

    for (let i = 0; i < this.points.length; i++) {
        x = this.points[i].x;
        y = this.points[i].y;

        this.points[i].x = cx + Math.cos(angle) * (x - cx) - Math.sin(angle) * (y - cy);
        this.points[i].y = cy + Math.sin(angle) * (x - cx) + Math.cos(angle) * (y - cy);
    }
};

xplore.Canvas2dGraphics.prototype.Property = function (x, y) {
    if (this.selected)
        return this.properties;
    else
        return this.selectedproperties;
};


//Line

xplore.Canvas2dGraphics.Line = function (x1, y1, x2, y2) {
    xplore.Canvas2dGraphics.call(this);

    this.points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];

    Object.defineProperty(xplore.Canvas2dGraphics.Line.prototype, 'x1', {
        get: function () { return this.points[0].x },
        set: function (value) { this.points[0].x = value }
    });

    Object.defineProperty(xplore.Canvas2dGraphics.Line.prototype, 'x2', {
        get: function () { return this.points[1].x },
        set: function (value) { this.points[2].x = value }
    });

    Object.defineProperty(xplore.Canvas2dGraphics.Line.prototype, 'y1', {
        get: function () { return this.points[0].y },
        set: function (value) { this.points[0].y = value }
    });

    Object.defineProperty(xplore.Canvas2dGraphics.Line.prototype, 'y2', {
        get: function () { return this.points[1].y },
        set: function (value) { this.points[2].y = value }
    });
};

xplore.Canvas2dGraphics.Line.prototype = Object.create(xplore.Canvas2dGraphics.prototype);
xplore.Canvas2dGraphics.Line.constructor = xplore.Canvas2dGraphics.Line;

xplore.Canvas2dGraphics.Line.prototype.Render = function (canvas) {
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, this.Property());
};
