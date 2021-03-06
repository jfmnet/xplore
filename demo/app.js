xplore.main = function () {
    DemoCanvas();

    // let button = new xplore.Button({
    //     text: "Open",
    //     onclick: function () {
    //         //ReadFrame3DD();
    //     }
    // });

    // button.Show();
    // let view = new mainview();
    // view.Show();

    //DemoTable();
};

//DemoCanvas3D();
//DemoCanvas();
//DemoView();
//DemoTab();
//DemoMenuToolbar();
//DemoTable();


function DemoTable() {
    let data = [];
    let row;

    for (let i = 0; i < 50; i++) {
        row = [];

        for (let j = 0; j < 15; j++) {
            row.push(j + i);
        }

        data.push(row);
    }

    let table = new xplore.Table({
        columns: [
            [{ text: "Five Spans", colspan: 5 }, { text: "F", rowspan: 2 }, "G", "H", "I", "J", "K", "L", "M", "N", "O"],
            ["A", "B", "C", "D", "E", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
        ],
        multiheader: true,
        data: data,
        // fixedcolumns: 0,
        // columnwidth: [ 150, 50, 150 ]
    });

    table.Show();
}

function DemoCanvas() {
    let canvas = new xplore.Canvas2D({
        showtoolbar: true
    });

    // canvas.gridx.push(0.05);
    // canvas.gridx.push(2.55);
    // canvas.gridx.push(5.15);

    // canvas.gridy.push(0.05);
    // canvas.gridy.push(2.55);
    // canvas.gridy.push(5.15);

    canvas.settings.rulerposition = 0;
    canvas.settings.snapongrid = false;
    //canvas.settings.showgrid = false;

    canvas.Show();
    canvas.ZoomAll();

    canvas.Add(new xplore.Canvas2DGraphics.Girder(54, 8, 6, 0, 8, 9, 0, 20, 26, 0, 0, 8, 8));
    canvas.ZoomAll();
}

function DemoCanvas3D() {
    alert(window.prototype);

    let canvas = new xplore.Canvas3D();
    canvas.Show();

    canvas.model.Add(new xplore.Canvas3DGraphics.Axis({
        size: 1
    }));

    canvas.model.Add(new xplore.Canvas3DGraphics.UniformGridXY({
        x1: -10,
        y1: -10,
        z: 0,
        x2: 10,
        y2: 10,
        interval: 1
    }));

    canvas.model.Add(new xplore.Canvas3DGraphics.ExtrudedSection({
        section: [
            { x: -0.1, y: -0.1 },
            { x: -0.1, y: 0.1 },
            { x: 0.1, y: 0.1 },
            { x: 0.1, y: -0.1 },
        ],
        start: { x: 0, y: 0, z: 0 },
        end: { x: 1, y: 1, z: 1 },
    }));

    canvas.Render();
}

function AddElements(canvas, data) {
    let positions = [];
    let indices = [];
    let colors = [];

    for (let i = 0; i < data.vertices.length; i++) {
        positions.push(data.vertices[i].X);
        positions.push(data.vertices[i].Y);
        positions.push(data.vertices[i].Z);

        indices.push(i);

        colors.push(1);
        colors.push(0);
        colors.push(0);
        colors.push(1);
    }

    let normals = [];

    for (let i = 0; i < data.normals.length; i++) {
        normals.push(data.normals[i].X);
        normals.push(data.normals[i].Y);
        normals.push(data.normals[i].Z);
    }

    canvas.DrawMesh(positions, indices, normals, colors);
}

function DemoView() {
    // let view = new xplore.View({
    //     text: "View"
    // });

    // view.Show();

    let map = new virtualmap();
    map.Show();
}

function DemoTab() {
    let form = new xplore.Form({
        text: "Demo"
    });

    let tab = form.Add(new xplore.Tab({
        tabs: [
            { icon: "folder", text: "Rectangle" },
            { icon: "file", text: "Circle" },
            { icon: "account", text: "Tee" },
        ],
        style: xplore.TABSTYLE.FULL,
        position: xplore.POSITION.LEFT
    }));

    form.Show();

    //Add canvas
    let canvas2D = new xplore.Canvas2D();
    tab.Set(canvas2D, 0);

    //Add table
    let data = [];
    let row;

    for (let i = 0; i < 50; i++) {
        row = [];

        for (let j = 0; j < 15; j++) {
            row.push(j + i);
        }

        data.push(row);
    }

    let table = new xplore.Table({
        columns: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
        data: data,
        // fixedcolumns: 0,
        // columnwidth: [ 150, 50, 150 ]
    });

    tab.Set(table, 1);

    //Add button
    let button = new xplore.Button({
        text: "Button 3"
    });

    tab.Set(button, 2);
}

function DemoMenuToolbar() {
    let menucontainer = new xplore.MenuContainer();

    let menu = menucontainer.Add(new xplore.Menu({ text: "File" }));
    menu.Add(new xplore.Menu({
        icon: "account", text: "New", shortcut: "CTRL+N",
        onclick: function (sender) {
            let form = new xplore.Form({
                text: "Test"
            });

            form.Show();
        }
    }));
    menu.Add(new xplore.Menu({ text: "Open", shortcut: "CTRL+O", onclick: function (sender) { console.log(sender.text) } }));
    menu.Add(new xplore.Menu({ text: "Save", shortcut: "CTRL+S", onclick: function (sender) { console.log(sender.text) } }));

    menucontainer.Show();


    let toolbarcontainer = new xplore.ToolbarContainer();
    let toolbar = toolbarcontainer.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "folder" }));
    toolbar.Add(new xplore.Button({ icon: "account" }));

    toolbar = toolbarcontainer.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "folder" }));
    toolbar.Add(new xplore.Button({ icon: "account" }));
    toolbar.Add(new xplore.Combobox({
        options: ["Male", "Female"]
    }));

    menu = toolbar.Add(new xplore.Menu({ text: "Edit" }));

    for (let i = 0; i < 50; i++)
        menu.Add(new xplore.Menu({ text: "Menu " + i }));

    toolbarcontainer.Show();
}

function Demo1() {
    let splitter = new xplore.SplitContainer({
        splittersize: 4,
        size: [undefined, 300]
    });
    splitter.Show();

    let dockpanel = new xplore.DockPanel({
        splittersize: 4
    });
    splitter.Set(dockpanel, 0);


    let form = new xplore.Form({
        text: "Hello World!",
    });

    dockpanel.Dock(form, 0);


    let container = new xplore();
    splitter.Set(container, 1);

    let model = new Model();
    model.name = "Jonathan Manuel";

    let buttons = [
        new xplore.Button({
            text: "Hello Universe!",
            onclick: function () {
                alert("Clicked!");
            }
        }),
        new xplore.Button({
            text: "Hello Universe!",
            onclick: function () {
                alert("Clicked!");
            }
        }),
        new xplore.Button({
            text: "Open Form",
            onclick: function () {
                let form = new xplore.Form({
                    text: "Hello World!",
                    modal: false,
                    onok: function () {
                        alert(model.name);
                    }
                });

                form.Add(new xplore.Textbox({
                    text: "Name",
                    bind: { object: model, name: "name" },
                    inline: true
                }));

                form.Add(new xplore.Textbox({
                    text: "Country",
                    bind: { object: model, name: "country" },
                    inline: true
                }));

                form.Add(new xplore.Checkbox({
                    text: "Subscribe",
                    bind: { object: model, name: "subscribe" },
                    inline: true
                }));

                form.Add(new xplore.Combobox({
                    text: "Gender",
                    bind: { object: model, name: "gender" },
                    options: ["Male", "Female"],
                    inline: true
                }));

                form.Show();
            }
        })
    ];

    buttons[0].SetState(xplore.STATE.DISABLED);
    container.Add(buttons);

    buttons[3] = container.Add(new xplore.Button({
        text: "Hello Earth!",
        onclick: function () {
            var textbox = new xplore.TextBox();
            splitter.Add(textbox);

            textbox.Listen("onchange", buttons[0]);
            textbox.Listen("onchange", buttons[1]);
            textbox.Listen("onchange", function (object) {
                console.log(object.value);
            });
        }
    }));

    var demo = new xplore({
        text: xplore.toString(),
        element: "p"
    });

    demo.SetVisibility(false);
    demo.Show();
}

function Model() {
    this.name = "";
    this.mobile = "";
    this.country = "";
    this.subscribe = false;
    this.gender = "Male";
}

function ReadFrame3DD() {
    xplore.OpenFile(xplore.FILEFORMAT.TEXT, ".3dd", function (model) {
        let lines = model.split("\n");
        ReadNodes(lines);
    });
}

function ReadNodes(lines) {
    let nodes = [];

    for (let line in lines) {
        if (line.indexOf("# number of nodes ") !== -1) {

        }
    }
}