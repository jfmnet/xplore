var supportmodel = function () {
    let self = this;

    this.type = new xplore.Combobox({
        text: "Support",
        inline: true,
        options: [
            "Fixed",
            "Pin",
            "Roller X",
            "Roller Y"
        ],
        value: "Fixed",
        onchange: function (sender) {
            switch (sender.value) {
                case "Fixed":
                    self.x.value = true;
                    self.x.Refresh();

                    self.y.value = true;
                    self.y.Refresh();

                    self.rx.value = true;
                    self.rx.Refresh();

                    self.ry.value = true;
                    self.ry.Refresh();

                    break;

                case "Pin":
                    self.x.value = true;
                    self.x.Refresh();

                    self.y.value = true;
                    self.y.Refresh();

                    self.rx.value = false;
                    self.rx.Refresh();

                    self.ry.value = false;
                    self.ry.Refresh();

                    break;

                case "Roller X":
                    self.x.value = true;
                    self.x.Refresh();

                    self.y.value = false;
                    self.y.Refresh();

                    self.rx.value = false;
                    self.rx.Refresh();

                    self.ry.value = false;
                    self.ry.Refresh();

                    break;

                case "Roller Y":
                    self.x.value = false;
                    self.x.Refresh();

                    self.y.value = true;
                    self.y.Refresh();

                    self.rx.value = false;
                    self.rx.Refresh();

                    self.ry.value = false;
                    self.ry.Refresh();

                    break;
            }
        }
    });
    this.x = new xplore.Checkbox({ text: "X", value: true, inline: true });
    this.y = new xplore.Checkbox({ text: "Y", value: true, inline: true });
    this.rx = new xplore.Checkbox({ text: "RX", value: true, inline: true });
    this.ry = new xplore.Checkbox({ text: "RY", value: true, inline: true });
};

var jointloadmodel = function () {
    this.x = new xplore.Textbox({ text: "X", type: "number", value: 0, inline: true });
    this.y = new xplore.Textbox({ text: "Y", type: "number", value: 0, inline: true });
};

var memberloadmodel = function () {
    let self = this;

    this.type = new xplore.Combobox({
        text: "Load Type",
        inline: true,
        options: [
            "Point",
            "Uniform",
            "Trapezoidal",
            "Moment",
            "Axial",
            "Uniform Axial",
        ],
        onchange: function () {
            switch (self.type.value) {
                case "Point":
                case "Moment":
                case "Axial":
                    self.w1.text = "W";
                    self.w1.Refresh();

                    self.w2.value = 0;
                    self.w2.SetVisibility(false);

                    self.l1.text = "L";
                    self.l1.visible = true;
                    self.l1.Refresh();

                    self.l2.value = 0;
                    self.l2.SetVisibility(false);
                    break;

                case "Uniform":
                case "Uniform Axial":
                    self.w1.text = "W";
                    self.w1.Refresh();

                    self.w2.value = 0;
                    self.w2.SetVisibility(false);

                    self.l1.text = "L1";
                    self.l1.Refresh();

                    self.l2.SetVisibility(true);
                    break;

                case "Trapezoidal":
                    self.w1.text = "W1";
                    self.w1.Refresh();

                    self.w2.SetVisibility(true);

                    self.l1.text = "L1";
                    self.l1.Refresh();

                    self.l2.SetVisibility(true);
                    break;
            }
        },
        value: "Point"
    });
    this.w1 = new xplore.Textbox({ text: "W", type: "number", value: 0, inline: true });
    this.w2 = new xplore.Textbox({ text: "W2", type: "number", value: 0, inline: true, visible: false });
    this.l1 = new xplore.Textbox({ text: "L", type: "number", value: 0, inline: true });
    this.l2 = new xplore.Textbox({ text: "L2", type: "number", value: 0, inline: true, visible: false });
};