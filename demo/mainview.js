var mainview = xplore.Inherit(xplore.View);
let view = mainview.prototype;

view.Initialize = function () {
    let self = this;

    //Set tile
    this.text = "xplore";
    this.tools = [
        new xplore.Button({ icon: "account" })
    ];

    //Add splitter
    this.splitter = this.Add(new xplore.SplitContainer({
        splittersize: 4,
        size: [240]
    }));

    //Add list container
    let list = this.splitter.Add(new xplore.ListContainer());

    //Add items to the list container
    list.Add(new xplore.List({
        text: "Button",
        onclick: function () {
            self.ShowButton();
        }
    }));

    list.Add(new xplore.List({
        text: "Combobox",
        onclick: function () {
            self.ShowCombobox();
        }
    }));

    list.Add(new xplore.List({
        text: "Form",
        onclick: function () {
            self.ShowForm();
        }
    }));

    list.Add(new xplore.List({
        text: "Canvas2D",
        onclick: function () {
            self.ShowCanvas2D();
        }
    }));

    list.Add(new xplore.List({
        text: "Canvas3D",
        onclick: function () {
            self.ShowCanvas3D();
        }
    }));

    list.Add(new xplore.List({
        text: "Table",
        onclick: function () {
            self.ShowTable();
        }
    }));
};

view.Load = function () {
    this.ShowCanvas3D();
};

view.ShowButton = function () {
    let container = new xplore.Container();
    container.Add(new xplore.Button({ text: "OK" }));
    container.Add(new xplore.Button({ icon: "account" }));
    container.Add(new xplore.Button({ icon: "account", text: "Profile" }));

    this.splitter.Set(container, 1);
};

view.ShowForm = function () {
    let container = new xplore.Container();
    container.Add(new xplore.Button({ 
        text: "Default Form",
        onclick: function () {
            let form = new xplore.Form({
                text: "Default"
            });
            
            form.Show();
        } 
    }));

    this.splitter.Set(container, 1);
};  

view.ShowTable = function () {
    let data = [];
    let row;

    for (let i = 0; i < 50; i++) {
        row = [];

        for (let j = 0; j < 11; j++) {
            row.push(Math.round(Math.random() * 1000));
        }

        data.push(row);
    }

    let table = new xplore.Table({
        columns:
            //[{ text: "A", rowspan: 2 }, { text: "B", rowspan: 2 }, { text: "Header A", colspan: 4 }, { text: "Header B", colspan: 5 }],
            ["A", "B", "C", "D", "E", "G", "H", "I", "J", "K", "L"],
        data: data,
        fixedcolumns: 0,
        columnwidth: [75, 75],
        multiheader: false,
        sort: true,
        showfilter: true,
        //showsearch: true,
    });

    this.splitter.Set(table, 1);
};

view.ShowCanvas2D = function () {
    let canvas = new xplore.Canvas2D({
        showtoolbar: true
    });
    
    canvas.Add(new xplore.Canvas2DGraphics.Polygon([
        { x: 0, y: 0 },
        { x: 0, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 0 },
    ]));

    this.splitter.Set(canvas, 1);

    canvas.ZoomAll();
};

view.ShowCanvas3D = function () {
    let canvas = new xplore.Canvas3D();
    canvas.model.Add(new xplore.Canvas3DGraphics.Axis());
    canvas.model.Add(new xplore.Canvas3DGraphics.UniformGridXY());
    this.splitter.Set(canvas, 1);

    canvas.Render();
    canvas.ZoomAll();
};