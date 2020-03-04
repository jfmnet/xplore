xplore.CANVASACTIONS = {
    SELECT: 1,
    DRAW: 2,
    PAN: 3
};

xplore.Canvas2DModel = function () {
    this.list = [];
    this.action = "";
};

//Render

xplore.Canvas2DModel.prototype.Render = function (canvas) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};


//List

xplore.Canvas2DModel.prototype.Add = function (object) {
    this.list.push(object);
};

xplore.Canvas2DModel.prototype.Clear = function () {
};



//Events

xplore.Canvas2DModel.prototype.MouseDown = function (canvas, mouse, button) {
    this.HandleMouseDown(canvas, mouse, button);
};

xplore.Canvas2DModel.prototype.MouseMove = function (canvas, mouse, button) {
    this.HandleMouseMove(canvas, mouse, button);
};

xplore.Canvas2DModel.prototype.MouseUp = function (canvas, mouse, button) {
    this.HandleMouseUp(canvas, mouse, button);
};

xplore.Canvas2DModel.prototype.MouseWheel = function (canvas, mouse, button) {
};


//Events handling
xplore.Canvas2DModel.prototype.HandleMouseDown = function (canvas, mouse, button) {
};

xplore.Canvas2DModel.prototype.HandleMouseMove = function (canvas, mouse, button) {
    switch (button) {
        case 0: //No button
            this.HandleMouseMoveNoButton(canvas, mouse);
            break;

        case 1: //Left Button
            this.HandleMouseMoveLeftButton(canvas, mouse);
            break;

        case 2: //Middle Button
            this.HandleMouseMoveMiddleButton(canvas, mouse);
            break;

        case 3: //Right Button
            this.HandleMouseMoveRightButton(canvas, mouse);
            break;
    }
};

xplore.Canvas2DModel.prototype.HandleMouseUp = function (canvas, mouse, button) {
};

xplore.Canvas2DModel.prototype.HandleMouseMoveNoButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            if (this.drawobject.drawpoints > 1) {
                let factor = units.length.value.value;
                this.drawobject.UpdateLastPoint(mouse.currentsnap.x / factor, mouse.currentsnap.y / factor);

                this.drawobject.Refresh();
                canvas.Invalidate();
            }

            this.snappoint = mouse.currentsnap;
            canvas.Invalidate();
            break;
    }
};

xplore.Canvas2DModel.prototype.HandleMouseMoveLeftButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.PAN:
            if (canvas.settings.ALLOWPAN)
                this.Pan(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.SELECT:
        case xplore.CANVASACTIONS.WINDOWZOOM:
            if (canvas.settings.ALLOWSELECT)
                this.Select(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.DRAW:
            this.ondraw = true;
            let bounds = mouse.ToBounds();
            let factor = units.length.value.value;
            this.snappoint = mouse.currentsnap;
            this.drawobject.Scale(mouse.downsnap.x / factor, mouse.downsnap.y / factor, mouse.currentsnap.x / factor, mouse.currentsnap.y / factor, true);
            canvas.Invalidate();
            break;
    }
};

xplore.Canvas2DModel.prototype.HandleMouseMoveRightButton = function (canvas, mouse) {
    if (canvas.settings.allowpan) {
        canvas.Pan(mouse.rawcurrent.x - mouse.rawprevious.x, mouse.rawprevious.y - mouse.rawcurrent.y);
        canvas.Render();
    }
};