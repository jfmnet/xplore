var structuremodel = function () {
    xplore.Canvas2DModel.call(this);

    this.nodes = new structuregraphics.Nodes();
    this.frames = new structuregraphics.Frames();
    this.supports = [];
    this.nodalloads = [];
    this.frameloads = [];

    this.intersections = [];
};

structuremodel.prototype = Object.create(xplore.Canvas2DModel.prototype);
structuremodel.constructor = structuremodel;

xplore.Canvas2DModel.prototype.Add = function (object) {
    if (object instanceof structuregraphics.Node) {
        this.nodes.push(object);
    }

    else if (object instanceof structuregraphics.Frame) {
        //Split frames
        this.frames.Split(object.x1, object.y1);
        this.frames.Split(object.x2, object.y2);

        //Add frame
        this.frames.Add(object);

        //Add nodes
        this.nodes.Add(new structuregraphics.Node(object.x1, object.y1));
        this.nodes.Add(new structuregraphics.Node(object.x2, object.y2));
    }
};

xplore.Canvas2DModel.prototype.Clear = function () {
    this.nodes.Clear();
    this.frames.Clear();
    this.supports = [];
    this.nodalloads = [];
    this.frameloads = [];
};

structuremodel.prototype.Render = function (canvas) {
    //Frames
    this.frames.Render(canvas);

    //Nodes
    this.nodes.Render(canvas);


    //Drawing guide
    if (canvas.settings.showsnapguide && this.snappoint) {
        let x = canvas.ToCoordX(this.snappoint.x);
        let y = canvas.ToCoordY(this.snappoint.y);

        canvas.PrimitiveLine(x, 0, x, canvas.height, "#008", 1, [2, 2]);
        canvas.PrimitiveLine(0, y, canvas.width, y, "#008", 1, [2, 2]);

        let count = canvas.gridinterval.CountDecimals();

        if (count > 10) {
            canvas.gridinterval = parseFloat(canvas.gridinterval.toFixed(10));
            count = canvas.gridinterval.CountDecimals();
        }

        let textx = this.snappoint.x.toFixed(count);
        let texty = this.snappoint.y.toFixed(count);

        canvas.PrimitiveText(textx + ", " + texty, x + 10, y - 10, "normal 12px arial", "#FFF", 0, "left", "bottom");
    }

    //New drawing
    if (this.draw) {
        this.draw.Render(canvas);
    }
};

structuremodel.prototype.UpdatePoints = function () {
    this.intersections = this.frames.UpdateIntersections();
};

structuremodel.prototype.SnapOnPoint = function (canvas, mouse) {
    let point;
    let tolerance = canvas.ToPointWidth(20);

    for (let i = 0; i < this.nodes.list.length; i++) {
        point = new xplore.canvasentity.Point2F(this.nodes.list[i].x, this.nodes.list[i].y);

        if (point.Equal(mouse.x, mouse.y, tolerance)) {
            return point;
        }
    }
};

structuremodel.prototype.SnapOnIntersection = function (canvas, mouse) {
    let point;
    let tolerance = canvas.ToPointWidth(20);

    for (let i = 0; i < this.intersections.length; i++) {
        point = new xplore.canvasentity.Point2F(this.intersections[i].x, this.intersections[i].y);

        if (point.Equal(mouse.x, mouse.y, tolerance)) {
            return point;
        }
    }
};
