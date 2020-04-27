var structuregraphics = function () {
};

structuregraphics.constructor = structuregraphics;


//Nodes

structuregraphics.Nodes = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.fillcolor = "#88f";
    this.properties.linecolor = "#00f";
    this.properties.font = "normal 13px arial";
};

structuregraphics.Nodes.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Nodes.constructor = structuregraphics.Nodes;

structuregraphics.Nodes.prototype.Add = function (object) {
    let add = true;

    //Check for duplicate nodes

    for (let i = 0; i < this.list.length; i++) {
        if (Math.abs(this.list[i].x - object.x) <= this.tolerance && Math.abs(this.list[i].y - object.y) <= this.tolerance) {
            add = false;
            break;
        }
    }

    if (add) {
        this.list.push(object);
        this.updatetext = true;
    }

    return add;
};

structuregraphics.Nodes.prototype.Clear = function (object) {
    this.list = [];
};

structuregraphics.Nodes.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    if (this.updatetext) {
        this.updatetext = false;

        for (let i = 0; i < this.list.length; i++)
            this.list[i].text = i + 1;
    }

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};



//Node

structuregraphics.Node = function (x, y) {
    xplore.canvasgraphics.call(this);

    this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.Node.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Node.constructor = structuregraphics.Node;

Object.defineProperty(structuregraphics.Node.prototype, 'x', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(structuregraphics.Node.prototype, 'y', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

structuregraphics.Node.prototype.Render = function (canvas) {
    let width = canvas.ToPointWidth(5);
    canvas.DrawRectangle_2(this.x, this.y, width, width);

    //Text
    canvas.DrawText_2(this.text, this.x + width, this.y + width);
};



//Frames

structuregraphics.Frames = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.linecolor = "#fff";
    this.properties.font = "normal 13px arial";
};

structuregraphics.Frames.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Frames.constructor = structuregraphics.Frames;

structuregraphics.Frames.prototype.Add = function (object) {
    this.list.push(object);
    this.updatetext = true;
};

structuregraphics.Frames.prototype.Clear = function (object) {
    this.list = [];
};

structuregraphics.Frames.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    if (this.updatetext) {
        this.updatetext = false;

        for (let i = 0; i < this.list.length; i++)
            this.list[i].text = i + 1;
    }

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};

structuregraphics.Frames.prototype.Split = function (x, y) {
    let line;
    let point;

    for (let i = 0; i < this.list.length; i++) {
        line = new xplore.canvasentity.Line2F(this.list[i]);
        point = line.Intersection({ x: x, y: y });

        if (point) {
            this.list[i].x2 = point.x;
            this.list[i].y2 = point.y;

            this.list.splice(i + 1, 0, new structuregraphics.Frame(point.x, point.y, line.x2, line.y2));
            i--;
        }
    }
};

structuregraphics.Frames.prototype.UpdateIntersections = function () {
    let line1;
    let line2;
    let intersection;

    this.intersections = [];

    if (this.list.length > 1) {
        for (let i = 0; i < this.list.length; i++) {
            for (let j = i; j < this.list.length; j++) {
                line1 = new xplore.canvasentity.Line2F(this.list[i]);
                line2 = new xplore.canvasentity.Line2F(this.list[j]);

                intersection = line1.Intersection(line2);
    
                if (intersection) 
                    this.intersections.push(intersection);
            }
        }
    }

    return this.intersections;
};


//Frame

structuregraphics.Frame = function (x1, y1, x2, y2) {
    xplore.canvasgraphics.Line.call(this, x1, y1, x2, y2);
};

structuregraphics.Frame.prototype = Object.create(xplore.canvasgraphics.Line.prototype);
structuregraphics.Frame.constructor = structuregraphics.Frame;

structuregraphics.Frame.prototype.Render = function (canvas) {
    let property = this.Property();
    canvas.DrawLine(this.x1, this.y1, this.x2, this.y2, property);

    //Text
    if (this.text)
        canvas.DrawText_2(this.text, (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
};