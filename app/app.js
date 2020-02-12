xplore.main = function () {
    let splitter = new xplore.SplitContainer({
        splittersize: 4,
        size: [ undefined, 300 ]
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

    let model = new Model ();
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
                    modal: false
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
                    options: [ "Male", "Female" ],
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

    // var textbox = new xplore.TextBox();
    // textbox.Show();

    // textbox.Listen("onchange", buttons[0]);
    // textbox.Listen("onchange", buttons[1]);
    // textbox.Listen("onchange", buttons[2]);
};

function Model () {
    this.name = "";
    this.mobile = "";
    this.country = "";
    this.subscribe = false;
    this.gender = "Male";
}