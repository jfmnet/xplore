xplore.Canvas3D = function (param) {
    xplore.call(this, param, undefined, "canvas");

    this.camera;
    this.aspect = window.innerWidth / window.innerHeight;
    this.cameratype = 0;    //0 - Perspective; 1 - Orthographic
    this.orthosize = 1000;
    this.backcolor = 0x000000;

    let self = this;

    window.addEventListener('resize', function () {
        self.Resize();
    }, false);
};

let canvas = xplore.Initialize(xplore.Canvas3D);

canvas.Refresh = function () {
    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");

    this.InitializeCamera();
    this.InitializeRenderer();
    this.Resize();
};

canvas.InitializeCamera = function () {
    switch (this.cameratype) {
        case 0:
            this.camera = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 1, 10000);
            this.camera.position.z = 2500;
            break;

        case 1:
            this.camera = new THREE.OrthographicCamera(0.5 * this.orthosize * this.aspect / - 2, 0.5 * this.orthosize * this.aspect / 2, this.orthosize / 2, this.orthosize / - 2, 150, 1000);
            break;
    }
};

canvas.InitializeRenderer = function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setClearColor(this.backcolor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.object.appendChild(this.renderer.domElement);
};

canvas.InitializeLight = function (scene) {
};


//Resize

canvas.Resize = function () {
    this.canvas.innerWidth = this.object.offsetWidth;
    this.canvas.innerHeight = this.object.offsetHeight;

    this.aspect = window.innerWidth / window.innerHeight;
    this.aspect = this.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
};


//Model

canvas.Clear = function () {
    this.scene.geometries = [];
};