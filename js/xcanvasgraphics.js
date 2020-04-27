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

xplore.canvasgraphics.prototype.Clone = function () {
    let object = Object.create(this);

    for (let name in this) {
        if (Array.isArray(this[name]))
            object[name] = JSON.parse(JSON.stringify(this[name]));
        else
            object[name] = this[name];
    }

    return object;
};

xplore.canvasgraphics.prototype.Move = function (x, y) {
    for (let i = 0; i < this.points.length; i++) {
        this.points[i].x += x;
        this.points[i].y += y;
    }
};

xplore.canvasgraphics.prototype.Scale = function (x, y) {
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
xplore.canvasgraphics.prototype.Rotate = function (angle, cx, cy) {
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

xplore.canvasgraphics.prototype.Property = function (x, y) {
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

xplore.canvasgraphics.Line.prototype = Object.create(xplore.canvasgraphics.prototype);
xplore.canvasgraphics.Line.constructor = xplore.canvasgraphics.Line;

Object.defineProperty(xplore.canvasgraphics.Line.prototype, 'x1', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(xplore.canvasgraphics.Line.prototype, 'x2', {
    get: function () { return this.points[1].x },
    set: function (value) { this.points[1].x = value }
});

Object.defineProperty(xplore.canvasgraphics.Line.prototype, 'y1', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

Object.defineProperty(xplore.canvasgraphics.Line.prototype, 'y2', {
    get: function () { return this.points[1].y },
    set: function (value) { this.points[1].y = value }
});

xplore.canvasgraphics.Line.prototype.Render = function (canvas) {
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, this.Property());
};

xplore.canvasgraphics.Line.prototype.Update = function (mouse) {
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

xplore.canvasgraphics.Rectangle.prototype = Object.create(xplore.canvasgraphics.prototype);
xplore.canvasgraphics.Rectangle.constructor = xplore.canvasgraphics.Rectangle;

Object.defineProperty(xplore.canvasgraphics.Rectangle.prototype, 'x', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(xplore.canvasgraphics.Rectangle.prototype, 'y', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

Object.defineProperty(xplore.canvasgraphics.Rectangle.prototype, 'w', {
    get: function () { return this.points[1].x },
    set: function (value) { this.points[1].x = value }
});

Object.defineProperty(xplore.canvasgraphics.Rectangle.prototype, 'h', {
    get: function () { return this.points[1].y },
    set: function (value) { this.points[1].y = value }
});

xplore.canvasgraphics.Rectangle.prototype.Render = function (canvas) {
    canvas.DrawRectangle(this.x, this.y, this.w, this.h, this.Property());
};

xplore.canvasgraphics.Rectangle.prototype.Update = function (mouse) {
    this.points[1] = { x: Math.abs(this.points[0].x - mouse.x) * 2, y: Math.abs(this.points[0].y - mouse.y) * 2 };
};
