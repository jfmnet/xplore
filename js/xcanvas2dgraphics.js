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

canvasgraphics.Bounds = function (bounds) {
    for (let point of this.points)
        bounds.Update(point.x, point.y);
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


//Dimension Line

xplore.Canvas2DGraphics.DimensionLine = function (x1, y1, x2, y2, text, offset) {
    xplore.Canvas2DGraphics.call(this);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.offset = offset === undefined ? 1 : offset;
    this.text = text;

    let line = new xplore.canvasentity.Line2F(x1, y1, x2, y2);
    let length = line.length;
    let angle = line.anglerad;

    this.points = [
        { x: x1, y: y1 },
        { x: x1, y: y1 + this.offset },
        { x: x1 + length, y: y1 + this.offset },
        { x: x1 + length, y: y1 },
    ];

    this.Rotate(angle, x1, y1);
};

xplore.Canvas2DGraphics.DimensionLine.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.DimensionLine.constructor = xplore.Canvas2DGraphics.DimensionLine;

let xdimension = xplore.Canvas2DGraphics.DimensionLine.prototype;

xdimension.Render = function (canvas) {
    canvas.DrawLine_2(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
    canvas.DrawLine_2(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);
    canvas.DrawLine_2(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y);
};


//Arrow

// arrowpos - 0 - Left, 1 - Right, 2 - Both sides
xplore.Canvas2DGraphics.Arrow = function (x1, y1, x2, y2, properties) {
    xplore.Canvas2DGraphics.call(this);

    properties = properties || {
        size: 25,
        position: 2,
        fixedsize: true
    };

    //Tail
    this.x1 = x1;
    this.y1 = y1;

    //Head
    this.x2 = x2;
    this.y2 = y2;

    this.size = properties.size;
    this.position = properties.position;
    this.fixedsize = properties.fixedsize;

    //Arrow direction
    //To the east
    // ------->>
    if (!this.fixedsize) {
        let line = new xplore.canvasentity.Line2F(x1, y1, x2, y2);
        let length = line.length;
        let arrowlength = length * this.size;
        let angle = line.anglerad;

        this.points = [
            { x: x1, y: y1 },
            { x: x1 + arrowlength, y: y1 + arrowlength / 3 },
            { x: x1 + arrowlength, y: y1 - arrowlength / 3 },
            { x: x1 + length, y: y1 },
            { x: x1 + length - arrowlength, y: y1 + arrowlength / 3 },
            { x: x1 + length - arrowlength, y: y1 - arrowlength / 3 },
        ];

        this.Rotate(angle, x1, y1);

        this.pointsleft = [
            this.points[0],
            this.points[1],
            this.points[2],
        ];

        this.pointsright = [
            this.points[3],
            this.points[4],
            this.points[5],
        ];
    }
};

xplore.Canvas2DGraphics.Arrow.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Arrow.constructor = xplore.Canvas2DGraphics.Arrow;

let arrow = xplore.Canvas2DGraphics.Arrow.prototype;

arrow.Render = function (canvas) {
    canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2);

    if (this.fixedsize) {
        let line = new xplore.canvasentity.Line2F(this.x1, this.y1, this.x2, this.y2);
        let length = line.length;
        let angle = line.anglerad;
        let arrowlength = canvas.ToPointWidth(this.size);

        this.points = [
            { x: this.x1, y: this.y1 },
            { x: this.x1 + arrowlength, y: this.y1 + arrowlength / 3 },
            { x: this.x1 + arrowlength, y: this.y1 - arrowlength / 3 },
            { x: this.x1 + length, y: this.y1 },
            { x: this.x1 + length - arrowlength, y: this.y1 + arrowlength / 3 },
            { x: this.x1 + length - arrowlength, y: this.y1 - arrowlength / 3 },
        ];

        this.Rotate(angle, this.x1, this.y1);

        this.pointsleft = [
            this.points[0],
            this.points[1],
            this.points[2],
        ];

        this.pointsright = [
            this.points[3],
            this.points[4],
            this.points[5],
        ];

        if (this.position === 0 || this.position === 2)
            canvas.DrawPolygon_2(this.pointsleft);

        if (this.position === 1 || this.position === 2)
            canvas.DrawPolygon_2(this.pointsright);

    } else {
        if (this.position === 0 || this.position === 2)
            canvas.DrawPolygon_2(this.pointsleft);

        if (this.position === 1 || this.position === 2)
            canvas.DrawPolygon_2(this.pointsright);
    }
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

xpolygon.Render = function (canvas, ondraw) {
    canvas.DrawPolygon(this.points, this.Property());

    if (ondraw) {
        let point1 = this.points[this.points.length - 2];
        let point2 = this.points[this.points.length - 1];

        let dimension = new xplore.Canvas2DGraphics.DimensionLine(point1.x, point1.y, point2.x, point2.y, "2.25", 2);
        dimension.Render(canvas);
    }
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
//I-Section

xplore.Canvas2DGraphics.I = function (x, y, wt, wb, h, tw, tft, tfb) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.wt = wt;
    this.wb = wb;
    this.h = h;
    this.tw = tw;
    this.tft = tft;
    this.tfb = tfb;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.I.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.I.constructor = xplore.Canvas2DGraphics.I;

let xisection = xplore.Canvas2DGraphics.I.prototype;

xisection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xisection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let wt = this.wt;
    let wb = this.wb;
    let h = this.h;
    let tw = this.tw;
    let tft = this.tft;
    let tfb = this.tfb;

    this.points = [
        { x: x - wb / 2, y: y - h / 2 }, //1
        { x: x - wb / 2, y: y - h / 2 + tfb }, //2
        { x: x - tw / 2, y: y - h / 2 + tfb }, //3
        { x: x - tw / 2, y: y + h / 2 - tft }, //4
        { x: x - wt / 2, y: y + h / 2 - tft }, //5
        { x: x - wt / 2, y: y + h / 2 }, //6
        { x: x + wt / 2, y: y + h / 2 }, //7
        { x: x + wt / 2, y: y + h / 2 - tft }, //8
        { x: x + tw / 2, y: y + h / 2 - tft }, //9
        { x: x + tw / 2, y: y - h / 2 + tfb }, //10
        { x: x + wb / 2, y: y - h / 2 + tfb }, //11
        { x: x + wb / 2, y: y - h / 2 } //12
    ];
};

//Tee Section

xplore.Canvas2DGraphics.T = function (x, y, w, h, tw, tf) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tw = tw;
    this.tf = tf;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.T.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.T.constructor = xplore.Canvas2DGraphics.T;

let xtsection = xplore.Canvas2DGraphics.T.prototype;

xtsection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xtsection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    let tw = this.tw;
    let tf = this.tf;

    this.points = [
        { x: x - tw / 2, y: y - h / 2 }, //1
        { x: x - tw / 2, y: y + h / 2 - tf }, //2
        { x: x - w / 2, y: y + h / 2 - tf }, //3
        { x: x - w / 2, y: y + h / 2 }, //4
        { x: x + w / 2, y: y + h / 2 }, //5
        { x: x + w / 2, y: y + h / 2 - tf }, //6
        { x: x + tw / 2, y: y + h / 2 - tf }, //7
        { x: x + tw / 2, y: y - h / 2 } //8
    ];
};

//Angle Section

xplore.Canvas2DGraphics.Angle = function (x, y, w, h, tw, tf) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tw = tw;
    this.tf = tf;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.Angle.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Angle.constructor = xplore.Canvas2DGraphics.Angle;

let xanglesection = xplore.Canvas2DGraphics.Angle.prototype;

xanglesection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xanglesection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    let tw = this.tw;
    let tf = this.tf;

    this.points = [
        { x: x - w / 2, y: y - h / 2 }, //1
        { x: x - w / 2, y: y + h / 2 }, //2
        { x: x - w / 2 + tw, y: y + h / 2 }, //3
        { x: x - w / 2 + tw, y: y - h / 2 + tf }, //4
        { x: x + w / 2, y: y - h / 2 + tf }, //5
        { x: x + w / 2, y: y - h / 2 }, //6
    ];
};

//Channel Section

xplore.Canvas2DGraphics.Channel = function (x, y, wt, wb, h, tw, tft, tfb) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.wt = wt;
    this.wb = wb;
    this.h = h;
    this.tw = tw;
    this.tft = tft;
    this.tfb = tfb;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.Channel.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Channel.constructor = xplore.Canvas2DGraphics.Channel;

let xchannelsection = xplore.Canvas2DGraphics.Channel.prototype;

xchannelsection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xchannelsection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let wt = this.wt;
    let wb = this.wb;
    let h = this.h;
    let tw = this.tw;
    let tft = this.tft;
    let tfb = this.tfb;

    let wMax = Math.max(wt, wb);

    this.points = [
        { x: x - wMax / 2, y: y - h / 2 }, //1
        { x: x - wMax / 2, y: y + h / 2 }, //2
        { x: x - wMax / 2 + wt, y: y + h / 2 }, //3
        { x: x - wMax / 2 + wt, y: y + h / 2 - tft }, //4
        { x: x - wMax / 2 + tw, y: y + h / 2 - tft }, //5
        { x: x - wMax / 2 + tw, y: y - h / 2 + tfb }, //6
        { x: x - wMax / 2 + wb, y: y - h / 2 + tfb }, //7
        { x: x - wMax / 2 + wb, y: y - h / 2 }, //8
    ];
};

//Double Channel Section

xplore.Canvas2DGraphics.DoubleChannel = function (x, y, w, h, tw, tft, tfb) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tw = tw;
    this.tft = tft;
    this.tfb = tfb;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.DoubleChannel.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.DoubleChannel.constructor = xplore.Canvas2DGraphics.DoubleChannel;

let xdoublecsection = xplore.Canvas2DGraphics.DoubleChannel.prototype;

xdoublecsection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
    canvas.DrawPolygon(canvas.FlipHorizontal(this.points, this.x, -1), this.Property());
};

xdoublecsection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    let tw = this.tw;
    let tft = this.tft;
    let tfb = this.tfb;


    this.points = [
        { x: x, y: y - h / 2 }, //1
        { x: x, y: y + h / 2 }, //2
        { x: x + w, y: y + h / 2 }, //3
        { x: x + w, y: y + h / 2 - tft }, //4
        { x: x + tw, y: y + h / 2 - tft }, //5
        { x: x + tw, y: y - h / 2 + tfb }, //6
        { x: x + w, y: y - h / 2 + tfb }, //7
        { x: x + w, y: y - h / 2 }, //8
    ];
};

//Closed Double Channel Section

xplore.Canvas2DGraphics.ClosedDoubleC = function (x, y, w, h, tw, tft, tfb) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w
    this.h = h;
    this.tw = tw;
    this.tft = tft;
    this.tfb = tfb;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.ClosedDoubleC.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.ClosedDoubleC.constructor = xplore.Canvas2DGraphics.ClosedDoubleC;

let xcdoublecsection = xplore.Canvas2DGraphics.ClosedDoubleC.prototype;

xcdoublecsection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
    canvas.DrawPolygon(canvas.FlipHorizontal(this.points, this.x, 1), this.Property());
};

xcdoublecsection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    let tw = this.tw;
    let tft = this.tft;
    let tfb = this.tfb;


    this.points = [
        { x: x - w, y: y - h / 2 }, //1
        { x: x - w, y: y + h / 2 }, //2
        { x: x, y: y + h / 2 }, //3
        { x: x, y: y + h / 2 - tft }, //4
        { x: x - w + tw, y: y + h / 2 - tft }, //5
        { x: x - w + tw, y: y - h / 2 + tfb }, //6
        { x: x, y: y - h / 2 + tfb }, //7
        { x: x, y: y - h / 2 }, //8
    ];
};

//Tube Section

xplore.Canvas2DGraphics.Tube = function (x, y, w, h, t) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.t = t;

    this.points;
    this.holes = [];

    this.Refresh();
};

xplore.Canvas2DGraphics.Tube.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Tube.constructor = xplore.Canvas2DGraphics.Tube;

let xtubesection = xplore.Canvas2DGraphics.Tube.prototype;

xtubesection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property(), this.holes);
};

xtubesection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let h = this.h;
    let t = this.t;
    this.x1 = this.x - this.w / 2;
    this.x2 = this.x + this.w / 2;

    this.y1 = this.y - this.h / 2;
    this.y2 = this.y + this.h / 2;

    this.points = [
        { x: this.x1, y: this.y1 }, //1
        { x: this.x1, y: this.y2 }, //2
        { x: this.x2, y: this.y2 }, //3
        { x: this.x2, y: this.y1 } //4
    ];

    this.holes.push({
        type: "polygon",
        points: [
            { x: this.x + this.w / 2 - this.t, y: this.y - this.h / 2 + this.t }, //8,
            { x: this.x + this.w / 2 - this.t, y: this.y + this.h / 2 - this.t }, //7,
            { x: this.x - this.w / 2 + this.t, y: this.y + this.h / 2 - this.t }, //6,
            { x: this.x - this.w / 2 + this.t, y: this.y - this.h / 2 + this.t } //5
        ]
    });
};

//Pipe Section

xplore.Canvas2DGraphics.Pipe = function (x, y, r, t) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.r = r;
    this.t = t;

    this.points;
    this.holes = [];

    this.Refresh();
};

xplore.Canvas2DGraphics.Pipe.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.Pipe.constructor = xplore.Canvas2DGraphics.Pipe;

let xpipesection = xplore.Canvas2DGraphics.Pipe.prototype;

xpipesection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property(), this.holes);
};

xpipesection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let r = this.r;
    let t = this.t;

    this.points = new xplore.canvasentity.Circle(x, y, r).GetPoints();

    this.holes.push({
        type: "circle",
        x: x,
        y: y,
        r: r - t,
        points: new xplore.canvasentity.Circle(x, y, r - t).GetPoints(),
    });
};

//U Section

xplore.Canvas2DGraphics.U = function (x, y, w, wl, wr, h, tw, tft, tfb) {
    xplore.Canvas2DGraphics.call(this);

    this.x = x;
    this.y = y;
    this.w = w;
    this.wl = wl;
    this.wr = wr;
    this.h = h;
    this.tw = tw;
    this.tft = tft;
    this.tfb = tfb;
    this.points;

    this.Refresh();
};

xplore.Canvas2DGraphics.U.prototype = Object.create(xplore.Canvas2DGraphics.prototype);
xplore.Canvas2DGraphics.U.constructor = xplore.Canvas2DGraphics.U;

let xusection = xplore.Canvas2DGraphics.U.prototype;

xusection.Render = function (canvas) {
    canvas.DrawPolygon(this.points, this.Property());
};

xusection.Refresh = function () {
    let x = this.x;
    let y = this.y;
    let w = this.w;
    let wl = this.wl;
    let wr = this.wr;
    let h = this.h;
    let tw = this.tw;
    let tft = this.tft;
    let tfb = this.tfb;

    this.points = [
        { x: x - w / 2, y: y + h / 2 }, //1
        { x: x + w / 2, y: y + h / 2 }, //2
        { x: x + w / 2, y: y - h / 2 + tfb }, //3
        { x: x + w / 2 + wr - tw, y: y - h / 2 + tfb }, //4
        { x: x + w / 2 + wr - tw, y: y - h / 2 }, //5
        { x: x + w / 2 - tw, y: y - h / 2 }, //6
        { x: x + w / 2 - tw, y: y + h / 2 - tft }, //7
        { x: x - w / 2 + tw, y: y + h / 2 - tft }, //8
        { x: x - w / 2 + tw, y: y - h / 2 },//9
        { x: x - w / 2 - wl + tw, y: y - h / 2 }, //10
        { x: x - w / 2 - wl + tw, y: y - h / 2 + tfb }, //11
        { x: x - w / 2, y: y - h / 2 + tfb }, //12
    ];
};
