xplore.CANVASACTIONS = {
    SELECT: 1,
    DRAW: 2,
    PAN: 3
};

xplore.Canvas2DModel = function () {
    this.list = [];
    this.action = xplore.CANVASACTIONS.PAN;
};


//Draw

xplore.Canvas2DModel.prototype.Draw = function (drawobject) {
    this.action = xplore.CANVASACTIONS.DRAW;
    this.drawobject = drawobject;
    this.downcount = 0;
};


//Render

xplore.Canvas2DModel.prototype.Render = function (canvas) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }

    if (this.draw)
        this.draw.Render(canvas);
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
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            if (button === 1) {
                this.downcount++;

                let point = this.Snap(canvas, mouse.down);

                if (this.downcount === 1) {
                    this.draw = new this.drawobject(point);
    
                } else {
                    this.Add(this.draw);
    
                    delete this.draw;
                    this.downcount = 0;
                }
            }
        }
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
            if (this.draw) {
                let point = this.Snap(canvas, mouse.current);
                this.draw.Update(point);
                canvas.Render();
            }
            break;
    }
};

xplore.Canvas2DModel.prototype.HandleMouseMoveLeftButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.PAN:
            this.Pan(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.SELECT:
        case xplore.CANVASACTIONS.WINDOWZOOM:
            if (canvas.settings.ALLOWSELECT)
                this.Select(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.DRAW:
            break;
    }
};

xplore.Canvas2DModel.prototype.HandleMouseMoveMiddleButton = function (canvas, mouse, button) {
};

xplore.Canvas2DModel.prototype.HandleMouseMoveRightButton = function (canvas, mouse) {
    this.Pan(canvas, mouse);
};

xplore.Canvas2DModel.prototype.Pan = function (canvas, mouse) {
    if (canvas.settings.allowpan) {
        let x = mouse.rawcurrent.x - mouse.rawprevious.x;
        let y = mouse.rawprevious.y - mouse.rawcurrent.y;

        if (!(x === 0 && y === 0)) {
            canvas.Pan(x, y);
            canvas.Render();
        }
    }
};

xplore.Canvas2DModel.prototype.Snap = function (canvas, mouse) {
    let point;

    if (canvas.settings.snaptogrid) {
        point = this.SnapToGrid(canvas, mouse);

    } else {
        return mouse;
    }

    return point;
};

xplore.Canvas2DModel.prototype.SnapToGrid = function (canvas, mouse) {
    return {
        x: xplore.Round(mouse.x, canvas.gridinterval),
        y: xplore.Round(mouse.y, canvas.gridinterval),
    }
};