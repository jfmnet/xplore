var structuregraphics = function () {
};

structuregraphics.constructor = structuregraphics;

let xstructuregraphics = structuregraphics.prototype;


//Nodes

structuregraphics.Nodes = function () {
    this.items = [];
};

let xnodes = structuregraphics.Nodes.prototype;

xnodes.Add = function (node) {
    this.items.push(node);
};

xnodes.Remove = function (node) {
};

xnodes.Render = function (canvas) {
    canvas.SetProperties({
        fillcolor: "#FFF",
        linecolor: "#008",
        thickness: 1
    });

    canvas.SetTextProperties({
        font: "13px Arial"
    });

    for (let item of this.items) {
        if (!item.selected)
            item.Render(canvas);
    }

    canvas.SetProperties({
        fillcolor: "#F00",
        linecolor: "#FF0",
        thickness: 1
    });

    for (let item of this.items) {
        if (item.selected)
            item.Render(canvas);
    }
};

xnodes.SelectByRectangle = function (canvas, mouse) {
    for (let item of this.items) {
        canvas.SelectByRectangle(item, item.x, item.y, mouse);
    }
};

xnodes.Write = function () {
    let output = "# node data ...\r\n";
    output += this.items.length + " # number of nodes \r\n";
    output += "#.node  x       y       z       r     units: inches\r\n";
    output += "\r\n";

    let count = 1;

    for (let item of this.items) {
        output += count++ + "   " + item.x + "  " + item.y + " 0   0   " + "\r\n";
    }

    return output;
};

xnodes.Bounds = function (bounds) {
    for (let item of this.items)
        bounds.Update(item.x, item.y);
};


structuregraphics.Node = function (x, y, id) {
    structuregraphics.call(this);

    this.id = id;
    this.x = x;
    this.y = y;

    //this.caption = new xplore.Canvas2DGraphics.Text(this.x, this.y);
};

structuregraphics.Node.prototype = Object.create(structuregraphics.prototype);
structuregraphics.Node.constructor = structuregraphics.Node;

let xnode = structuregraphics.Node.prototype;

xnode.Render = function (canvas) {
    let width = canvas.ToPointWidth(10);
    canvas.DrawRectangle_2(this.x, this.y, width, width);
};


//Members

structuregraphics.Members = function () {
    this.items = [];
};

let xmembers = structuregraphics.Members.prototype;

xmembers.Add = function (member) {
    this.items.push(member);
};

xmembers.Remove = function (member) {
};

xmembers.Render = function (canvas) {
    canvas.SetProperties({
        fillcolor: "#008",
        linecolor: "#008",
        thickness: 1
    });

    canvas.SetTextProperties({
        font: "13px Arial"
    });

    for (let item of this.items) {
        item.Render(canvas);
    }
};

structuregraphics.Member = function (x1, y1, x2, y2, id) {
    structuregraphics.call(this);

    this.id = id;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.caption = new xplore.Canvas2DGraphics.Text(this.id, (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
};

structuregraphics.Member.prototype = Object.create(structuregraphics.prototype);
structuregraphics.Member.constructor = structuregraphics.Member;

let xmember = structuregraphics.Member.prototype;

xmember.Render = function (canvas) {
    canvas.DrawLine_2(this.x1, this.y1, this.x2, this.y2);
};


//Supports

structuregraphics.Supports = function () {
    this.items = [];
};

let xsupports = structuregraphics.Supports.prototype;

xsupports.Add = function (member) {
    this.items.push(member);
};

xsupports.Remove = function (member) {
};

xsupports.Render = function (canvas) {
    canvas.SetProperties({
        fillcolor: "#840",
        linecolor: "#840",
        thickness: 1
    });

    canvas.SetTextProperties({
        font: "13px Arial"
    });

    for (let item of this.items) {
        item.Render(canvas);
    }
};

structuregraphics.Support = function (x, y, id) {
    structuregraphics.call(this);

    this.id = id;
    this.x = x;
    this.y = y;

    this.caption = new xplore.Canvas2DGraphics.Text(this.id, (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
};

structuregraphics.Support.prototype = Object.create(structuregraphics.prototype);
structuregraphics.Support.constructor = structuregraphics.Support;

let xsupport = structuregraphics.Support.prototype;

xsupport.Render = function (canvas) {
    let size = canvas.ToPointWidth(20);
    let hsize = size / 2;

    let points = [
        { x: this.x, y: this.y },
        { x: this.x + hsize, y: this.y - size },
        { x: this.x - hsize, y: this.y - size }
    ];

    canvas.DrawPolygon_2(points, true, false);
    canvas.DrawLine_2(this.x - size, this.y - size, this.x + size, this.y - size);
};


//Nodal Loads

structuregraphics.NodalLoads = function () {
    this.items = [];
};

let xnodalloads = structuregraphics.NodalLoads.prototype;

xnodalloads.Add = function (nodalload) {
    this.items.push(nodalload);
};

xnodalloads.Remove = function (nodalload) {
};

xnodalloads.Render = function (canvas) {
    canvas.SetProperties({
        fillcolor: "#840",
        linecolor: "#840",
        thickness: 1
    });

    canvas.SetTextProperties({
        font: "13px Arial"
    });

    for (let item of this.items) {
        item.Render(canvas);
    }
};

structuregraphics.NodalLoad = function (node, fx, fy, fz, mx, my, mz) {
    structuregraphics.call(this);

    this.node = node;
    this.fx = fx;
    this.fy = fy;
    this.fz = fz;
    this.mx = mx;
    this.my = my;
    this.mz = mz;
};

structuregraphics.NodalLoad.prototype = Object.create(structuregraphics.prototype);
structuregraphics.NodalLoad.constructor = structuregraphics.NodalLoad;

let xnodalload = structuregraphics.NodalLoad.prototype;

xnodalload.Render = function (canvas) {
    let size = canvas.ToPointWidth(100);
    let arrow;
    let text;

    if (this.fx) {
        let x = this.x - Math.sign(this.fx) * size;
        arrow = new xplore.Canvas2DGraphics.Arrow(this.x, this.y, x, this.y, { position: 0, fixedsize: false, size: 20 });
        arrow.Render(canvas);

        text = new xplore.Canvas2DGraphics.Text(this.fx, x, this.y);
        text.Render(canvas);
    }

    if (this.fy) {
        let y = this.y - Math.sign(this.fy) * size;
        arrow = new xplore.Canvas2DGraphics.Arrow(this.x, this.y, this.x, y, { position: 0, fixedsize: false, size: 20 });
        arrow.Render(canvas);

        text = new xplore.Canvas2DGraphics.Text(this.fy, this.x, y);
        text.Render(canvas);
    }
};


//Dimensions

structuregraphics.Dimensions = function () {
    this.items = [];
};

let xdimensions = structuregraphics.Dimensions.prototype;

xdimensions.Add = function (dimension) {
    this.items.push(dimension);
};

xdimensions.Remove = function (dimension) {
};

xdimensions.Render = function (canvas) {
    for (let item of this.items) {
        item.Render(canvas);
    }
};
