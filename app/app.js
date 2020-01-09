xplore.main = function () {
    let container = new xplore();
    container.Show();

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
            textbox.Show();

            textbox.Listen("onchange", buttons[0]);
            textbox.Listen("onchange", buttons[1]);
            textbox.Listen("onchange", buttons[2]);
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