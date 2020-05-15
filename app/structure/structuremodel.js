var structuremodel = function () {
    xplore.Canvas2DModel.call(this);

    this.nodes = new structuregraphics.Nodes();
    this.frames = new structuregraphics.Members();
    this.nodalloads = [];
    this.frameloads = [];

    this.intersections = [];
};

structuremodel.prototype = Object.create(xplore.Canvas2DModel.prototype);
structuremodel.constructor = structuremodel;

let model = structuremodel.prototype;

model.Add = function (object) {
    if (object instanceof structuregraphics.Node) {
        this.frames.Split(object.x, object.y);
        this.nodes.Add(object);
    }

    else if (object instanceof structuregraphics.Member) {
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

model.Clear = function () {
    this.nodes.Clear();
    this.frames.Clear();
    this.supports = [];
    this.nodalloads = [];
    this.frameloads = [];
};

model.Render = function (canvas) {
    //Members
    this.frames.Render(canvas);

    //Nodes
    this.nodes.Render(canvas);
};

model.UpdatePoints = function () {
    this.intersections = this.frames.UpdateIntersections();
};


//Snap

model.SnapOnPoint = function (canvas, mouse) {
    let point;
    let tolerance = canvas.ToPointWidth(20);

    for (let i = 0; i < this.nodes.list.length; i++) {
        point = new xplore.canvasentity.Point2F(this.nodes.list[i].x, this.nodes.list[i].y);

        if (point.Equal(mouse.x, mouse.y, tolerance)) {
            return point;
        }
    }
};

model.SnapOnIntersection = function (canvas, mouse) {
    let point;
    let tolerance = canvas.ToPointWidth(20);

    for (let i = 0; i < this.intersections.length; i++) {
        point = new xplore.canvasentity.Point2F(this.intersections[i].x, this.intersections[i].y);

        if (point.Equal(mouse.x, mouse.y, tolerance)) {
            return point;
        }
    }
};


//Select

model.Select = function () {
    this.action = xplore.CANVASACTIONS.SELECT;
    delete this.drawobject;
    delete this.draw;
    this.downcount = 0;
};

model.SelectByPoint = function (canvas, mouse) {
     //Members
     this.frames.SelectByPoint(canvas, mouse.current.x, mouse.current.y);

     //Nodes
     this.nodes.SelectByPoint(canvas, mouse.current.x, mouse.current.y);
};

model.SelectByRectangle = function (canvas, mouse) {
     //Members
     this.frames.SelectByRectangle(mouse.down.x, mouse.down.y, mouse.current.x, mouse.current.y);

     //Nodes
     this.nodes.SelectByRectangle(mouse.down.x, mouse.down.y, mouse.current.x, mouse.current.y);
};

model.ClearSelection = function () {
    //Members
    this.frames.ClearSelection();

    //Nodes
    this.nodes.ClearSelection();
};


//Delete

model.DeleteNodes = function () {
    let nodes = this.nodes.Delete();

    for (let i = 0; i < nodes.length; i++)
        this.frames.Delete(nodes[i].x, nodes[i].y);
};

model.DeleteNodalLoads = function () {
    //this.nodalloads.Delete();
};

model.DeleteMembers = function () {
    this.frames.Delete();
};

model.DeleteMemberLoads = function () {
    //this.frameloads.Delete();
};

model.DeleteSupports = function () {
    //this.supports.Delete();
};


//Assign

model.AssignSupport = function (x, y, rx, ry) {
    this.nodes.AssignSupport(x, y, rx, ry);
};