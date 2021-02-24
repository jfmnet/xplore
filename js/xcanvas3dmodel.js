xplore.Canvas3DModel = function () {
    this.list = [];
};

xplore.Canvas3DModel.constructor = xplore.Canvas3DModel;

let canvas3Dmodel = xplore.Canvas3DModel.prototype;

canvas3Dmodel.Add = function (object) {
    this.list.push(object);
};

canvas3Dmodel.Clear = function () {
    this.list = [];
};

canvas3Dmodel.Render = function (canvas) {
    let object = new THREE.Object3D();

    for (let item of this.list) {
        item.Render(canvas, object);
    }

    canvas.Add(object);
};