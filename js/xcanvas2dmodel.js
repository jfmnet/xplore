xplore.CANVASACTIONS = {
    SELECT: 1,
    DRAW: 2,
    PAN: 3
};

xplore.Canvas2DModel = function () {
    this.key = "";
    this.list = [];
    this.action = xplore.CANVASACTIONS.SELECT;
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

canvasmodel.Select = function () {
    this.action = xplore.CANVASACTIONS.SELECT;
    delete this.draw;
};

canvasmodel.ClearSelection = function () {
};
canvasmodel.Add = function (object) {
    this.list.push(object);
};

canvasmodel.Clear = function () {
    this.list = [];
};

canvasmodel.Bounds = function () {
    let bounds = new xplore.canvasentity.Bounds2F();

    for (let i = 0; i < this.list.length; i++) {
        this.list[i].Bounds(bounds);
    }

    return bounds;
};


//Events

canvasmodel.KeyDown = function (canvas, event) {
    this.key = event.key;
    this.HandleKeys(canvas);
};

canvasmodel.HandleKeys = function (canvas) {
    switch (this.key) {
        case "Escape":
            this.Select();
            canvas.Render();
            break;
    }
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
                    this.draw = new this.drawobject();
                    this.draw.Add(point);
                    this.draw.Add(point);

                    if (this.draw.action === 1) {
                        this.Add(this.draw);
                        delete this.draw;
                        this.downcount = 0;
                        canvas.Render();
                    }

                } else if (this.downcount >= this.draw.maxpoint) {
                    this.draw.Update(point);
                    this.Add(this.draw);

                    delete this.draw;
                    this.downcount = 0;
                    canvas.Render();

                    //Store buffer for the next drawing
                    canvas.StoreBuffer();
                } else {
                    this.draw.Add(point);
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

                // let count = canvas.gridinterval.CountDecimals();

                // if (count > 10) {
                //     canvas.gridinterval = parseFloat(canvas.gridinterval.toFixed(10));
                //     count = canvas.gridinterval.CountDecimals();
                // }

                let textx = this.snappoint.x.toFixed(3);
                let texty = this.snappoint.y.toFixed(3);

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
    switch (this.action) {
        case xplore.CANVASACTIONS.DRAW:
            let point = this.Snap(canvas, mouse.current);

            if (this.draw) {
                this.draw.Update(point);
                canvas.SetProperties(this.draw.properties);
                this.draw.Render(canvas);
            }

            break;
    }
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
            let x = Math.abs(mouse.rawcurrent.x - mouse.rawprevious.x);
            let y = Math.abs(mouse.rawprevious.y - mouse.rawcurrent.y);

            if (x < 5 && y < 5) {
                if (this.draw && this.downcount >= this.draw.minpoint) {
                    this.draw.EndDrawing();
                    this.Add(this.draw);
                }

                this.downcount = 0;
                canvas.Render();
                delete this.draw;

                //Store buffer for the next drawing
                canvas.StoreBuffer();
            }
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

    if (canvas.settings.snapongrid)
        point = this.SnapOnGrid(canvas, mouse);

    if (canvas.settings.snaponusergrid)
        point = this.SnapOnUserGrid(canvas, mouse, point);

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

canvasmodel.SnapOnUserGrid = function (canvas, mouse, point) {
    point = point || {};

    let x = point.x || mouse.x;
    let y = point.y || mouse.y;
    let interval = canvas.gridinterval;

    for (let grid of canvas.gridx) {
        if (Math.abs(grid - x) < interval) {
            x = grid;
            break;
        }
    }

    for (let grid of canvas.gridy) {
        if (Math.abs(grid - y) < interval) {
            y = grid;
            break;
        }
    }

    if (x !== undefined && y !== undefined)
        return { x: x, y: y };
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
