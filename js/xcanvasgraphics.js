xplore.DrawProperties = function () {
    this.showfill = true;
    this.showline = true;
    this.scale = true;

    this.fillcolor = "#CCC";
    this.linecolor = "#FFF";
    this.thickness = 1;
};

xplore.TextProperties = function () {
    this.font = "Arial";
    this.size = 12;
    this.color = "#CCC";
    this.scale = true;
};


//CanvasGraphics

xplore.canvasgraphics = function () {
    this.properties = new xplore.DrawProperties();
    this.selectedproperties = new xplore.DrawProperties();

    this.points = [];
    this.selected = false;
};

xplore.canvasgraphics.constructor = xplore.canvasgraphics;

let canvasgraphics = xplore.canvasgraphics.prototype;

canvasgraphics.Clone = function () {
    let object = Object.create(this);

    for (let name in this) {
        if (Array.isArray(this[name]))
            object[name] = JSON.parse(JSON.stringify(this[name]));
        else
            object[name] = this[name];
    }

    return object;
};

canvasgraphics.Move = function (x, y) {
    for (let i = 0; i < this.points.length; i++) {
        this.points[i].x += x;
        this.points[i].y += y;
    }
};

canvasgraphics.Scale = function (x, y) {
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
canvasgraphics.Rotate = function (angle, cx, cy) {
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

canvasgraphics.Property = function (x, y) {
    if (this.selected)
        return this.properties;
    else
        return this.selectedproperties;
};


//Line

xplore.canvasgraphics.Line = function (x1, y1, x2, y2) {
    xplore.canvasgraphics.call(this);

    if (x1 !== undefined && x1.x !== undefined)
        this.points = [{ x: x1.x || 0, y: x1.y || 0 }, { x: x1.x || 0, y: x1.y || 0 }];
    else
        this.points = [{ x: x1 || 0, y: y1 || 0 }, { x: x2 || 0, y: y2 || 0 }];
};

xplore.canvasgraphics.Line.prototype = Object.create(canvasgraphics);
xplore.canvasgraphics.Line.constructor = xplore.canvasgraphics.Line;

let line = xplore.canvasgraphics.Line.prototype;

Object.defineProperty(line, 'x1', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(line, 'x2', {
    get: function () { return this.points[1].x },
    set: function (value) { this.points[1].x = value }
});

Object.defineProperty(line, 'y1', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

Object.defineProperty(line, 'y2', {
    get: function () { return this.points[1].y },
    set: function (value) { this.points[1].y = value }
});

line.Render = function (canvas) {
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, this.Property());
};

line.Update = function (mouse) {
    this.points[1] = { x: mouse.x, y: mouse.y };
};



//Rectangle

xplore.canvasgraphics.Rectangle = function (x, y, w, h) {
    xplore.canvasgraphics.call(this);

    if (x1 !== undefined && x1.x !== undefined)
        this.points = [{ x: x1.x || 0, y: x1.y || 0 }, { x: x1.w || 0, y: x1.h || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }, { x: w || 0, y: h || 0 }];
};

xplore.canvasgraphics.Rectangle.prototype = Object.create(canvasgraphics);
xplore.canvasgraphics.Rectangle.constructor = xplore.canvasgraphics.Rectangle;

let rectangle = xplore.canvasgraphics.Rectangle.prototype;

Object.defineProperty(rectangle, 'x', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(rectangle, 'y', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

Object.defineProperty(rectangle, 'w', {
    get: function () { return this.points[1].x },
    set: function (value) { this.points[1].x = value }
});

Object.defineProperty(rectangle, 'h', {
    get: function () { return this.points[1].y },
    set: function (value) { this.points[1].y = value }
});

rectangle.Render = function (canvas) {
    canvas.DrawRectangle(this.x, this.y, this.w, this.h, this.Property());
};

rectangle.Update = function (mouse) {
    this.points[1] = { x: Math.abs(this.points[0].x - mouse.x) * 2, y: Math.abs(this.points[0].y - mouse.y) * 2 };
};


//Polygon

xplore.canvasgraphics.Polygon = function (points) {
    xplore.canvasgraphics.call(this);

    this.points = points;
};

xplore.canvasgraphics.Polygon.prototype = Object.create(canvasgraphics);
xplore.canvasgraphics.Polygon.constructor = xplore.canvasgraphics.Polygon;

let polygon = xplore.canvasgraphics.Polygon.prototype;

polygon.Render = function (canvas) {
    canvas.DrawPolygon(this.x, this.y, this.w, this.h, this.Property());
};