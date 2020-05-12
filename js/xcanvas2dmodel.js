xplore.CANVASACTIONS = {
    SELECT: 1,
    DRAW: 2,
    PAN: 3
};

xplore.Canvas2DModel = function () {
    this.list = [];
    this.action = xplore.CANVASACTIONS.PAN;
};

xplore.Canvas2DModel.constructor = xplore.Canvas2DModel;

let canvasmodel = xplore.Canvas2DModel.prototype;

//Draw

canvasmodel.Draw = function (drawobject) {
    this.action = xplore.CANVASACTIONS.DRAW;
    this.drawobject = drawobject;
    this.downcount = 0;
};


//Render

canvasmodel.Render = function (canvas) {
    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Render(canvas);
    }
};


//List

canvasmodel.Add = function (object) {
    this.list.push(object);
};

canvasmodel.Clear = function () {
};


//Events

canvasmodel.KeyDown = function (event) {
};

canvasmodel.KeyUp = function (event) {
};

canvasmodel.MouseDown = function (canvas, mouse, button) {
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            //Store buffer
            canvas.StoreBuffer();

            if (button === 1) {
                this.downcount++;

                let point = this.Snap(canvas, mouse.down);

                if (this.downcount === 1) {
                    this.draw = new this.drawobject(point);

                    if (this.draw.action === 1) {
                        this.Add(this.draw);
                        delete this.draw;
                        this.downcount = 0;
                        canvas.Render();
                    }

                } else {
                    this.draw.Update(point);
                    this.Add(this.draw);

                    delete this.draw;
                    this.downcount = 0;
                    canvas.Render();

                    //Store buffer for the next drawing
                    canvas.StoreBuffer();
                }

                this.UpdatePoints();
            }

            break;

        case xplore.CANVASACTIONS.SELECT:
        case xplore.CANVASACTIONS.WINDOWZOOM:
            if (button === 1)
                canvas.StoreBuffer();

            break;
    }
};

canvasmodel.MouseMove = function (canvas, mouse, button) {
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

canvasmodel.MouseUp = function (canvas, mouse, button) {
    switch (button) {
        case 1: //Left Button
            this.HandleMouseUpLeftButton(canvas, mouse);
            break;

        case 2: //Middle Button
            this.HandleMouseUpMiddleButton(canvas, mouse);
            break;

        case 3: //Right Button
            this.HandleMouseUpRightButton(canvas, mouse);
            break;
    }
};

canvasmodel.MouseWheel = function (canvas, mouse, button) {
};


//Mousemove

canvasmodel.HandleMouseMoveNoButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            let point = this.Snap(canvas, mouse.current);

            canvas.RestoreBuffer();

            //Drawing guide
            if (canvas.settings.showsnapguide && this.drawobject && this.snappoint) {
                let x = canvas.ToCoordX(this.snappoint.x);
                let y = canvas.ToCoordY(this.snappoint.y);

                canvas.PrimitiveLine(x, 0, x, canvas.height, "#008", 1, [2, 2]);
                canvas.PrimitiveLine(0, y, canvas.width, y, "#008", 1, [2, 2]);

                let count = canvas.gridinterval.CountDecimals();

                if (count > 10) {
                    canvas.gridinterval = parseFloat(canvas.gridinterval.toFixed(10));
                    count = canvas.gridinterval.CountDecimals();
                }

                let textx = this.snappoint.x.toFixed(count);
                let texty = this.snappoint.y.toFixed(count);

                canvas.PrimitiveText(textx + ", " + texty, x + 10, y - 10, "normal 12px arial", "#FFF", 0, "left", "bottom");
            }

            if (this.draw) {
                this.draw.Update(point);
                canvas.SetProperties(this.draw.properties);
                this.draw.Render(canvas);
            }
            break;
    }
};

canvasmodel.HandleMouseMoveLeftButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.PAN:
            this.Pan(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.SELECT:
        case xplore.CANVASACTIONS.WINDOWZOOM:
            if (canvas.settings.allowselect)
                this.SelectWindow(canvas, mouse);
            break;

        case xplore.CANVASACTIONS.DRAW:
            break;
    }
};

canvasmodel.HandleMouseMoveMiddleButton = function (canvas, mouse, button) {
};

canvasmodel.HandleMouseMoveRightButton = function (canvas, mouse) {
    this.Pan(canvas, mouse);
};


//Mouseup

canvasmodel.HandleMouseUpLeftButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.PAN:
            //Store buffer
            canvas.StoreBuffer();

            break;

        case xplore.CANVASACTIONS.SELECT:
        case xplore.CANVASACTIONS.WINDOWZOOM:
            if (canvas.settings.allowselect) {
                if (Math.abs(mouse.rawdown.x - mouse.rawcurrent.x) <= 5 && Math.abs(mouse.rawdown.y - mouse.rawcurrent.y) <= 5) {
                    if (this.SelectByPoint)
                        this.SelectByPoint(canvas, mouse);
                } else {
                    if (this.SelectByRectangle)
                        this.SelectByRectangle(canvas, mouse);
                }

                canvas.Render();
            }

            break;
    }
};

canvasmodel.HandleMouseUpMiddleButton = function (canvas, mouse) {
};

canvasmodel.HandleMouseUpRightButton = function (canvas, mouse) {
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            //Store buffer
            canvas.StoreBuffer();
            break;
    }
};



canvasmodel.Pan = function (canvas, mouse) {
    if (canvas.settings.allowpan) {
        let x = mouse.rawcurrent.x - mouse.rawprevious.x;
        let y = mouse.rawprevious.y - mouse.rawcurrent.y;

        if (!(x === 0 && y === 0)) {
            canvas.Pan(x, y);
            canvas.Render();
        }
    }
};

canvasmodel.Snap = function (canvas, mouse) {
    let point;

    if (canvas.settings.snaptogrid) {
        point = this.SnapOnGrid(canvas, mouse);
    }

    let snappoint = this.SnapOnPoint(canvas, mouse);

    if (snappoint) {
        if (point) {
            let line1 = new xplore.canvasentity.Line2F(mouse.x, mouse.y, point.x, point.y);
            let line2 = new xplore.canvasentity.Line2F(mouse.x, mouse.y, snappoint.x, snappoint.y);

            if (line2.length < line1.length)
                point = snappoint;
        } else
            point = snappoint;
    }

    snappoint = this.SnapOnIntersection(canvas, mouse);

    if (snappoint) {
        if (point) {
            let line1 = new xplore.canvasentity.Line2F(mouse.x, mouse.y, point.x, point.y);
            let line2 = new xplore.canvasentity.Line2F(mouse.x, mouse.y, snappoint.x, snappoint.y);

            if (line2.length < line1.length)
                point = snappoint;
        } else
            point = snappoint;
    }

    if (!point)
        point = mouse;

    this.snappoint = point;
    return point;
};

canvasmodel.SnapOnGrid = function (canvas, mouse) {
    return {
        x: xplore.Round(mouse.x, canvas.gridinterval),
        y: xplore.Round(mouse.y, canvas.gridinterval),
    }
};

canvasmodel.UpdatePoints = function () {
};

canvasmodel.SnapOnPoint = function (canvas, mouse) {
};

canvasmodel.SnapOnIntersection = function (canvas, mouse) {
};

canvasmodel.SelectWindow = function (canvas, mouse) {
    canvas.RestoreBuffer();
    canvas.SelectRectangle(
        mouse.rawdown.x,
        mouse.rawdown.y,
        mouse.rawcurrent.x - mouse.rawdown.x,
        mouse.rawcurrent.y - mouse.rawdown.y,
        "#2196F3"
    );
};
