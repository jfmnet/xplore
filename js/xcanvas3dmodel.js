xplore.Canvas3DModel = function () {
    this.list = [];
};

xplore.Canvas3DModel.constructor = xplore.Canvas3DModel;

let canvasmodel = xplore.Canvas3DModel.prototype;

canvasmodel.Add = function (object) {
    this.list.push(object);
};

canvasmodel.Clear = function () {
    this.list = [];
};

canvasmodel.Render = function (canvas) {
    let object = new THREE.Object3D();

    for (let item of this.list) {
        item.Render(object);
    }

    canvas.Add(object);
};