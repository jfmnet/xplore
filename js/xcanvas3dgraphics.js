xplore.Canvas3DGraphics = function (param) {
    this.x = param.x || 0;
    this.y = param.y || 0;
    this.z = param.z || 0;
    this.align = param.align || new THREE.Vector3(0, 0, 0);
    this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x111111 });

    if (param.material !== undefined)
        this.material = param.material;
};

xplore.Canvas3DGraphics.Initialize = function (object) {
    object.prototype = Object.create(xplore.Canvas3DGraphics.prototype);
    object.constructor = object;

    return object.prototype;
};

xplore.Canvas3DGraphics.constructor = xplore.Canvas3DGraphics;

let canvasgraphics = xplore.Canvas3DGraphics.prototype;
canvasgraphics.axis = new THREE.Vector3(0, 1, 0);

canvasgraphics.AlignMove = function (mesh) {
    if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0) {
        mesh.up = new THREE.Vector3(0, 0, 1);
        mesh.lookAt(this.align);
    }

    if (this.x !== 0 || this.y !== 0 || this.z !== 0)
        mesh.position.copy(new THREE.Vector3(this.x, this.y, this.z));
};

canvasgraphics.Render = function (canvas, object) {
    let mesh = this.Generate(canvas);
    this.AlignMove(mesh);
    object.add(mesh);
};


//Line Segments

xplore.Canvas3DGraphics.LineSegments = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    let color = 0xffffff;
    let opacity = 1;

    if (param.color !== undefined)
        color = param.color;

    if (param.opacity !== undefined)
        opacity = param.opacity;

    if (param.points !== undefined)
        this.points = param.points;

    this.material = new THREE.LineBasicMaterial({ color: color, opacity: opacity });
};

let linesegments = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.LineSegments);

linesegments.Generate = function () {
    let geometry = new THREE.BufferGeometry();
    let vertices = [];

    for (let point of this.points) {
        vertices.push(point.x, point.y, point.z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return new THREE.LineSegments(geometry, this.material);
};


//Box

xplore.Canvas3DGraphics.Box = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.width = param.width || 1;
    this.height = param.height || this.width;
    this.depth = param.depth || this.width;
};

let box = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.Box);

box.Generate = function () {
    let geometry = new THREE.BoxBufferGeometry(this.width, this.height, this.depth);
    return new THREE.Mesh(geometry, this.material);
};


//Sphere

xplore.Canvas3DGraphics.Sphere = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.radius = param.radius || 1;
};

let sphere = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.Sphere);

sphere.Generate = function () {
    let geometry = new THREE.IcosahedronBufferGeometry(this.radius, 8);
    return new THREE.Mesh(geometry, this.material);
};


//Cylinder

xplore.Canvas3DGraphics.Cylinder = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.topradius = param.topradius || 0;
    this.bottomradius = param.bottomradius || 1;
    this.height = param.height || 1;
    this.segments = param.segments || 8;
};

let cylinder = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.Cylinder);

cylinder.Generate = function () {
    let geometry = new THREE.CylinderBufferGeometry(this.topradius, this.bottomradius, this.height, this.segments);
    return new THREE.Mesh(geometry, this.material);
};

cylinder.AlignMove = function (mesh) {
    if (this.align.x !== 0 || this.align.y !== 0 || this.align.z !== 0)
        mesh.quaternion.setFromUnitVectors(this.axis, this.align);

    if (this.x !== 0 || this.y !== 0 || this.z !== 0)
        mesh.position.copy(new THREE.Vector3(this.x, this.y, this.z));
};


//Grid

xplore.Canvas3DGraphics.UniformGridXY = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.x1 = param.x1 || 0;
    this.y1 = param.y1 || 0;
    this.z1 = param.z1 || 0;

    this.x2 = param.x2 || 0;
    this.y2 = param.y2 || 0;
    this.z2 = param.z2 || 0;

    this.interval = param.interval || 1;
};

let grid = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.UniformGridXY);

grid.Generate = function () {
    let points = [];
    let color = 0x222222;

    for (let x = this.x1; x <= this.x2; x += this.interval) {
        points.push({
            x: x,
            y: this.y1,
            z: this.z
        });

        points.push({
            x: x,
            y: this.y2,
            z: this.z
        });
    }

    for (let y = this.y1; y <= this.y2; y += this.interval) {
        points.push({
            x: this.x1,
            y: y,
            z: this.z
        });

        points.push({
            x: this.x2,
            y: y,
            z: this.z
        });
    }

    let lines = new xplore.Canvas3DGraphics.LineSegments({
        points: points,
        color: color
    });
    return lines.Generate();
};

//Axis

xplore.Canvas3DGraphics.Axis = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.size = param.size || 0;
};

let axis = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.Axis);

axis.Generate = function (canvas) {
    let radius = this.size / 20;
    let height = this.size / 5;

    let thickness = this.size / 50;
    let halfthick = thickness / 2;
    let mid = this.size / 2;

    let object = new THREE.Object3D();
    let red = new THREE.MeshPhongMaterial({ color: 0x880000, emissive: 0x111111 })
    let green = new THREE.MeshPhongMaterial({ color: 0x088000, emissive: 0x111111 })
    let blue = new THREE.MeshPhongMaterial({ color: 0x000088, emissive: 0x111111 })

    let x = new xplore.Canvas3DGraphics.Cylinder({
        x: this.size,
        y: 0,
        z: 0,
        topradius: 0,
        bottomradius: radius,
        height: height,
        segments: 8,
        align: new THREE.Vector3(1, 0, 0),
        material: red
    });

    x.Render(canvas, object);

    x = new xplore.Canvas3DGraphics.Box({
        x: mid + halfthick,
        y: 0,
        z: 0,
        width: thickness,
        height: thickness,
        depth: this.size,
        align: new THREE.Vector3(1, 0, 0),
        material: red
    });

    x.Render(canvas, object);

    let y = new xplore.Canvas3DGraphics.Cylinder({
        x: 0,
        y: this.size,
        z: 0,
        topradius: 0,
        bottomradius: radius,
        height: height,
        segments: 8,
        align: new THREE.Vector3(0, 1, 0),
        material: green
    });

    y.Render(canvas, object);

    y = new xplore.Canvas3DGraphics.Box({
        x: 0,
        y: mid + halfthick,
        z: 0,
        width: thickness,
        height: thickness,
        depth: this.size,
        align: new THREE.Vector3(0, 1, 0),
        material: green
    });

    y.Render(canvas, object);

    let z = new xplore.Canvas3DGraphics.Cylinder({
        x: 0,
        y: 0,
        z: this.size,
        topradius: 0,
        bottomradius: radius,
        height: height,
        segments: 8,
        align: new THREE.Vector3(0, 0, 1),
        material: blue
    });

    z.Render(canvas, object);

    z = new xplore.Canvas3DGraphics.Box({
        x: 0,
        y: 0,
        z: mid - halfthick,
        width: thickness,
        height: thickness,
        depth: this.size,
        align: new THREE.Vector3(0, 0, 1),
        material: blue
    });

    z.Render(canvas, object);

    object.position = new THREE.Vector3(this.x, this.y, this.z);

    return object;
};


//Cylinder

xplore.Canvas3DGraphics.ExtrudedSection = function (param) {
    xplore.Canvas3DGraphics.call(this, param);

    this.section = param.section || {};
    this.start = param.start || {};
    this.end = param.end || {};
};

let extrude = xplore.Canvas3DGraphics.Initialize(xplore.Canvas3DGraphics.ExtrudedSection);

extrude.Extrude = function (points, shapepoints) {
    let spline = new THREE.CatmullRomCurve3();
    let settings = {
        steps: 1,
        bevelEnabled: false,
    };

    spline.points = points;
    settings.extrudePath = spline;

    let shape = new THREE.Shape(shapepoints);
    return new THREE.ExtrudeBufferGeometry(shape, settings);
};

extrude.Generate = function (canvas) {
    let line = [
        new THREE.Vector3(this.start.x, this.start.y, this.start.z),
        new THREE.Vector3(this.end.x, this.end.y, this.end.z),
    ];

    let geometry = canvas.Extrude(line, this.section);
    let mesh = new THREE.Mesh(geometry, this.material);

    return mesh;
};