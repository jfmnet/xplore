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