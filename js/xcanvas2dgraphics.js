xplore.DrawProperties = function () {
    this.showfill = true;
    this.showline = true;
    this.scale = true;

    this.fillcolor = "rgba(0, 75, 150, 0.3)";
    this.linecolor = "rgba(0, 100, 200, 0.5)";
    this.thickness = 1;
};

xplore.TextProperties = function () {
    this.font = "Arial";
    this.size = 12;
    this.color = "#CCC";
    this.scale = true;
};


//CanvasGraphics

xplore.Canvas2DGraphics = function () {
    this.properties = new xplore.DrawProperties();
    this.selectedproperties = new xplore.DrawProperties();

    this.points = [];
    this.selected = false;
};

xplore.Canvas2DGraphics.constructor = xplore.Canvas2DGraphics;

let canvasgraphics = xplore.Canvas2DGraphics.prototype;

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
        return this.selectedproperties;
    else
        return this.properties;
};



//Arrow

xplore.Canvas2DGraphics.Arrow = function (x1, y1, x2, y2, headratio) {
    xplore.Canvas2DGraphics.call(this);

    //Tail
    this.x1 = x1;
    this.y1 = y1;

    //Head
    this.x2 = x2;
    this.y2 = y2;

    this.headratio = headratio || 0.1;

    //Arrow direction
    //To the east
    // ------->>
    let line = new xplore.canvasentity.Line2F(x1, y1, x2, y2);
    let length = line.length * this.headratio;
    let angle = line.anglerad;

    this.points = [
        { x: x2, y: y2 },
        { x: x2 - length, y: y2 + length / 3 },
        { x: x2 - length, y: y2 - length / 3 },
    ];

    this.Rotate(angle, x2, y2);
};

xplore.Canvas2DGraphics.Arrow.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Arrow.constructor = xplore.Canvas2DGraphics.Arrow;

let arrow = xplore.Canvas2DGraphics.Arrow.prototype;

arrow.Render = function (canvas) {
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, this.Property());
    canvas.DrawPolygon_2(this.points, this.Property());
};


//Line

xplore.Canvas2DGraphics.Line = function (x1, y1, x2, y2) {
    xplore.Canvas2DGraphics.call(this);

    if (x1 !== undefined && x1.x !== undefined)
        this.points = [{ x: x1.x || 0, y: x1.y || 0 }, { x: x1.x || 0, y: x1.y || 0 }];
    else
        this.points = [{ x: x1 || 0, y: y1 || 0 }, { x: x2 || 0, y: y2 || 0 }];

    this.minpoint = 2;
    this.maxpoint = 2;
};

xplore.Canvas2DGraphics.Line.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Line.constructor = xplore.Canvas2DGraphics.Line;

let xline = xplore.Canvas2DGraphics.Line.prototype;

Object.defineProperty(xline, 'x1', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(xline, 'x2', {
    get: function () { return this.points[1].x },
    set: function (value) { this.points[1].x = value }
});

Object.defineProperty(xline, 'y1', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

Object.defineProperty(xline, 'y2', {
    get: function () { return this.points[1].y },
    set: function (value) { this.points[1].y = value }
});

xline.Render = function (canvas) {
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, this.Property());
};

xline.Update = function (point) {
    this.points[1] = { x: point.x, y: point.y };
};

xline.Add = function (point) {
    this.points[0] = { x: point.x, y: point.y };
};



//Rectangle

xplore.Canvas2DGraphics.Rectangle = function (x, y, w, h) {
    xplore.Canvas2DGraphics.call(this);

    if (x1 !== undefined && x1.x !== undefined)
        this.points = [{ x: x1.x || 0, y: x1.y || 0 }, { x: x1.w || 0, y: x1.h || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }, { x: w || 0, y: h || 0 }];
};

xplore.Canvas2DGraphics.Rectangle.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Rectangle.constructor = xplore.Canvas2DGraphics.Rectangle;

let rectangle = xplore.Canvas2DGraphics.Rectangle.prototype;

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

xplore.Canvas2DGraphics.Polygon = function (points) {
    xplore.Canvas2DGraphics.call(this);

    this.points = points || [];

    this.minpoint = 3;
    this.maxpoint = 10000;
};

xplore.Canvas2DGraphics.Polygon.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Polygon.constructor = xplore.Canvas2DGraphics.Polygon;

let xpolygon = xplore.Canvas2DGraphics.Polygon.prototype;

xpolygon.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xpolygon.Bounds = function (bounds) {
    for (let point of this.points)
        bounds.Update(point.x, point.y);
};

xpolygon.Add = function (point) {
    this.points.push(point);
};

xpolygon.EndDrawing = function () {
    this.points.pop();
};

xpolygon.Update = function (point) {
    this.points.pop();
    this.points.push(point);
};