xplore.main = function () {
    let splitter = new xplore.SplitContainer();
    splitter.Show();

    let container = new xplore();
    splitter.Add(container);


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
        })
    ];

    buttons[0].SetState(xplore.STATE.DISABLED);
    container.Add(buttons);

    buttons[2] = container.Add(new xplore.Button({
        text: "Hello Earth!",
        onclick: function () {
            var textbox = new xplore.TextBox();
            splitter.Add(textbox);

            textbox.Listen("onchange", buttons[0]);
            textbox.Listen("onchange", buttons[1]);
            textbox.Listen("onchange", buttons[2]);
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