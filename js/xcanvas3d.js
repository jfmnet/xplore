xplore.Canvas3D = function (param) {
    xplore.call(this, param, undefined, "canvas");

    this.canvas;
    this.engine;
    this.scene;
};

xplore.Canvas3D.prototype = Object.create(xplore.prototype);
xplore.Canvas3D.constructor = xplore.Canvas3D;

xplore.Canvas3D.prototype.Refresh = function () {
    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.object.appendChild(this.canvas);

    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    this.scene = new BABYLON.Scene(this.engine);

    this.InitializeCamera(this.scene, this.canvas);
    this.InitializeLight(this.scene);

    let self = this;

    this.engine.runRenderLoop(function () {
        if (self.scene) {
            self.scene.render();
        }
    });
};

xplore.Canvas3D.prototype.InitializeCamera = function (scene, canvas) {
    // This creates and positions a free camera (non-mesh)
    let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.5, 20, new BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.upVector.x = 0;
    camera.upVector.y = 0;
    camera.upVector.z = 1;

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // Set zoom speed
    camera.wheelPrecision = 50;
};

xplore.Canvas3D.prototype.InitializeLight = function (scene) {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
};


//Resize

xplore.Canvas3D.prototype.Resize = function () {
};


//Model

xplore.Canvas3D.prototype.Clear = function () {
    this.scene.geometries = [];
};


//Draw

xplore.Canvas3D.prototype.DrawLine = function () {
    let points = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 1, 1),
        new BABYLON.Vector3(0, 1, 0)
    ];

    let lines = BABYLON.MeshBuilder.CreateLines("lines", { points: points }, scene);
};

xplore.Canvas3D.prototype.DrawBox = function (material, width, height, depth) {
    if (height === undefined) {
        height = width;
        depth = width;
    }

    let box = BABYLON.MeshBuilder.CreateBox("box", { height: height, width: width, depth: depth }, this.scene);
    box.material = material;
};

xplore.Canvas3D.prototype.DrawMesh = function (positions, indices, normals, colors) {
    let mesh = new BABYLON.Mesh("mesh", this.scene);
    let vertex = new BABYLON.VertexData();

    vertex.positions = positions;
    vertex.indices = indices;
    vertex.normals = normals;
    //vertex.colors = colors;

    vertex.applyToMesh(mesh, true);
    let material = this.StandardMaterial(1, 1, 0);

    mesh.material = material;
    //mesh.material.backFaceCulling = false;
    mesh.material.twoSidedLighting  = true;
};

xplore.Canvas3D.prototype.Sphere = function () {
    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, diameterX: 3 }, scene);
};

xplore.Canvas3D.prototype.Plane = function () {
    let plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 5, height: 2 }, scene);
};

xplore.Canvas3D.prototype.Ground = function () {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 4, subdivisions: 4 }, scene);
};

//Materials

xplore.Canvas3D.prototype.StandardMaterial = function (r, g, b) {
    var material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseColor = new BABYLON.Color3(r, g, b);

    return material;
};