xplore.Canvas3D = function (param) {
    xplore.call(this, param, undefined, "canvas3d");
};

xplore.Canvas3D.prototype = Object.create(xplore.prototype);
xplore.Canvas3D.constructor = xplore.Canvas3D;

xplore.Canvas2D.prototype.Refresh = function () {
    let scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    let camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
};

xplore.Canvas2D.prototype.Resize = function () {
};

//Draw
xplore.Canvas2D.prototype.DrawLine = function () {
    var points = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 1, 1),
        new BABYLON.Vector3(0, 1, 0)
    ];

    let lines = BABYLON.MeshBuilder.CreateLines("lines", {points: points}, scene);
};

xplore.Canvas2D.prototype.DrawBox = function () {
    let box = BABYLON.MeshBuilder.CreateBox("box", { height: 5, width: 2, depth: 0.5 }, scene);
};

xplore.Canvas2D.prototype.Sphere = function () {
    let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, diameterX: 3}, scene);
};

xplore.Canvas2D.prototype.Plane = function () {
    let plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 5, height: 2}, scene);
};

xplore.Canvas2D.prototype.Ground = function () {
    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 4, subdivisions: 4}, scene);
};
