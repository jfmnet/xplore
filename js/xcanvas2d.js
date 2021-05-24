xplore.Canvas2DSettings = function () {
    this.showgrid = true;
    this.showusergrid = true;
    this.showruler = true;
    this.showlabel = false;

    this.allowzoom = true;
    this.allowpan = true;
    this.allowselect = true;

    //Snap
    this.snap = true;
    this.snapongrid = true;
    this.snaponusergrid = true;
    this.showsnapguide = true;

    this.LightTheme = function () {
        this.background = "#FFF";
        this.axis = "#CCC";
        this.major = "#DDD";
        this.minor = "#EEE";
        this.ruler = "#FFF";
        this.rulerposition = 1;     //0 - Outer; 1 - At (0, 0)
        this.rulertext = "#555";
        this.rulerline = "#AAA";
        this.fontcolor = "#000";
    };

    this.DarkTheme = function () {
        this.background = "#000";
        this.axis = "#333";
        this.major = "#222";
        this.minor = "#111";
        this.ruler = "#111";
        this.rulerposition = 1;     //0 - Outer; 1 - At (0, 0)
        this.rulertext = "#888";
        this.rulerline = "#222";
        this.fontcolor = "#000";
        this.gridline = "#880";
    };

    this.DarkTheme();
};

xplore.Canvas2DSettingsModel = function (settings) {
    this.showgrid = new xplore.Checkbox({ text: "Show Grid", value: settings.showgrid, bind: { name: "showgrid", object: settings } });
    this.showusergrid = new xplore.Checkbox({ text: "Show Custom Grid", value: settings.showusergrid, bind: { name: "showusergrid", object: settings } });
    this.showruler = new xplore.Checkbox({ text: "Show Ruler", value: settings.showruler, bind: { name: "showruler", object: settings } });

    this.snapongrid = new xplore.Checkbox({ text: "Snap On Grid", value: settings.snapongrid, bind: { name: "snapongrid", object: settings } });
    this.snaponusergrid = new xplore.Checkbox({ text: "Snap On Custom Grid", value: settings.snaponusergrid, bind: { name: "snaponusergrid", object: settings } });
};

xplore.Mouse = function (c) {
    let canvas = c;
    this.down = { x: 0, y: 0 };
    this.rawdown = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.rawcurrent = { x: 0, y: 0 };
    this.previous = { x: 0, y: 0 };
    this.rawprevious = { x: 0, y: 0 };
    this.delta = 0;

    this.ToPoints = function () {
        return new graphicsentity.Bounds2F(
            canvas.ToPointX(this.down.x),
            canvas.ToPointY(this.down.y),
            canvas.ToPointX(this.current.x),
            canvas.ToPointY(this.current.y),
        );
    }

    this.ToBounds = function () {
        if (this.down.x < this.current.x) {
            if (this.down.y > this.current.y) {
                return new graphicsentity.Bounds2F(
                    canvas.ToPointX(this.down.x),
                    canvas.ToPointY(this.down.y),
                    canvas.ToPointX(this.current.x),
                    canvas.ToPointY(this.current.y),
                );
            }
            else {
                return new graphicsentity.Bounds2F(
                    canvas.ToPointX(this.down.x),
                    canvas.ToPointY(this.current.y),
                    canvas.ToPointX(this.current.x),
                    canvas.ToPointY(this.down.y),
                );
            }
        }
        else {
            if (this.down.y > this.current.y) {
                return new graphicsentity.Bounds2F(
                    canvas.ToPointX(this.current.x),
                    canvas.ToPointY(this.down.y),
                    canvas.ToPointX(this.down.x),
                    canvas.ToPointY(this.current.y),
                );
            }
            else {
                return new graphicsentity.Bounds2F(
                    canvas.ToPointX(this.current.x),
                    canvas.ToPointY(this.current.y),
                    canvas.ToPointX(this.down.x),
                    canvas.ToPointY(this.down.y),
                );
            }
        }
    }
};

xplore.Canvas2D = function (param) {
    xplore.call(this, param, undefined, "canvas");

    param = param || {};

    this.gridvalue = { x: 1, y: 1 };
    this.middle = { x: 0, y: 0 };
    this.gridsize = 100;
    this.gridinterval = 1;
    this.rulersize = 30;
    this.width = 100;
    this.height = 100;
    this.zoomvalue = 1;
    this.showtoolbar = param.showtoolbar;

    this.gridx = [];
    this.gridy = [];
    this.lock = "";

    this.settings = new xplore.Canvas2DSettings();
    this.mouse = new xplore.Mouse();
    this.model = new xplore.Canvas2DModel();

    this.canvas;
    this.context;
};

xplore.Canvas2D.prototype = Object.create(xplore.prototype);
xplore.Canvas2D.constructor = xplore.Canvas2D;

let xcanvas = xplore.Canvas2D.prototype;

xcanvas.Refresh = function () {
    this.object.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("tabindex", 1);
    this.object.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d');

    this.Resize();
    this.Render();
    this.ShowToolbar();

    let self = this;

    window.onresize = function () {
        self.Resize();
        self.Render();
    };

    setTimeout(function () {
        self.Resize();
        self.Render();
        clearTimeout();
    }, 10);

    this.Events();
};

xcanvas.Resize = function () {
    let rect = this.object.getBoundingClientRect();
    this.top = rect.top;
    this.left = rect.left;

    this.width = this.object.clientWidth;
    this.height = this.object.clientHeight;

    if (!this.height) {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.UpdateCenter();
    this.UpdateCanvasScaleRatio();
};

xcanvas.UpdateCenter = function () {
    if (this.settings.showruler && this.settings.rulerposition === 0)
        this.center = {
            x: this.rulersize + Math.round((this.width - this.rulersize) / 2),
            y: this.rulersize + Math.round((this.height - this.rulersize) / 2)
        };
    else
        this.center = {
            x: this.width / 2,
            y: this.height / 2
        };
};

xcanvas.UpdateCanvasScaleRatio = function () {
    let devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
            this.context.mozBackingStorePixelRatio ||
            this.context.msBackingStorePixelRatio ||
            this.context.oBackingStorePixelRatio ||
            this.context.backingStorePixelRatio || 1,
        ratio = devicePixelRatio / backingStoreRatio;

    // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
        let oldWidth = this.width;
        let oldHeight = this.height;

        this.canvas.width = oldWidth * ratio;
        this.canvas.height = oldHeight * ratio;

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        this.context.scale(ratio, ratio);
    }
};

xcanvas.StoreBuffer = function () {
    let self = this;

    this.buffer = this.RenderToCanvas(function (context) {
        self.context = context;
        self.Render();
    });

    this.context = this.canvas.getContext('2d');
};

xcanvas.RestoreBuffer = function () {
    if (!this.buffer)
        this.StoreBuffer();

    this.context.drawImage(this.buffer, 0, 0);
};

xcanvas.RenderToCanvas = function (renderFunction) {
    let canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;

    let context = canvas.getContext('2d');

    renderFunction(context);

    return canvas;
};

xcanvas.ShowToolbar = function () {
    if (this.showtoolbar) {
        let self = this;
        let toolbar = new xplore.Toolbar();

        toolbar.Add(new xplore.Button({
            icon: "magnify-plus-outline",
            onclick: function () {
                self.ZoomIn();
            }
        }));

        toolbar.Add(new xplore.Button({
            icon: "magnify-minus-outline",
            onclick: function () {
                self.ZoomOut();
            }
        }));

        toolbar.Add(new xplore.Button({
            icon: "magnify-scan",
            onclick: function () {
                self.ZoomWindow();
            }
        }));

        toolbar.Add(new xplore.Button({
            icon: "magnify-close",
            onclick: function () {
                self.ZoomAll();
            }
        }));

        toolbar.Add(new xplore.Button({
            icon: "cog-outline",
            onclick: function () {
                self.ShowSettings();
            }
        }));

        toolbar.Show(this.object);
    }
};

//Model

xcanvas.Draw = function (drawobject) {
    this.model.Draw(drawobject);
};

xcanvas.EndDrawing = function () {
    this.model.EndDrawing();
};

xcanvas.Add = function (object) {
    this.model.Add(object);
};

xcanvas.Clear = function () {
    this.model.Clear();
};

//Render

xcanvas.Render = function () {
    //Clear
    this.PrimitiveRectangle(0, 0, this.width, this.height, this.settings.background);

    if (this.settings.showgrid)
        this.DrawGrid();

    this.model.Render(this);

    if (this.settings.showruler)
        this.DrawRuler();

    if (this.settings.showusergrid)
        this.DrawUserGrid();
};

xcanvas.DrawGrid = function () {
    let root = Math.pow(10, Math.round(Math.log(this.gridsize * this.gridvalue.x) / Math.LN10)) / 100;
    let gridinterval = this.gridvalue.x / root;

    let x1 = this.ToCoordX(0);
    let x2 = x1;
    let y1 = this.ToCoordY(0);
    let y2 = y1;

    let axisx = x1;
    let axisy = y1;

    let minorinterval = this.gridsize * gridinterval / 10;
    let majorinterval = minorinterval * 10;

    if (minorinterval < 10) {
        minorinterval *= 10;
        majorinterval *= 10;
    }

    this.gridinterval = this.ToPointWidth(minorinterval);

    this.SetProperties({
        linecolor: this.settings.minor,
        thickness: 1
    });

    //Minor x
    if (minorinterval >= 10) {
        while (x1 > 0 || x2 < this.width) {
            this.PrimitiveLine_2(x1, 0, x1, this.height);
            x1 -= minorinterval;
            x2 += minorinterval;
            this.PrimitiveLine_2(x2, 0, x2, this.height);
        }

        //Minor Y
        while (y1 > 0 || y2 < this.height) {
            this.PrimitiveLine_2(0, y1, this.width, y1);
            y1 -= minorinterval;
            y2 += minorinterval;
            this.PrimitiveLine_2(0, y2, this.width, y2);
        }
    }

    x1 = axisx;
    x2 = x1;
    y1 = axisy;
    y2 = y1;

    this.SetProperties({
        linecolor: this.settings.major
    });

    //Major x
    while (x1 > 0 || x2 < this.width) {
        this.PrimitiveLine_2(x1, 0, x1, this.height);

        x1 -= majorinterval;
        x2 += majorinterval;

        this.PrimitiveLine_2(x2, 0, x2, this.height);
    }

    //Major Y
    while (y1 > 0 || y2 < this.height) {
        this.PrimitiveLine_2(0, y1, this.width, y1);
        y1 -= majorinterval;
        y2 += majorinterval;
        this.PrimitiveLine_2(0, y2, this.width, y2);
    }

    //Axis
    x1 = axisx;
    x2 = x1;
    y1 = axisy;
    y2 = y1;

    this.SetProperties({
        linecolor: this.settings.axis,
        thickness: 2
    });

    this.PrimitiveLine_2(x1, 0, x1, this.height);
    this.PrimitiveLine_2(0, y1, this.width, y1);
};

xcanvas.DrawUserGrid = function () {
    let counter = 0;
    let coord = 7;

    this.SetTextProperties({
        ha: "center",
        va: "middle"
    });

    if (this.gridx.length > 1) {
        let x1, x2, xm;

        for (let i = 0; i < this.gridx.length - 1; i++) {
            x1 = this.ToCoordX(this.gridx[i]);
            x2 = this.ToCoordX(this.gridx[i + 1]);
            xm = (x1 + x2) / 2;

            //this.PrimitiveRectangle(x1 - 10, this.rulersize, x2 - x1 + 20, 20, "#222", "transparent");

            this.SetFillColor("#FFF");
            this.PrimitiveText_2((this.gridx[i + 1] - this.gridx[i]).toFixed(3), xm, this.rulersize - coord);
        }
    }

    if (this.gridy.length > 1) {
        let y1, y2, ym;

        for (let i = 0; i < this.gridy.length - 1; i++) {
            y1 = this.ToCoordY(this.gridy[i]);
            y2 = this.ToCoordY(this.gridy[i + 1]);
            ym = (y1 + y2) / 2;

            //this.PrimitiveRectangle(this.rulersize - 20, y1 + 10, 20, y2 - y1 - 20, "#222", "transparent");

            this.SetFillColor("#FFF");
            this.PrimitiveText_2((this.gridy[i + 1] - this.gridy[i]).toFixed(3), this.rulersize - coord, ym, -Math.PI / 2);
        }
    }

    this.SetProperties({
        linecolor: this.settings.gridline,
        thickness: 0.5,
        fillcolor: "#FF0"
    });

    for (let x of this.gridx) {
        x = this.ToCoordX(x);
        this.PrimitiveLine_2(x, 0, x, this.height, [2, 2]);

        this.PrimitiveText_2(String.fromCharCode(65 + counter), x, this.rulersize - coord);
        counter++;
    }

    counter = 1;

    for (let y of this.gridy) {
        y = this.ToCoordY(y);
        this.PrimitiveLine_2(0, y, this.width, y, [2, 2]);

        this.PrimitiveText_2(counter, this.rulersize - coord, y);
        counter++;
    }
};

xcanvas.DrawRuler = function () {
    if (this.settings.rulerposition === 0)
        this.DrawRulerOuter();
    else
        this.DrawRulerInner();
};

xcanvas.DrawRulerOuter = function () {
    let font = "normal 10px sans-serif";
    let fontcolor = this.settings.rulertext;

    let x1 = 0;
    let y1 = 0;
    let angle = Math.PI * 270 / 180;

    let root = Math.pow(10, Math.round(Math.log(this.gridsize) / Math.LN10)) / 100;
    let intervalx = this.gridvalue.x / root;
    let intervaly = this.gridvalue.y / root;
    let intervalsize = this.ToCoordWidth(intervalx);

    if (intervalsize <= 50) {
        intervalx *= 5;
        intervaly *= 5;
    }
    else if (intervalsize <= 75) {
        intervalx *= 2;
        intervaly *= 2;
    }

    let x2 = x1 + intervalx;
    let y2 = y1 + intervaly;

    let round = 0;

    if (intervalx <= 10)
        round = 2;

    let x = this.rulersize;
    let y = this.rulersize;
    let cy = this.height - y;

    //Major x
    let px1 = this.ToCoordX(x1);
    let px2 = this.ToCoordX(x2);

    let labelpos = 10;

    this.PrimitiveRectangle(0, 0, this.rulersize, this.height, this.settings.ruler, this.settings.ruler);
    this.PrimitiveRectangle(0, 0, this.width, this.rulersize, this.settings.ruler, this.settings.ruler);

    this.SetTextProperties({
        ha: "center",
        va: "top",
        font: font,
        color: fontcolor
    });

    while (px1 >= 0 || px2 < this.width) {
        if (this.gridvalue.x >= 1 && this.gridvalue.x <= 100) {
            if (px1 >= x && px1 < this.width) {
                if (Math.abs(x1) >= 10000)
                    this.PrimitiveText_2(x1.toExponential(1), px1, labelpos);
                else
                    this.PrimitiveText_2(x1.toFixed(round), px1, labelpos);

                this.PrimitiveLine(px1, this.rulersize - 5, px1, this.rulersize, this.settings.rulerline, 2);
            }

            if (px2 < this.width && px2 >= x) {
                if (Math.abs(x2) >= 10000)
                    this.PrimitiveText_2(x2.toExponential(1), px2, labelpos);
                else
                    this.PrimitiveText_2(x2.toFixed(round), px2, labelpos);

                this.PrimitiveLine(px2, this.rulersize - 5, px2, this.rulersize, this.settings.rulerline, 2);
            }
        } else {
            if (px1 >= x && px1 < this.width) {
                if (Math.abs(x1) >= 10000 || this.gridvalue.x <= 0.01)
                    this.PrimitiveText_2(x1.toExponential(1), px1, labelpos);
                else
                    this.PrimitiveText_2(x1.toFixed(round), px1, labelpos);

                this.PrimitiveLine(px1, this.rulersize - 5, px1, this.rulersize, this.settings.rulerline, 2);
            }

            if (px2 < this.width && px2 >= x) {
                if (Math.abs(x2) >= 10000 || this.gridvalue.x <= 0.01)
                    this.PrimitiveText_2(x2.toExponential(1), px2, labelpos);
                else
                    this.PrimitiveText_2(x2.toFixed(round), px2, labelpos);

                this.PrimitiveLine(px2, this.rulersize - 5, px2, this.rulersize, this.settings.rulerline, 2);
            }
        }

        x1 -= intervalx;
        x2 += intervalx;

        px1 = this.ToCoordX(x1);
        px2 = this.ToCoordX(x2);
    }

    //Major Y
    var py1 = this.ToCoordY(y1);
    var py2 = this.ToCoordY(y2);

    this.SetTextProperties({
        ha: "center",
        va: "bottom",
        font: font,
        color: fontcolor
    });

    while (py2 > y || py1 <= this.height) {
        if (this.gridvalue.y >= 1 && this.gridvalue.y <= 100) {
            if (py1 > y && py1 <= this.height) {
                if (Math.abs(y1) >= 10000)
                    this.PrimitiveText_2(y1.toExponential(1), x - labelpos, py1, angle);
                else
                    this.PrimitiveText_2(y1.toFixed(round), x - labelpos, py1, angle);

                this.PrimitiveLine(x - 5, py1, x, py1, this.settings.rulerline, 2);
            }

            if (py2 <= this.height && py2 > y) {
                if (Math.abs(y2) >= 10000)
                    this.PrimitiveText_2(y2.toExponential(1), x - labelpos, py2, angle);
                else
                    this.PrimitiveText_2(y2.toFixed(round), x - labelpos, py2, angle);

                this.PrimitiveLine(x - 5, py2, x, py2, this.settings.rulerline, 2);
            }
        } else {
            if (py1 > y && py1 <= this.height) {
                if (Math.abs(y1) >= 10000 || this.gridvalue.x <= 0.01)
                    this.PrimitiveText_2(y1.toExponential(1), x - labelpos, py1, angle);
                else
                    this.PrimitiveText_2(y1.toFixed(round), x - labelpos, py1, angle);

                this.PrimitiveLine(x - 5, py1, x, py1, this.settings.rulerline, 2);
            }

            if (py2 <= this.height && py2 > y) {
                if (Math.abs(y1) >= 10000 || this.gridvalue.x <= 0.01)
                    this.PrimitiveText_2(y2.toExponential(1), x - labelpos, py2, angle);
                else
                    this.PrimitiveText_2(y2.toFixed(round), x - labelpos, py2, angle);

                this.PrimitiveLine(x - 5, py2, x, py2, this.settings.rulerline, 2);
            }
        }

        y1 -= intervaly;
        y2 += intervaly;

        py1 = this.ToCoordY(y1);
        py2 = this.ToCoordY(y2);
    }

    this.PrimitiveLine(x, y, x, this.height, this.settings.rulerline, 2);
    this.PrimitiveLine(x, y, this.width, y, this.settings.rulerline, 2);
};

xcanvas.DrawRulerInner = function () {
    let font = "normal 10px sans-serif";
    let fontcolor = this.settings.rulertext;

    let x1 = 0;
    let y1 = 0;

    let root = Math.pow(10, Math.round(Math.log(this.gridsize) / Math.LN10)) / 100;
    let intervalx = this.gridvalue.x / root;
    let intervaly = this.gridvalue.y / root;
    let intervalsize = this.ToCoordWidth(intervalx);

    if (intervalsize <= 50) {
        intervalx *= 5;
        intervaly *= 5;
    }
    else if (intervalsize <= 75) {
        intervalx *= 2;
        intervaly *= 2;
    }

    let x2 = x1;
    let y2 = y1;

    let round = 0;

    if (intervalx <= 10)
        round = 2;

    let x = this.rulersize;
    let y = this.rulersize;
    let cy = this.height - y;

    //X
    let px1 = this.ToCoordX(0);
    let px2 = this.ToCoordX(0);

    let labelpos = this.ToCoordY(0) + 10;
    let align = "top";

    if (labelpos < 10) {
        labelpos = 10;
        this.PrimitiveRectangle(0, 0, this.width, y, this.settings.ruler, this.settings.ruler);
        this.PrimitiveLine(0, y, this.width, y, this.settings.rulerline, 2);
    }

    if (labelpos > this.height - 10) {
        labelpos = this.height - 10;
        align = "bottom";

        y = this.height - this.rulersize;
        this.PrimitiveRectangle(0, y, this.width, this.height, this.settings.ruler, this.settings.ruler);
        this.PrimitiveLine(0, y, this.width, y, this.settings.rulerline, 2);
    }

    x = 0;
    y = 0;

    while (px1 >= 0 || px2 < this.width) {
        if (this.gridvalue.x >= 1 && this.gridvalue.x <= 100) {
            if (px1 >= x && px1 < this.width) {
                if (x1 !== 0) {
                    if (Math.abs(x1) >= 100000)
                        this.PrimitiveText(x1.toExponential(1), px1, labelpos, font, fontcolor, 0, "center", align);
                    else
                        this.PrimitiveText(x1.toFixed(round), px1, labelpos, font, fontcolor, 0, "center", align);
                } else
                    this.PrimitiveText(x1.toFixed(round), px1 + 5, labelpos, font, fontcolor, 0, "left", align);

                this.PrimitiveLine(px1, labelpos - 10, px1, labelpos - 5, this.settings.axis, 2);
            }

            if (px2 < this.width && px2 >= x) {
                if (x2 !== 0) {
                    if (Math.abs(x2) >= 100000)
                        this.PrimitiveText(x2.toExponential(1), px2, labelpos, font, fontcolor, 0, "center", align);
                    else
                        this.PrimitiveText(x2.toFixed(round), px2, labelpos, font, fontcolor, 0, "center", align);
                }

                this.PrimitiveLine(px2, labelpos - 10, px2, labelpos - 5, this.settings.axis, 2);
            }
        } else {
            if (px1 >= x && px1 < this.width) {
                if (x1 !== 0) {
                    if (Math.abs(x1) >= 100000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(x1.toExponential(1), px1, labelpos, font, fontcolor, 0, "center", align);
                    else
                        this.PrimitiveText(x1.toFixed(round), px1, labelpos, font, fontcolor, 0, "center", align);
                } else
                    this.PrimitiveText(x1.toFixed(round), px1 + 5, labelpos, font, fontcolor, 0, "left", align);

                this.PrimitiveLine(px1, labelpos - 10, px1, labelpos - 5, this.settings.axis, 2);
            }

            if (px2 < this.width && px2 >= x) {
                if (x2 !== 0) {
                    if (Math.abs(x2) >= 100000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(x2.toExponential(1), px2, labelpos, font, fontcolor, 0, "center", align);
                    else
                        this.PrimitiveText(x2.toFixed(round), px2, labelpos, font, fontcolor, 0, "center", align);
                }

                this.PrimitiveLine(px2, labelpos - 10, px2, labelpos - 5, this.settings.axis, 2);
            }
        }

        x1 -= intervalx;
        x2 += intervalx;

        px1 = this.ToCoordX(x1);
        px2 = this.ToCoordX(x2);
    }

    //Y
    var py1 = this.ToCoordY(y1);
    var py2 = this.ToCoordY(y2);
    align = "left";

    let angle = 0;

    x = this.ToCoordX(0) + 10;

    if (x < 10) {
        align = "center";
        x = 10;
        angle = Math.PI * 1.5;

        this.PrimitiveRectangle(0, 0, this.rulersize, this.height, this.settings.ruler, this.settings.ruler);
        this.PrimitiveLine(this.rulersize, y, this.rulersize, this.height, this.settings.rulerline, 2);
    }

    if (x > this.width - 10) {
        x = this.width - 10;
        align = "center";
        angle = Math.PI / 2;

        y = this.width - this.rulersize;
        this.PrimitiveRectangle(y, 0, this.width, this.height, this.settings.ruler, this.settings.ruler);
        this.PrimitiveLine(y, 0, y, this.height, this.settings.rulerline, 2);
    }

    y = 0;

    while (py2 > y || py1 <= this.height) {
        if (this.gridvalue.y >= 1 && this.gridvalue.y <= 100) {
            if (py1 > y && py1 <= this.height) {
                if (y1 !== 0) {
                    if (Math.abs(y1) >= 10000)
                        this.PrimitiveText(y1.toExponential(1), x, py1, font, fontcolor, angle, align, "middle");
                    else
                        this.PrimitiveText(y1.toFixed(round), x, py1, font, fontcolor, angle, align, "middle");
                }

                this.PrimitiveLine(x - 10, py1, x - 5, py1, this.settings.axis, 2);
            }

            if (py2 <= this.height && py2 > y) {
                if (y2 !== 0) {
                    if (Math.abs(y2) >= 100000)
                        this.PrimitiveText(y2.toExponential(1), x, py2, font, fontcolor, angle, align, "middle");
                    else
                        this.PrimitiveText(y2.toFixed(round), x, py2, font, fontcolor, angle, align, "middle");
                }

                this.PrimitiveLine(x - 10, py2, x - 5, py2, this.settings.axis, 2);
            }
        } else {
            if (py1 > y && py1 <= this.height) {
                if (y1 !== 0) {
                    if (Math.abs(y1) >= 100000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(y1.toExponential(1), x, py1, font, fontcolor, angle, align, "middle");
                    else
                        this.PrimitiveText(y1.toFixed(round), x, py1, font, fontcolor, angle, align, "middle");
                }

                this.PrimitiveLine(x - 10, py1, x - 5, py1, this.settings.axis, 2);
            }

            if (py2 <= this.height && py2 > y) {
                if (y2 !== 0) {
                    if (Math.abs(y1) >= 100000 || this.gridvalue.x <= 0.01)
                        this.PrimitiveText(y2.toExponential(1), x, py2, font, fontcolor, angle, align, "bottom");
                    else
                        this.PrimitiveText(y2.toFixed(round), x, py2, font, fontcolor, angle, align, "bottom");
                }

                this.PrimitiveLine(x - 10, py2, x - 5, py2, this.settings.axis, 2);
            }
        }

        y1 -= intervaly;
        y2 += intervaly;

        py1 = this.ToCoordY(y1);
        py2 = this.ToCoordY(y2);
    }
};


//Draw

xcanvas.SetProperties = function (properties) {
    if (properties.linecolor)
        this.context.strokeStyle = properties.linecolor;

    if (properties.thickness) {
        if (properties.scale)
            this.context.lineWidth = properties.thickness * this.gridsize / (this.defaultgridsize * this.gridvalue.x);
        else
            this.context.lineWidth = properties.thickness;

        if (this.context.lineWidth < 1)
            this.context.lineWidth = 1;
    }

    if (properties.fillcolor)
        this.context.fillStyle = properties.fillcolor;
};

xcanvas.SetTextProperties = function (properties) {
    if (properties.ha)
        this.context.textAlign = properties.ha;
    else
        this.context.textAlign = 'center';

    if (properties.va)
        this.context.textBaseline = properties.va;
    else
        this.context.textBaseline = "bottom";

    if (properties.color)
        this.context.fillStyle = properties.color;

    if (properties.font)
        this.context.font = properties.font;
};

xcanvas.SetFillColor = function (color) {
    this.context.fillStyle = color;
};

xcanvas.PrimitiveLine = function (x1, y1, x2, y2, color, linewidth, dashline) {
    this.context.beginPath();

    if (dashline) {
        this.context.save();

        if (dashline) {
            let linedash = [];

            for (let i = 0; i < dashline.length; i++)
                linedash.push(dashline[i] * 2);

            this.context.setLineDash(linedash);
        }
    }

    this.context.moveTo(x1 - 0.5, y1 - 0.5);
    this.context.lineTo(x2 - 0.5, y2 - 0.5);
    this.context.strokeStyle = color;

    if (isNaN(linewidth))
        this.context.lineWidth = 1;
    else
        this.context.lineWidth = linewidth;

    this.context.stroke();

    if (dashline)
        this.context.restore();
};

xcanvas.PrimitiveLine_2 = function (x1, y1, x2, y2, dashline) {
    this.context.beginPath();

    if (dashline) {
        this.context.save();

        if (dashline) {
            let linedash = [];

            for (let i = 0; i < dashline.length; i++)
                linedash.push(dashline[i] * 2);

            this.context.setLineDash(linedash);
        }
    }

    this.context.moveTo(x1 - 0.5, y1 - 0.5);
    this.context.lineTo(x2 - 0.5, y2 - 0.5);
    this.context.stroke();

    if (dashline)
        this.context.restore();
};

xcanvas.PrimitiveCircle = function () {
};

xcanvas.PrimitiveArc = function () {
};

xcanvas.PrimitiveRectangle = function (x, y, w, h, fillcolor, linecolor) {
    let aw = w;
    let ah = h;
    let ax = x;
    let ay = y;

    if (fillcolor) {
        this.context.fillStyle = fillcolor;
        this.context.fillRect(ax, ay, aw, ah);
    }

    if (linecolor) {
        this.context.strokeStyle = linecolor;
        this.context.lineWidth = 1;
        this.context.strokeRect(ax, ay, aw, ah);
    }
};

xcanvas.PrimitiveText = function (text, x, y, font, color, a, ha, va) {
    if (a === null) {
        if (ha !== undefined)
            this.context.textAlign = ha;

        if (va !== undefined)
            this.context.textBaseline = va;

        this.context.fillStyle = color;
        this.context.font = font;
        this.context.fillText(text, x, y);

    } else {
        this.context.save();

        if (ha !== undefined)
            this.context.textAlign = ha;
        else
            this.context.textAlign = 'center';

        if (va !== undefined)
            this.context.textBaseline = va;
        else
            this.context.textBaseline = "bottom";

        this.context.fillStyle = color;
        this.context.font = font;
        this.context.translate(x, y);
        this.context.rotate(a);
        this.context.fillText(text, 0, 0);
        this.context.restore();
    }
};

xcanvas.PrimitiveText_2 = function (text, x, y, a) {
    if (a === null) {
        this.context.fillText(text, x, y);

    } else {
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate(a);
        this.context.fillText(text, 0, 0);
        this.context.restore();
    }
};

xcanvas.SelectRectangle = function (x, y, w, h, linecolor) {
    var aw = w;
    var ah = h;
    var ax = x;
    var ay = y;

    this.context.save();
    this.context.strokeStyle = linecolor;
    this.context.lineWidth = 1;

    this.context.setLineDash([4, 2]);
    this.context.lineDashOffset = 2;
    this.context.strokeRect(ax, ay, aw, ah);
    this.context.restore();
};

xcanvas.DrawLine = function (x1, y1, x2, y2, properties) {
    x1 = this.ToCoordX(x1);
    y1 = this.ToCoordY(y1);

    x2 = this.ToCoordX(x2);
    y2 = this.ToCoordY(y2);

    this.context.beginPath();
    this.context.moveTo(x1 - 0.5, y1 - 0.5);
    this.context.lineTo(x2 - 0.5, y2 - 0.5);
    this.context.strokeStyle = properties.linecolor;

    if (isNaN(properties.linewidth))
        this.context.lineWidth = 1;
    else
        this.context.lineWidth = properties.width;

    this.context.stroke();
};

xcanvas.DrawLine_2 = function (x1, y1, x2, y2) {
    x1 = this.ToCoordX(x1);
    y1 = this.ToCoordY(y1);

    x2 = this.ToCoordX(x2);
    y2 = this.ToCoordY(y2);

    this.context.beginPath();
    this.context.moveTo(x1 - 0.5, y1 - 0.5);
    this.context.lineTo(x2 - 0.5, y2 - 0.5);
    this.context.stroke();
};

xcanvas.DrawCircle = function (x, y, r, properties) {
    r = this.gridsize * r / this.gridvalue.x;
    x = this.ToCoordX(x);
    y = this.ToCoordY(y);

    let context = this.context;

    this.SetProperties(properties);

    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();

    if (property.showfill)
        context.fill();

    if (property.showline)
        context.stroke();
};

xcanvas.DrawCircle_2 = function (x, y, r, showfill, showline) {
    r = this.gridsize * r / this.gridvalue.x;
    x = this.ToCoordX(x);
    y = this.ToCoordY(y);

    let context = this.context;

    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();

    if (showfill || showfill === undefined)
        context.fill();

    if (showline || showline === undefined)
        context.stroke();
};

xcanvas.DrawRectangle = function (x, y, w, h, properties) {
    let ratio = this.gridsize / this.gridvalue.x;
    w = ratio * w;
    h = ratio * h;
    x = this.ToCoordX(x) - w / 2;
    y = this.ToCoordY(y) - h / 2;

    this.SetProperties(properties);

    if (properties.showfill)
        this.context.fillRect(x, y, w, h);

    if (properties.showline)
        this.context.strokeRect(x, y, w, h);
};

xcanvas.DrawRectangle_2 = function (x, y, w, h, showfill, showline) {
    let ratio = this.gridsize / this.gridvalue.x;
    w = ratio * w;
    h = ratio * h;

    x = this.ToCoordX(x) - w / 2;
    y = this.ToCoordY(y) - h / 2;

    let context = this.context;

    if (showfill || showfill === undefined)
        context.fillRect(x, y, w, h);

    if (showline || showline === undefined)
        context.strokeRect(x, y, w, h);
};

xcanvas.DrawPolyline = function () {
};

xcanvas.DrawPolygon = function (points, properties, holes) {
    if (points.length !== 0) {
        let context = this.context;

        this.SetProperties(properties);

        context.beginPath();

        //First point
        var x = this.ToCoordX(points[0].x);
        var y = this.ToCoordY(points[0].y);
        context.moveTo(x, y);

        //Second to the last point
        for (var i = 1; i < points.length; i++) {
            x = this.ToCoordX(points[i].x);
            y = this.ToCoordY(points[i].y);
            context.lineTo(x, y);
        }

        context.closePath();

        //Holes

        if (holes) {
            for (let i = 0; i < holes.length; i++) {
                switch (holes[i].type) {
                    case "polygon":

                        if (holes[i].points.length != 0) {
                            x = this.ToCoordX(holes[i].points[0].x);
                            y = this.ToCoordY(holes[i].points[0].y);
                            context.moveTo(x, y);

                            for (var j = 1; j < holes[i].points.length; j++) {
                                x = this.ToCoordX(holes[i].points[j].x);
                                y = this.ToCoordY(holes[i].points[j].y);
                                context.lineTo(x, y);
                            }

                            context.closePath();
                        }
                        break;

                    case "circle":
                        x = this.ToCoordX(holes[i].x);
                        y = this.ToCoordY(holes[i].y);
                        r = this.ToCoordWidth(holes[i].r);

                        context.moveTo(x + r, y);
                        context.arc(x, y, r, 0, Math.PI * 2, true);
                        break;
                }
            }
        }
        if (properties.showfill)
            context.fill();

        if (properties.showline)
            context.stroke();
    }
};

xcanvas.DrawPolygon_2 = function (points, showfill, showline) {
    if (points.length !== 0) {
        let context = this.context;

        context.beginPath();

        //First point
        var x = this.ToCoordX(points[0].x);
        var y = this.ToCoordY(points[0].y);
        context.moveTo(x, y);

        //Second to the last point
        for (var i = 1; i < points.length; i++) {
            x = this.ToCoordX(points[i].x);
            y = this.ToCoordY(points[i].y);
            context.lineTo(x, y);
        }

        context.closePath();

        if (showfill || showfill === undefined)
            context.fill();

        if (showline || showline === undefined)
            context.stroke();
    }
};

xcanvas.DrawText = function (text, x, y, font, color, a, ha, va) {
    x = this.ToCoordX(x);
    y = this.ToCoordY(y);

    if (ha !== undefined)
        this.context.textAlign = ha;
    else
        this.context.textAlign = 'center';

    if (va !== undefined)
        this.context.textBaseline = va;
    else
        this.context.textBaseline = "bottom";

    if (a === null) {
        this.context.fillStyle = color;
        this.context.font = font;

        this.context.fillText(text, x, y);

    } else {
        this.context.save();
        this.context.fillStyle = color;
        this.context.font = font;
        this.context.translate(x, y);
        this.context.rotate(a);
        this.context.fillText(text, 0, 0);
        this.context.restore();
    }
};

xcanvas.DrawText_2 = function (text, x, y, a, ha, va) {
    x = this.ToCoordX(x);
    y = this.ToCoordY(y);

    if (ha !== undefined)
        this.context.textAlign = ha;
    else
        this.context.textAlign = 'center';

    if (va !== undefined)
        this.context.textBaseline = va;
    else
        this.context.textBaseline = "bottom";

    if (a) {
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate(a);
        this.context.fillText(text, 0, 0);
        this.context.restore();

    } else {
        this.context.fillText(text, x, y);
    }
};


//Conversions

xcanvas.ToCoordX = function (pointX) {
    return Math.round(this.center.x + (pointX / this.gridvalue.x - this.middle.x) * this.gridsize);
};

xcanvas.ToCoordY = function (pointY) {
    return Math.round(this.center.y - (pointY / this.gridvalue.y - this.middle.y) * this.gridsize);
};

xcanvas.ToPointX = function (coordX) {
    return (this.middle.x - (this.center.x - coordX) / this.gridsize) * this.gridvalue.x;
};

xcanvas.ToPointY = function (coordY) {
    return (this.middle.y + (this.center.y - coordY) / this.gridsize) * this.gridvalue.y;
};

xcanvas.ToPointWidth = function (pointWidth) {
    return (pointWidth / this.gridsize) * this.gridvalue.y;
};

xcanvas.ToCoordWidth = function (coordWidth) {
    return (coordWidth * this.gridsize) / this.gridvalue.x;
};


//Zoom

xcanvas.ZoomAll = function (inbounds, infactor) {
    var bounds;
    var factor = 1.25;

    if (infactor)
        factor = infactor;

    if (inbounds)
        //From parameter
        bounds = inbounds;
    else
        //Compute bounds
        bounds = this.model.Bounds();

    this.Resize();

    if (bounds.x1 > 1000000000 && this.gridx.length > 1 && this.gridy.length > 1) {
        bounds.x1 = this.gridx[0];
        bounds.x2 = this.gridx[this.gridx.length - 1];

        bounds.y1 = this.gridy[0];
        bounds.y2 = this.gridy[this.gridy.length - 1];
    }

    //Check if width and height is already available
    if (this.width && this.height && bounds.x1 < 1000000000) {
        var x1 = bounds.x1;
        var y1 = bounds.y1;

        var x2 = bounds.x2;
        var y2 = bounds.y2;

        var mid = new xplore.canvasentity.Point2F((x1 + x2) / 2, (y1 + y2) / 2);
        var difference = new xplore.canvasentity.Point2F(Math.abs(x1 - x2) / this.gridvalue.x, Math.abs(y1 - y2) / this.gridvalue.y);

        if (((difference.x / difference.y) >= (this.width / this.height))) {
            if (difference.x === 0)
                return;

            this.gridsize = this.width / (factor * difference.x);
        } else {
            if (difference.y === 0)
                return;

            this.gridsize = this.height / (factor * difference.y);
        }

        if (this.gridsize > 1000) {
            this.gridsize /= 10;
            this.gridvalue.x /= 10;
            this.gridvalue.y /= 10;
        } else if (this.gridsize >= 10) {

        } else if (this.gridsize >= 1) {
            this.gridsize *= 5;
            this.gridvalue.x *= 5;
            this.gridvalue.y *= 5;
        } else {
            this.gridsize *= 10;
            this.gridvalue.x *= 10;
            this.gridvalue.y *= 10;
        }

        this.middle.x = mid.x / this.gridvalue.x;
        this.middle.y = mid.y / this.gridvalue.y;

        this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
        this.Render();

    } else {
        this.gridvalue = { x: 5, y: 5 };
        this.gridsize = 20;
        this.Render();
    }

    this.StoreBuffer();
};

xcanvas.Zoom = function (x, y, d) {
    var prev = { x: this.ToPointX(x), y: this.ToPointY(y) };
    this.ZoomRealtime(d);

    var curr = { x: this.ToPointX(x), y: this.ToPointY(y) };
    this.MoveByPoint(curr, prev);

    this.zoomvalue = this.gridsize / (100 * this.gridvalue.x);
    this.Render();
};

xcanvas.ZoomIn = function () {
    this.gridsize *= 1.15;

    if (this.gridvalue.x <= 1 && this.gridsize > 200)
        this.gridsize = 200;

    this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
    this.Render();
    this.StoreBuffer();
};

xcanvas.ZoomOut = function () {
    this.gridsize /= 1.15;

    if (this.gridvalue.x <= 1 && this.gridsize > 200)
        this.gridsize = 200;

    this.zoomvalue = this.gridsize / (this.defaultgridsize * this.gridvalue.x);
    this.Render();
    this.StoreBuffer();
};

xcanvas.ZoomRealtime = function (d) {
    var mult = this.gridsize * d;
    var size = this.gridsize + (mult / 100);

    if (size > 1000) {
        this.gridsize = Math.round(size) / 10;
        this.gridvalue.x /= 10;
        this.gridvalue.y /= 10;

    } else if (size >= 10)
        this.gridsize = Math.round(size);

    else {
        this.gridsize = size * 10;
        this.gridvalue.x *= 10;
        this.gridvalue.y *= 10;
    }
};

xcanvas.ZoomFactor = function (factor) {
    gridsize *= factor;
    this.zoomvalue = gridsize / (defaultgridsize * gridvalue.x);
    this.Render();
};

xcanvas.MoveByPoint = function (current, previous) {
    if (!((current.x === previous.x) && (current.y === previous.y))) {
        this.middle.x -= (current.x - previous.x) / this.gridvalue.x;
        this.middle.y -= (current.y - previous.y) / this.gridvalue.y;
    }
};

xcanvas.Pan = function (x, y) {
    this.middle.x -= x / this.gridsize;
    this.middle.y -= y / this.gridsize;
};


//Events

xcanvas.Events = function () {
    let self = this;
    let button = 0;
    let ontouch = 0;
    let onenter = false;
    let onfocus = true;
    let start = 0;

    document.body.onkeydown = function (event) {
        if (self.drawgrid && event.key === "Escape") {
            self.RestoreBuffer();
            self.drawgrid = -1;
        }
        else {
            if (!event.control && event.key === "x")
                self.lock = "X";
            else if (!event.control && event.key === "y")
                self.lock = "Y";
            else if (!event.control && event.key === "a")
                self.lock = "A";
            else if (!event.control && event.key === "u")
                self.lock = "";

            self.model.KeyDown(self, event);
        }
    };

    document.body.onkeyup = function (event) {
        self.model.KeyUp(self, event);
    };

    this.canvas.addEventListener("mouseenter", function (event) {
        onenter = true;
        onfocus = true;
        RemoveMouseWheelEvent();
        AddMouseWheelEvent();
    });

    this.canvas.addEventListener("mouseleave", function (event) {
        onfocus = false;
        RemoveMouseWheelEvent();
    });

    this.canvas.addEventListener("dblclick", function (event) {
        event.preventDefault();
        button = event.which;

        let x = event.layerX;
        let y = event.layerY;

        self.DoubleClick(x, y, button);
        onmousedown = false;
    });

    this.canvas.addEventListener("mousedown", function (event) {
        event.preventDefault();
        onmousedown = true;
        button = event.which;

        let x = event.layerX;
        let y = event.layerY;

        self.MouseDown(x, y, button);

        onfocus = true;
    });

    this.canvas.addEventListener("mousemove", function (event) {
        if (onfocus) {
            if (!onenter) {
                onenter = true;
                onfocus = true;
                RemoveMouseWheelEvent();
                AddMouseWheelEvent();
            }

            event.preventDefault();
            button = event.which;

            let x = event.layerX;
            let y = event.layerY;

            self.MouseMove(x, y, button);
        }
    });

    this.canvas.addEventListener("mouseup", function (event) {
        event.preventDefault();
        onmousedown = false;
        let movebutton = button;

        button = 0;

        let x = event.layerX;
        let y = event.layerY;

        self.MouseUp(x, y, movebutton);
    });

    this.canvas.addEventListener("touchstart", function (event) {
        event.preventDefault();

        onfocus = true;


        onmousedown = true;

        var e = event;

        downx = e.touches[0].pageX - self.left;
        downy = e.touches[0].pageY - self.top;

        if (e.targetTouches.length > 2) {
            self.MouseDown(downx, downy, 2);
            ontouch = 2;
        } else if (e.targetTouches.length > 1) {
            touch0x = e.targetTouches[0].pageX - self.left;
            touch0y = e.targetTouches[0].pageY - self.top;

            touch1x = e.targetTouches[1].pageX - self.left;
            touch1y = e.targetTouches[1].pageY - self.top;

            var dx = touch0x - touch1x;
            var dy = touch0y - touch1y;

            pointerdist = Math.sqrt(dx * dx + dy * dy);
            ontouch = 1;
        } else {
            ontouch = 0;
            pointerdist = 0;
            start = 0;
            self.MouseDown(downx, downy, 1);
        }
    });

    this.canvas.addEventListener("touchmove", function (event) {
        if (onfocus) {
            event.preventDefault();

            var e = event;

            curx = e.touches[0].pageX - self.left;
            cury = e.touches[0].pageY - self.top;

            if (e.targetTouches.length > 2) {
                self.MouseMove(curx, cury, 3);
            } else if (e.targetTouches.length > 1) {
                if (ontouch === 1) {
                    if (pointerdist === 0) {
                        touch0x = e.targetTouches[0].pageX - self.left;
                        touch0y = e.targetTouches[0].pageY - self.top;

                        touch1x = e.targetTouches[1].pageX - self.left;
                        touch1y = e.targetTouches[1].pageY - self.top;

                        var dx = touch0x - touch1x;
                        var dy = touch0y - touch1y;

                        pointerdist = Math.sqrt(dx * dx + dy * dy);

                    } else {
                        touch0x = e.targetTouches[0].pageX - self.left;
                        touch0y = e.targetTouches[0].pageY - self.top;

                        touch1x = e.targetTouches[1].pageX - self.left;
                        touch1y = e.targetTouches[1].pageY - self.top;

                        var dx = touch0x - touch1x;
                        var dy = touch0y - touch1y;

                        var dist = Math.sqrt(dx * dx + dy * dy);

                        var centerx = (touch0x + touch1x) / 2;
                        var centery = (touch0y + touch1y) / 2;

                        var delta = dist - pointerdist;
                        self.MouseWheel(centerx, centery, (delta) / 20);

                        pointerdist = dist;
                    }
                }
            } else {
                if (ontouch === 0)
                    self.MouseMove(curx, cury, 1);
            }

            start = 1;
        }
    });

    this.canvas.addEventListener("touchend", function (event) {
        event.preventDefault();

        onfocus = false;


        onmousedown = false;

        if (start === 1) {
            self.MouseUp(curx, cury, 1);
        } else {
            self.MouseUp(downx, downy, 1);
        }

        if (ontouch > 0)
            if (event.targetTouches.length === 0)
                ontouch = 0;

        start = 0;
    });

    this.canvas.addEventListener("touchcancel", function (event) {
        event.preventDefault();
        start = 0;
        ontouch = 0;
    });

    function AddMouseWheelEvent() {
        let event = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

        //Add event
        if (document.attachEvent) //if IE (and Opera depending on user setting)
            document.attachEvent("on" + event, WindowMouseWheel);

        else if (document.addEventListener) //WC3 browsers
            document.addEventListener(event, WindowMouseWheel);

        window.onmousewheel = document.onmousewheel = WindowMouseWheel;
    }

    function RemoveMouseWheelEvent() {
        let event = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x

        if (document.attachEvent) //if IE (and Opera depending on user setting)
            document.removeEventListener("on" + event, self.WindowMouseWheel);

        else if (document.addEventListener) //WC3 browsers
            document.removeEventListener(event, self.WindowMouseWheel);

        window.onmousewheel = document.onmousewheel = undefined;
    }

    function WindowMouseWheel(event) {
        if (onfocus) {
            if (!event)
                event = window.event;

            let delta = event.detail ? -event.detail / 4 : event.wheelDelta / 240

            if (event.wheelDelta)
                delta = event.wheelDelta / 240;

            let x = event.layerX;
            let y = event.layerY;

            self.MouseWheel(x, y, delta);
        }
    }
};

xcanvas.DoubleClick = function (x, y, button) {
    //On ruler
    if (this.settings.rulerposition === 0) {
        if (x < this.rulersize + 20) {
            if (this.gridy.length > 1) {
                let y1, y2, ym;

                for (let i = 0; i < this.gridy.length - 1; i++) {
                    y1 = this.ToCoordY(this.gridy[i]);
                    y2 = this.ToCoordY(this.gridy[i + 1]);
                    ym = (y1 + y2) / 2;

                    if (y > ym - 20 && x < ym + 20) {
                        this.EditUserGrid("Y");
                        break;
                    }
                }
            }

        } else if (y < this.rulersize + 20) {
            if (this.gridx.length > 1) {
                let x1, x2, xm;

                for (let i = 0; i < this.gridx.length - 1; i++) {
                    x1 = this.ToCoordX(this.gridx[i]);
                    x2 = this.ToCoordX(this.gridx[i + 1]);
                    xm = (x1 + x2) / 2;

                    if (x > xm - 20 && x < xm + 20) {
                        this.EditUserGrid("X");
                        break;
                    }
                }
            }
        }
    }
};

xcanvas.MouseDown = function (x, y, button) {
    this.canvas.focus();

    //On ruler
    if (this.settings.rulerposition === 0) {
        if (x < this.rulersize) {
            this.StoreBuffer();
            this.drawgrid = 1;

        } else if (y < this.rulersize) {
            this.StoreBuffer();
            this.drawgrid = 2;
        }
    }

    this.mouse.down.x = this.ToPointX(x);
    this.mouse.down.y = this.ToPointY(y);

    this.mouse.rawdown.x = x;
    this.mouse.rawdown.y = y;

    this.mouse.previous.x = this.mouse.down.x;
    this.mouse.previous.y = this.mouse.down.y;

    this.mouse.rawprevious.x = x;
    this.mouse.rawprevious.y = y;

    if (!this.drawgrid)
        this.model.MouseDown(this, this.mouse, button);
};

xcanvas.MouseMove = function (x, y, button) {
    this.mouse.current.x = this.ToPointX(x);
    this.mouse.current.y = this.ToPointY(y);

    this.mouse.rawcurrent.x = x;
    this.mouse.rawcurrent.y = y;

    if (this.drawgrid === 1) {
        if (this.settings.snapongrid)
            x = this.ToCoordX(this.SnapOnGrid(this.mouse.current).x);

        this.RestoreBuffer();
        this.PrimitiveLine(x, 0, x, this.height, "#F80", 0.5, [4, 2]);

    } else if (this.drawgrid === 2) {
        this.RestoreBuffer();
        this.PrimitiveLine(0, y, this.width, y, "#F80", 0.5, [4, 2]);

    } else {
        this.model.MouseMove(this, this.mouse, button);

        this.mouse.previous.x = this.mouse.current.x;
        this.mouse.previous.y = this.mouse.current.y;

        this.mouse.rawprevious.x = x;
        this.mouse.rawprevious.y = y;
    }
};

xcanvas.MouseUp = function (x, y, button) {
    this.mouse.current.x = this.ToPointX(x);
    this.mouse.current.y = this.ToPointY(y);

    if (this.drawgrid === 1) {
        this.drawgrid = 0;

        if (x > this.rulersize) {
            this.gridx.push(this.mouse.current.x);

            this.gridx.sort(function (a, b) {
                if (a > b)
                    return 1;
                else if (a < b)
                    return -1;
                else
                    return 0;
            });

            this.Render();
        }

    } else if (this.drawgrid === 2) {
        this.drawgrid = 0;

        if (y > this.rulersize) {
            this.gridy.push(this.mouse.current.y);

            this.gridy.sort(function (a, b) {
                if (a > b)
                    return 1;
                else if (a < b)
                    return -1;
                else
                    return 0;
            });

            this.Render();
        }

    } else if (this.drawgrid === -1) {
        this.drawgrid = 0;

    } else {
        this.model.MouseUp(this, this.mouse, button);
    }

    this.StoreBuffer();
};

xcanvas.MouseWheel = function (x, y, delta) {
    if (this.settings.allowzoom) {
        //Set current mouse position
        this.mouse.current.x = x;
        this.mouse.current.y = y;
        this.mouse.delta = delta * 10;

        //Zoom
        this.Zoom(this.mouse.current.x, this.mouse.current.y, this.mouse.delta);
        this.StoreBuffer();
    }
};

xcanvas.UpdateMouseDown = function (x, y) {
    this.mouse.down.x = x;
    this.mouse.down.y = y;
};


//Settings

xcanvas.ShowSettings = function () {
    let self = this;

    let form = new xplore.Form({
        text: "Edit Preferences",
        onok: function () {
            self.Render();
            self.StoreBuffer();
        }
    });

    let grid = form.Add(new xplore.PropertyGrid({ text: "Settings" }));
    grid.Bind(new xplore.Canvas2DSettingsModel(this.settings));

    form.Show();
};

xcanvas.EditUserGrid = function (axis) {
    let self = this;

    let form = new xplore.Form({
        text: "Edit Grid",
        onok: function () {
            if (axis === "X") {
                for (let i = 1; i < self.gridx.length; i++) {
                    self.gridx[i] = self.gridx[i - 1] + parseFloat(data[i - 1][1]);
                }
            } else {
                for (let i = 1; i < self.gridy.length; i++) {
                    self.gridy[i] = self.gridy[i - 1] + parseFloat(data[i - 1][1]);
                }
            }

            self.Render();
        }
    });

    let columns = ["Name", "Length"];
    let data = [];

    if (axis === "X") {
        for (let i = 0; i < this.gridx.length - 1; i++) {
            data.push([String.fromCharCode(65 + i) + "-" + String.fromCharCode(65 + i + 1), (this.gridx[i + 1] - this.gridx[i]).toFixed(3)]);
        }
    } else {
        for (let i = 0; i < this.gridy.length - 1; i++) {
            data.push([(i + 1) + "-" + (i + 2), (this.gridy[i + 1] - this.gridy[i]).toFixed(3)]);
        }
    }

    form.Add(new xplore.Table({
        columns: columns,
        data: data
    }));

    form.Show();
};

xcanvas.SnapOnGrid = function (mouse) {
    return {
        x: xplore.Round(mouse.x, this.gridinterval),
        y: xplore.Round(mouse.y, this.gridinterval),
    }
};

xcanvas.SnapOnKey = function (mouse) {
    if (this.lock === "X") {
        mouse.current.y = mouse.down.y;
        mouse.rawcurrent.y = mouse.rawdown.y;

    } else if (this.lock === "Y") {
        mouse.current.x = mouse.down.x;
        mouse.rawcurrent.x = mouse.rawdown.x;

    } else if (this.lock === "A") {
        if (Math.abs(mouse.down.x - mouse.current.x) > Math.abs(mouse.down.y - mouse.current.y)) {
            mouse.current.y = mouse.down.y;
            mouse.rawcurrent.y = mouse.rawdown.y;

        } else {
            mouse.current.x = mouse.down.x;
            mouse.rawcurrent.x = mouse.rawdown.x;
        }
    }
};