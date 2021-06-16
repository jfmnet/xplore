xplore.Canvas3D = function (param) {
    xplore.call(this, param, undefined, "canvas");

    param = param || {};
    this.camera;
    this.aspect = window.innerWidth / window.innerHeight;
    this.cameratype = 0;    //0 - Perspective; 1 - Orthographic
    this.orthosize = 1000;
    this.backcolor = "#182024";
    this.showtoolbar = param.showtoolbar;

    this.closedspline = new THREE.CatmullRomCurve3();
    this.extrudesettings = {
        steps: 1,
        bevelEnabled: false,
        extrudePath: this.closedspline
    };


    //Model
    this.model = new xplore.Canvas3DModel();

    let self = this;

    window.addEventListener('resize', function () {
        self.Resize();
        self.Render();
    }, false);
};

let xcanvas3d = xplore.Initialize(xplore.Canvas3D);

xcanvas3d.Refresh = function () {
    let self = this;

    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.scene = new THREE.Scene();

    this.InitializeCamera();
    this.InitializeRenderer();
    this.InitializeLight();

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', function () { self.Update(); });

    setTimeout(function() {
        self.Resize();
        self.Render();
        clearTimeout();
    }, 10);

    self.Resize();
    self.Render();
    self.ShowToolbar();
};

xcanvas3d.InitializeCamera = function () {
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

xcanvas3d.InitializeRenderer = function () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.setClearColor(this.backcolor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.object.appendChild(this.renderer.domElement);
};

xcanvas3d.InitializeLight = function () {
    this.scene.add(new THREE.AmbientLight(0x444444));

    let light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(75, 100, 100);
    this.scene.add(light1);

    let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-100, -75, 50);
    this.scene.add(light2);
};

xcanvas3d.ShowToolbar = function () {
    if (this.showtoolbar) {
        let toolbar = new xplore.Toolbar();
        let self = this;

        // toolbar.Add(new xplore.Button({
        //     icon: "magnify-plus-outline",
        //     onclick: function () {
        //         self.ZoomIn();
        //     }
        // }));

        // toolbar.Add(new xplore.Button({
        //     icon: "magnify-minus-outline",
        //     onclick: function () {
        //         self.ZoomOut();
        //     }
        // }));

        toolbar.Add(new xplore.Button({
            icon: "magnify-scan",
            onclick: function () {
                self.ZoomAll();
            }
        }));

        toolbar.Show(this.object);
    }
};

//Resize

xcanvas3d.Resize = function () {  
    this.canvas.innerWidth = this.object.offsetWidth;
    this.canvas.innerHeight = this.object.offsetHeight;

   // Sumet: fix the aspect
    this.aspect = this.canvas.innerWidth / this.canvas.innerHeight;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvas.innerWidth, this.canvas.innerHeight);
};


//Model

xcanvas3d.Add = function (object) {
    this.scene.add(object);
};

xcanvas3d.Clear = function () {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
        if (this.scene.children[i].type === "Object3D" || this.scene.children[i].type === "Mesh") {
            this.scene.children.splice(i, 1);
        }        
    }
};


//Render

xcanvas3d.Render = function () {
    this.model.Render(this);
    this.Update();
};

xcanvas3d.Update = function () {
    this.renderer.render(this.scene, this.camera);
};


xcanvas3d.Extrude = function (points, shapepoints) {
    this.closedspline.points = points;

    let shape = new THREE.Shape(shapepoints);
    return new THREE.ExtrudeBufferGeometry(shape, this.extrudesettings);
};

//Zoom

xcanvas3d.ZoomAll = function (noresize) {
    if (!noresize)
        this.Resize();

    let obj = this.scene;
    let bounds = new THREE.Box3().setFromObject(obj);

    let x = bounds.max.x - bounds.min.x;
    let y = bounds.max.y - bounds.min.y;
    let z = bounds.max.z - bounds.min.z;

    let bx = (bounds.max.x + bounds.min.x) / 2;
    let by = (bounds.max.y + bounds.min.y) / 2;
    let bz = (bounds.max.z + bounds.min.z) / 2;

    let center = new THREE.Vector3(bx, by, bz);
    obj.center = center;

    let boundingSphere = bounds.getBoundingSphere(obj);
    let radius = boundingSphere.radius * 1.10;

    if (this.canvas.height > this.canvas.width)
        radius *= this.canvas.height / this.canvas.width;

    let len = radius / (Math.sin(this.camera.fov * Math.PI / 180));
    this.camera.position.set(center.x - len, center.y - len, center.z + len);

    this.camera.lookAt(center);
    this.controls.target.set(center.x, center.y, center.z);

    this.camera.updateProjectionMatrix();
    this.controls.update();
};
xcanvas3d.ZoomIn = function () {
    this.control.dollyIn(1.1);
    this.control.Refresh();
};

xcanvas3d.ZoomOut = function () {
    this.control.dollyOut(1.1);
    this.control.Refresh();
};