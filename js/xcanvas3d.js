xplore.Canvas3D = function (param) {
    xplore.call(this, param, undefined, "canvas");

    this.camera;
    this.aspect = window.innerWidth / window.innerHeight;
    this.cameratype = 0;    //0 - Perspective; 1 - Orthographic
    this.orthosize = 1000;
    this.backcolor = 0x000000;

    //Model
    this.model = new xplore.Canvas3DModel();

    let self = this;

    window.addEventListener('resize', function () {
        self.Resize();
    }, false);
};

let canvas = xplore.Initialize(xplore.Canvas3D);

canvas.Refresh = function () {
    let self = this;

    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.scene = new THREE.Scene();

    this.InitializeCamera();
    this.InitializeRenderer();
    this.InitializeLight();

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', function () { self.Update(); });

    this.Resize();
};

canvas.InitializeCamera = function () {
    switch (this.cameratype) {
        case 0:
            this.camera = new THREE.PerspectiveCamera(50, 0.5 * this.aspect, 1, 10000);
            this.camera.position.x = 2;
            this.camera.position.y = 2;
            this.camera.position.z = 2;
            this.camera.up.set(0, 0, 1);

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

canvas.InitializeLight = function () {
    this.scene.add(new THREE.AmbientLight(0x444444));

    let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);

    let light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(0, - 1, 0);
    this.scene.add(light2);
};


//Resize

canvas.Resize = function () {
    this.canvas.innerWidth = this.object.offsetWidth;
    this.canvas.innerHeight = this.object.offsetHeight;

    this.aspect = window.innerWidth / window.innerHeight;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
};


//Model

canvas.Add = function (object) {
    this.scene.add(object);
};

canvas.Clear = function () {
    this.scene.geometries = [];
};


//Render

canvas.Render = function () {
    this.model.Render(this);
    this.Update();
};

canvas.Update = function () {
    this.renderer.render(this.scene, this.camera);
};