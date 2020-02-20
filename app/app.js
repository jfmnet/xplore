xplore.main = function () {
    DemoTab();
    //DemoMenuToolbar();
};

function DemoTab() {
    let form = new xplore.Form({
        text: "Demo"
    });

    let tab = form.Add(new xplore.Tab({
        tabs: [
            { icon: "folder", text: "Tab 1"},
            { icon: "file", text: "Tab 2"},
            { icon: "account", text: "Tab 3"},
        ],
        style: xplore.TABSTYLE.FULL
    }));

    form.Show();

    let button = new xplore.Button({
        text: "Button 1"
    });

    tab.Set(button, 0);

    button = new xplore.Button({
        text: "Button 2"
    });

    tab.Set(button, 1);

    button = new xplore.Button({
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