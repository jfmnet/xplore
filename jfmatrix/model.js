var structuremodel = function () {
    xplore.Canvas2DModel.call(this);

    this.model = {
        nodes: [],
        members: [],
        supports: [],
        nodalloads: [],
        memberloads: []
    };

    this.InitializeMesh();
};

structuremodel.prototype = Object.create(xplore.Canvas2DModel.prototype);
structuremodel.constructor = structuremodel;

let xmodel = structuremodel.prototype;

xmodel.InitializeMesh = function () {
    this.mesh = {
        nodes: new structuregraphics.Nodes(),
        members: new structuregraphics.Members(),
        supports: new structuregraphics.Supports(),
        nodalloads: [],
        memberloads: [],
        dimensions: new structuregraphics.Dimensions()
    };
};

xmodel.Render = function (canvas) {
    //Dimensions
    this.mesh.dimensions.Render(canvas);

    //Members
    this.mesh.members.Render(canvas);

    //Supports
    this.mesh.supports.Render(canvas);

    //Nodes
    this.mesh.nodes.Render(canvas);
};

xmodel.GenerateMesh = function () {
    this.InitializeMesh();

    let id = 1;
    let node1;
    let node2;

    //Nodes
    for (let item of this.model.nodes) {
        this.mesh.nodes.Add(new structuregraphics.Node(item.x, item.y));
    }

    //Members
    for (let item of this.model.members) {
        node1 = this.model.nodes[item.node1];
        node2 = this.model.nodes[item.node2];

        this.mesh.members.Add(new structuregraphics.Member(node1.x, node1.y, node2.x, node2.y, id++));
    }

    //Supports
    for (let item of this.model.nodes) {
        this.mesh.supports.Add(new structuregraphics.Support(item.x, item.y));
    }

    //Dimensions
    for (let item of this.model.members) {
        node1 = this.model.nodes[item.node1];
        node2 = this.model.nodes[item.node2];

        this.mesh.dimensions.Add(new xplore.Canvas2DGraphics.DimensionLine(node1.x, node1.y, node2.x, node2.y, undefined, -0.5));
    }
};

xmodel.BeamWizard = function (data) {
    this.model = {
        nodes: [],
        members: [],
        supports: [],
        nodalloads: [],
        memberloads: []
    };

    let xo = 0;
    let yo = 0;

    let x = 0;
    let id = 0;

    for (let row of data) {
        if (x === 0) {
            this.model.nodes.push({
                x: xo + x,
                y: yo
            });
        }

        x += parseFloat(row[1]);

        this.model.nodes.push({
            x: xo + x,
            y: yo
        });

        this.model.members.push({
            node1: id,
            node2: id + 1,
        });

        id++;
    }

    this.GenerateMesh();
};


//Analyze
xmodel.Analyze = function () {
    let nodes = this.mesh.nodes.Write();

    xplore.SaveFile(nodes, "model.3dd");
};