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

    this.supportproperties = new xplore.DrawProperties();
    this.supportproperties.fillcolor = "#f80";
    this.supportproperties.linecolor = "#f80";
    this.supportproperties.font = "normal 13px arial";

    this.supportbaseproperties = new xplore.DrawProperties();
    this.supportbaseproperties.fillcolor = "#888";
    this.supportbaseproperties.linecolor = "#888";
    this.supportbaseproperties.font = "normal 13px arial";
};

structuregraphics.Nodes.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Nodes.constructor = structuregraphics.Nodes;

let nodes = structuregraphics.Nodes.prototype;

nodes.Add = function (object) {
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

nodes.Clear = function (object) {
    this.list = [];
};

nodes.Render = function (canvas) {
    let width = canvas.ToPointWidth(5);

    canvas.SetProperties(this.properties);

    if (this.updatetext) {
        this.updatetext = false;

        for (let i = 0; i < this.list.length; i++)
            this.list[i].text = i + 1;
    }

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas, this, width);
    }
};

nodes.SelectByPoint = function (canvas, x, y) {
    let width = canvas.ToPointWidth(5);

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByPoint(canvas, x, y, width);
    }
};

nodes.SelectByRectangle = function (x1, y1, x2, y2) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByRectangle(x1, y1, x2, y2);
    }
};

nodes.ClearSelection = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].selected = false;
    }
};

nodes.Delete = function () {
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

nodes.AssignSupport = function (x, y, rx, ry) {
    for (let i = 0; i < this.list.length; i++)
        if (this.list[i].selected) {
            this.list[i].selected = false;
            this.list[i].support = new structuregraphics.Support(x, y, rx, ry);
        }
};

nodes.AssignNodalLoad = function (x, y) {
    for (let i = 0; i < this.list.length; i++)
        if (this.list[i].selected) {
            this.list[i].selected = false;
            this.list[i].load = new structuregraphics.NodalLoad(this.list[i], x, y);
        }
};


nodes.GetSelectedNodes = function () {
    let selected = [];

    for (let i = 0; i < this.list.length; i++)
        if (this.list[i].selected)
            selected.push(i);

    return selected;
};


//Node

structuregraphics.Node = function (x, y) {
    xplore.canvasgraphics.call(this);

    node.selected = false;

    if (x.x !== undefined)
        this.points = [{ x: x.x || 0, y: x.y || 0 }];
    else
        this.points = [{ x: x || 0, y: y || 0 }];
};

structuregraphics.Node.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Node.constructor = structuregraphics.Node;

let node = structuregraphics.Node.prototype;

Object.defineProperty(node, 'action', {
    get: function () { return 1; }
});

Object.defineProperty(node, 'x', {
    get: function () { return this.points[0].x },
    set: function (value) { this.points[0].x = value }
});

Object.defineProperty(node, 'y', {
    get: function () { return this.points[0].y },
    set: function (value) { this.points[0].y = value }
});

node.Render = function (canvas, parent, width) {
    if (this.support)
        this.support.Render(canvas, parent, this.x, this.y, width);

    if (this.load)
        this.load.Render(canvas);

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

node.SelectByPoint = function (canvas, x, y, tolerance) {
    if (Math.abs(this.x - x) < tolerance && Math.abs(this.y - y) < tolerance) {
        this.selected = true;
        return true;
    }

    return false;
};

node.SelectByRectangle = function (x1, y1, x2, y2) {
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

let members = structuregraphics.Members.prototype;

members.Add = function (object) {
    this.list.push(object);
    this.updatetext = true;
};

members.Clear = function (object) {
    this.list = [];
};

members.Render = function (canvas) {
    let width = canvas.ToPointWidth(5);
    canvas.SetProperties(this.properties);

    if (this.updatetext) {
        this.updatetext = false;

        for (let i = 0; i < this.list.length; i++)
            this.list[i].text = i + 1;
    }

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas, this, width);
    }
};

members.Split = function (x, y) {
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

members.UpdateIntersections = function () {
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

members.SelectByPoint = function (canvas, x, y) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByPoint(canvas, x, y);
    }
};

members.SelectByRectangle = function (x1, y1, x2, y2) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].SelectByRectangle(x1, y1, x2, y2);
    }
};

members.ClearSelection = function () {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].selected = false;
    }
};

members.Delete = function (x, y) {
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

members.AssignMemberLoad = function (w1, w2, l1, l2) {
    for (let i = 0; i < this.list.length; i++)
        if (this.list[i].selected) {
            this.list[i].selected = false;
            this.list[i].load = new structuregraphics.MemberLoad(this.list[i], w1, w2, l1, l2);
        }
};


//Member

structuregraphics.Member = function (x1, y1, x2, y2) {
    xplore.canvasgraphics.Line.call(this, x1, y1, x2, y2);
};

structuregraphics.Member.prototype = Object.create(xplore.canvasgraphics.Line.prototype);
structuregraphics.Member.constructor = structuregraphics.Member;

let member = structuregraphics.Member.prototype;

member.Render = function (canvas, parent, width) {
    if (this.load) {
        this.load.Render(canvas, parent, this.x1, this.y1, this.x2, this.y2, width);
    }

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

member.SelectByPoint = function (canvas, x, y) {
    let line = new xplore.canvasentity.Line2F(this.x1, this.y1, this.x2, this.y2);

    if (line.Intersection({ x: x, y: y }, undefined, 0.05 / canvas.zoomvalue)) {
        this.selected = true;
        return true;
    }

    return false;
};

member.SelectByRectangle = function (x1, y1, x2, y2) {
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


//Support

structuregraphics.Support = function (x, y, rx, ry) {
    xplore.canvasgraphics.call(this);

    this.x = x || 0;
    this.y = y || 0;
    this.rx = rx || 0;
    this.ry = ry || 0;
};

structuregraphics.Support.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.Support.constructor = structuregraphics.Support;

let support = structuregraphics.Support.prototype;

support.Render = function (canvas, parent, x, y, width) {
    let offset = width * 3;
    canvas.SetProperties(parent.supportproperties);

    if (this.x === 1 && this.y === 1 && this.rx === 1 && this.ry === 1) {
        //Fixed support
        canvas.DrawPolygon_2([
            { x: x - width, y: y },
            { x: x + width, y: y },
            { x: x + width, y: y - width * 3 },
            { x: x - width, y: y - width * 3 },
        ]);

    } else if (this.x === 1 && this.y === 1) {
        //Pin support
        canvas.DrawPolygon_2([
            { x: x, y: y },
            { x: x + width * 2, y: y - width * 3 },
            { x: x - width * 2, y: y - width * 3 },
        ]);

    } else if (this.x === 1) {
        //Roller X
        canvas.DrawCircle_2(x - width * 1.5, y, width * 1.5);

        canvas.SetProperties(parent.supportbaseproperties);

        canvas.DrawPolygon_2([
            { y: y - width * 3, x: x - offset },
            { y: y + width * 3, x: x - offset },
            { y: y + width * 3, x: x - width - offset },
            { y: y - width * 3, x: x - width - offset },
        ]);

        canvas.SetProperties(parent.properties);
        canvas.DrawLine_2(x - offset, y - width * 5, x - offset, y + width * 5);
        return;

    } else if (this.y === 1) {
        //Roller Y
        canvas.DrawCircle_2(x, y - width * 1.5, width * 1.5);

    } else {
        return;
    }

    canvas.SetProperties(parent.supportbaseproperties);

    canvas.DrawPolygon_2([
        { x: x - width * 3, y: y - offset },
        { x: x + width * 3, y: y - offset },
        { x: x + width * 3, y: y - width - offset },
        { x: x - width * 3, y: y - width - offset },
    ]);

    canvas.SetProperties(parent.properties);
    canvas.DrawLine_2(x - width * 5, y - offset, x + width * 5, y - offset);
};


//Nodal Load

structuregraphics.NodalLoad = function (node, x, y) {
    xplore.canvasgraphics.call(this);

    this.node = node;
    this.x = x;
    this.y = y;

    this.line;
    this.arrow;

    this.Refresh();
};

structuregraphics.NodalLoad.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.NodalLoad.constructor = structuregraphics.NodalLoad;

let nodalload = structuregraphics.NodalLoad.prototype;

nodalload.Refresh = function () {
    let size = 0.5;
    let sign;
    let arrow;
    let line;

    this.lines = [];
    this.arrows = [];

    //X
    if (this.x) {
        sign = Math.sign(this.x);
        line = { x1: this.node.x - size * sign, y1: this.node.y, x2: this.node.x, y2: this.node.y };
        this.lines.push(line);
        
        arrow = new xplore.canvasgraphics.Arrow(line.x1, line.y1, line.x2, line.y2);
        this.arrows.push(arrow.points);
    }

    //y
    if (this.y) {
        sign = Math.sign(this.y);
        line = { x1: this.node.x, y1: this.node.y - size * sign, x2: this.node.x, y2: this.node.y };
        this.lines.push(line);

        arrow = new xplore.canvasgraphics.Arrow(line.x1, line.y1, line.x2, line.y2);
        this.arrows.push(arrow.points);
    }
};

nodalload.Render = function (canvas) {
    let line;

    for (let i = 0; i < this.lines.length; i++) {
        line = this.lines[i];
        canvas.DrawLine_2(line.x1, line.y1, line.x2, line.y2);
    }

    for (let i = 0; i < this.arrows.length; i++) {
        canvas.DrawPolygon_2(this.arrows[i]);
    }
};


//Member Load

structuregraphics.MemberLoad = function (member, w1, w2, l1, l2) {
    xplore.canvasgraphics.call(this);

    this.member = member;
    this.w1 = w1;
    this.w2 = w2;
    this.l1 = l1;
    this.l2 = l2;

    this.Refresh();
};

structuregraphics.MemberLoad.prototype = Object.create(xplore.canvasgraphics.prototype);
structuregraphics.MemberLoad.constructor = structuregraphics.MemberLoad;

let memberload = structuregraphics.MemberLoad.prototype;

memberload.Refresh = function () {
    let line = new xplore.canvasentity.Line2F(this.member.x1, this.member.y1, this.member.x2, this.member.y2);
    let offset = line.Offset(0.5);

    this.lines = [
        { x1: offset.x1, y1: offset.y1, x2: offset.x2, y2: offset.y2 },
        { x1: offset.x1, y1: offset.y1, x2: this.member.x1, y2: this.member.y1 },
        { x1: this.member.x2, y1: this.member.y2, x2: offset.x2, y2: offset.y2 },
    ];

    let line2 = new xplore.canvasentity.Line2F(offset.x1, offset.y1, offset.x2, offset.y2);
    let points = line.SplitBySpacing(0.2);
    let points2 = line2.SplitBySpacing(0.2);
    let arrow;

    this.arrows = [];

    for (let i = 0; i < points.length; i++) {
        this.lines.push({ x1: points2[i].x, y1: points2[i].y, x2: points[i].x, y2: points[i].y });

        arrow = new xplore.canvasgraphics.Arrow(points2[i].x, points2[i].y, points[i].x, points[i].y);
        this.arrows.push(arrow.points);
    }
};

memberload.Render = function (canvas, parent) {
    let line;

    for (let i = 0; i < this.lines.length; i++) {
        line = this.lines[i];
        canvas.DrawLine_2(line.x1, line.y1, line.x2, line.y2);
    }

    for (let i = 0; i < this.arrows.length; i++) {
        canvas.DrawPolygon_2(this.arrows[i]);
    }
};