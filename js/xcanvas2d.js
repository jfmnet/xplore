xplore.Canvas2D = function (param) {
    xplore.call(this, param, undefined, "canvas2d");

    this.gridvalue = { x: 1, y: 1 };
    this.middle = { x: 0, y: 0 };
    this.gridsize = 100;
    this.rulersize = 30;
    this.width = 100;
    this.height = 100;

    this.canvas;
    this.context;
};

xplore.Canvas2D.prototype = Object.create(xplore.prototype);
xplore.Canvas2D.constructor = xplore.Canvas2D;

xplore.Canvas2D.prototype.Refresh = function () {
    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.object.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.Resize();
};

xplore.Canvas2D.prototype.Resize = function () {
    this.top = this.object.offsetTop;
    this.left = this.object.offsetLeft;

    this.width = this.parent.clientWidth;
    this.height = this.parent.clientHeight;

    if (!this.height) {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.UpdateCenter();
    this.UpdateCanvasScaleRatio();
};

xplore.Canvas2D.prototype.UpdateCenter = function () {
    this.center = {
        x: this.rulersize + Math.round((this.width - this.rulersize) / 2),
        y: this.rulersize + Math.round((this.height - this.rulersize) / 2)
    };
};



//Draw
xplore.Canvas2D.prototype.PrimitiveLine = function () {
};

xplore.Canvas2D.prototype.PrimitiveCircle = function () {
};

xplore.Canvas2D.prototype.PrimitiveArc = function () {
};

xplore.Canvas2D.prototype.PrimitiveRectangle = function () {
};

xplore.Canvas2D.prototype.DrawLine = function () {
};

xplore.Canvas2D.prototype.DrawCircle = function () {
};

xplore.Canvas2D.prototype.DrawRectangle = function () {
};

xplore.Canvas2D.prototype.DrawPolyline = function () {
};

xplore.Canvas2D.prototype.DrawPolygon = function () {
};


//Events