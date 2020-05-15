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

    this.selectedproperties = new xplore.DrawProperties();
    this.selectedproperties.fillcolor = "#ff0";
    this.selectedproperties.linecolor = "#ff0";
    this.selectedproperties.font = "normal 13px arial";
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
        this.list[i].Render(canvas, this);
    }
};

structuregraphics.Nodes.prototype.SelectByPoint = function (canvas, x, y) {
    let width = canvas.ToPointWidth(5);

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByPoint(canvas, x, y, width);
    }
};

structuregraphics.Nodes.prototype.SelectByRectangle = function (x1, y1, x2, y2) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByRectangle(x1, y1, x2, y2);
    }
};

structuregraphics.Nodes.prototype.ClearSelection = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].selected = false;
    }
};

structuregraphics.Nodes.prototype.Delete = function () {
    let deleted = [];

    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].selected) {
            deleted.push(this.list[i]);
            this.list.splice(i, 1);
            i--;
        }
    }

    return deleted;
};


//Node

structuregraphics.Node = function (x, y) {
    xplore.canvasgraphics.call(this);

    if (x.x !== undefined)
        this.points = [{ x: x.x || 0, y: x.y || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.Node.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Node.constructor = structuregraphics.Node;
Object.defineProperty(structuregraphics.Node.prototype, 'action', {
    get: function () { return 1; }
});

Object.defineProperty(structuregraphics.Node.prototype, 'x', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(structuregraphics.Node.prototype, 'y', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

structuregraphics.Node.prototype.selected = false;

structuregraphics.Node.prototype.Render = function (canvas, parent) {
    let width = canvas.ToPointWidth(5);

    if (this.selected) {
        let size = width * 2;

        canvas.SetProperties(parent.selectedproperties);
        canvas.DrawRectangle_2(this.x, this.y, width, width);
        canvas.DrawLine_2(this.x - size, this.y - size, this.x + size, this.y + size);
        canvas.DrawLine_2(this.x - size, this.y + size, this.x + size, this.y - size);
        canvas.SetProperties(parent.properties);
    }
    else
        canvas.DrawRectangle_2(this.x, this.y, width, width);

    //Text
    canvas.DrawText_2(this.text, this.x + width, this.y + width);
};

structuregraphics.Node.prototype.SelectByPoint = function (canvas, x, y, tolerance) {
    if (Math.abs(this.x - x) < tolerance && Math.abs(this.y - y) < tolerance) {
        this.selected = true;
        return true;
    }

    return false;
};

structuregraphics.Node.prototype.SelectByRectangle = function (x1, y1, x2, y2) {
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);

    if (Math.abs(this.x - x1) <= x && Math.abs(this.x - x2) <= x) {
        if (Math.abs(this.y - y1) <= y && Math.abs(this.y - y2) <= y) {
            this.selected = true;
            return true;
        }
    }
};


//Members

structuregraphics.Members = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.linecolor = "#fff";
    this.properties.font = "normal 13px arial";

    this.selectedproperties = new xplore.DrawProperties();
    this.selectedproperties.fillcolor = "#ff0";
    this.selectedproperties.linecolor = "#ff0";
    this.selectedproperties.font = "normal 13px arial";
};

structuregraphics.Members.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Members.constructor = structuregraphics.Members;

structuregraphics.Members.prototype.Add = function (object) {
    this.list.push(object);
    this.updatetext = true;
};

structuregraphics.Members.prototype.Clear = function (object) {
    this.list = [];
};

structuregraphics.Members.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    if (this.updatetext) {
        this.updatetext = false;

        for (let i = 0; i < this.list.length; i++)
            this.list[i].text = i + 1;
    }

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas, this);
    }
};

structuregraphics.Members.prototype.Split = function (x, y) {
    let line;
    let point;

    for (let i = 0; i < this.list.length; i++) {
        line = new xplore.canvasentity.Line2F(this.list[i]);
        point = line.Intersection({ x: x, y: y });

        if (point) {
            this.list[i].x2 = point.x;
            this.list[i].y2 = point.y;

            this.list.splice(i + 1, 0, new structuregraphics.Member(point.x, point.y, line.x2, line.y2));
            this.updatetext = true;

            //i--;
        }
    }
};

structuregraphics.Members.prototype.UpdateIntersections = function () {
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

structuregraphics.Members.prototype.SelectByPoint = function (canvas, x, y) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByPoint(canvas, x, y);
    }
};

structuregraphics.Members.prototype.SelectByRectangle = function (x1, y1, x2, y2) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByRectangle(x1, y1, x2, y2);
    }
};

structuregraphics.Members.prototype.ClearSelection = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].selected = false;
    }
};

structuregraphics.Members.prototype.Delete = function (x, y) {
    if (x !== undefined && y !== undefined) {
        for (let i = 0; i < this.list.length; i++) {
            if ((Math.abs(this.list[i].x1 - x) < this.tolerance && Math.abs(this.list[i].y1 - y) < this.tolerance) ||
                (Math.abs(this.list[i].x2 - x) < this.tolerance && Math.abs(this.list[i].y2 - y) < this.tolerance)) {
                    this.list.splice(i, 1);
                    i--;
            }
        }

    } else {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].selected) {
                this.list.splice(i, 1);
                i--;
            }
        }
    }
};


//Member

structuregraphics.Member = function (x1, y1, x2, y2) {
    xplore.canvasgraphics.Line.call(this, x1, y1, x2, y2);
};

structuregraphics.Member.prototype = Object.create(xplore.canvasgraphics.Line.prototype);
structuregraphics.Member.constructor = structuregraphics.Member;

structuregraphics.Member.prototype.Render = function (canvas, parent) {
    if (this.selected) {
        canvas.SetProperties(parent.selectedproperties);
        canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2);
        canvas.SetProperties(parent.properties);
        
    } else {
        canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2);
    }

    //Text
    if (this.text)
        canvas.DrawText_2(this.text, (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
};

structuregraphics.Member.prototype.SelectByPoint = function (canvas, x, y) {
    let line = new xplore.canvasentity.Line2F(this.x1, this.y1, this.x2, this.y2);

    if (line.Intersection({ x: x, y: y }, undefined, 0.1 / canvas.zoomvalue)) {
        this.selected = true;
        return true;
    }

    return false;
};

structuregraphics.Member.prototype.SelectByRectangle = function (x1, y1, x2, y2) {
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);

    if (Math.abs(this.x1 - x1) <= x && Math.abs(this.x1 - x2) <= x) {
        if (Math.abs(this.y1 - y1) <= y && Math.abs(this.y1 - y2) <= y) {
            if (Math.abs(this.x2 - x1) <= x && Math.abs(this.x2 - x2) <= x) {
                if (Math.abs(this.y2 - y1) <= y && Math.abs(this.y2 - y2) <= y) {
                    this.selected = true;
                    return true;
                }
            }
        }
    }
};


//Supports

structuregraphics.Supports = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.fillcolor = "#88f";
    this.properties.linecolor = "#00f";
    this.properties.font = "normal 13px arial";

    this.selectedproperties = new xplore.DrawProperties();
    this.selectedproperties.fillcolor = "#ff0";
    this.selectedproperties.linecolor = "#ff0";
    this.selectedproperties.font = "normal 13px arial";
};

structuregraphics.Supports.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Supports.constructor = structuregraphics.Supports;

structuregraphics.Supports.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};

structuregraphics.Supports.prototype.Delete = function () {
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].selected) {
            this.list.splice(i, 1);
            i--;
        }
    }
};


//Support

structuregraphics.Support = function (x, y) {
    xplore.canvasgraphics.call(this);

    if (x.x !== undefined)
        this.points = [{ x: x.x || 0, y: x.y || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.Support.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Support.constructor = structuregraphics.Support;

structuregraphics.Support.prototype.Render = function (canvas) {
};


//Nodal Loads

structuregraphics.NodalLoads = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.fillcolor = "#88f";
    this.properties.linecolor = "#00f";
    this.properties.font = "normal 13px arial";

    this.selectedproperties = new xplore.DrawProperties();
    this.selectedproperties.fillcolor = "#ff0";
    this.selectedproperties.linecolor = "#ff0";
    this.selectedproperties.font = "normal 13px arial";
};

structuregraphics.NodalLoads.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.NodalLoads.constructor = structuregraphics.NodalLoads;

structuregraphics.NodalLoads.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};

structuregraphics.NodalLoads.prototype.Delete = function () {
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].selected) {
            this.list.splice(i, 1);
            i--;
        }
    }
};


//Nodal Load

structuregraphics.NodalLoad = function (x, y) {
    xplore.canvasgraphics.call(this);

    if (x.x !== undefined)
        this.points = [{ x: x.x || 0, y: x.y || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.NodalLoad.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.NodalLoad.constructor = structuregraphics.NodalLoad;

structuregraphics.NodalLoad.prototype.Render = function (canvas) {
};


//Member Loads

structuregraphics.MemberLoads = function () {
    xplore.canvasgraphics.call(this);

    this.tolerance = 0.001;
    this.list = [];
    this.updatetext;

    this.properties = new xplore.DrawProperties();
    this.properties.fillcolor = "#88f";
    this.properties.linecolor = "#00f";
    this.properties.font = "normal 13px arial";

    this.selectedproperties = new xplore.DrawProperties();
    this.selectedproperties.fillcolor = "#ff0";
    this.selectedproperties.linecolor = "#ff0";
    this.selectedproperties.font = "normal 13px arial";
};

structuregraphics.MemberLoads.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.MemberLoads.constructor = structuregraphics.MemberLoads;

structuregraphics.MemberLoads.prototype.Render = function (canvas) {
    canvas.SetProperties(this.properties);

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};

structuregraphics.MemberLoads.prototype.Delete = function () {
    for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].selected) {
            this.list.splice(i, 1);
            i--;
        }
    }
};


//Member Load

structuregraphics.MemberLoad = function (x, y) {
    xplore.canvasgraphics.call(this);

    if (x.x !== undefined)
        this.points = [{ x: x.x || 0, y: x.y || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.MemberLoad.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.MemberLoad.constructor = structuregraphics.MemberLoad;

structuregraphics.MemberLoad.prototype.Render = function (canvas) {
};