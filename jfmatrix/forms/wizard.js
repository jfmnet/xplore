var wizard = function (param) {
    this.onchange = param.onchange;
};

wizard.prototype.Show = function () {
    let self = this;

    let form = new xplore.Form({
        class: "wizard-form",
        icon: "chevron-left",
        text: "New Model",
        width: 280,
        height: window.innerHeight - 72,
        modal: false
    });

    let group = form.Add(new xplore.Groupbox({ text: "Structure" }));

    let container = group.Add(new xplore.Container({ class: "wizard-thumbnail" }));
    container.Add(new xplore.List({
        icon: "account",
        text: "Beam",
        onclick: function () {
            self.BeamWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "2D Truss",
        onclick: function () {
            self.TrussWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "2D Frame",
        onclick: function () {
            self.FrameWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "Grid",
        onclick: function () {
            self.BeamWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "3D Truss",
        onclick: function () {
            self.TrussWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "3D Frame",
        onclick: function () {
            self.FrameWizard(container);
        }
    }));
    container.Add(new xplore.List({
        icon: "account",
        text: "Empty",
        onclick: function () {
            self.EmptyModel(container);
        }
    }));

    container = form.Add(new xplore.Container());

    form.Show();
    form.Position(0, 72);
};

wizard.prototype.EmptyModel = function (container) {
    container.Clear();
    container.Refresh();
};

wizard.prototype.BeamWizard = function (container) {
    let self = this;

    container.Clear();

    let group = container.Add(new xplore.Groupbox({ text: "Details" }));

    let spans = group.Add(new xplore.NumericTextbox({ 
        text: "No. of Spans", 
        value: 1, inline: true,
        onchange: function () {
            data = [];
    
            for (let i = 0; i < spans.value; i++) {
                data.push([i + 1, width.value]);
            }

            table.data = data;
            table.Refresh();

            self.onchange(data);
        } 
    }));

    let width = group.Add(new xplore.NumericTextbox({ 
        text: "Width", 
        value: 2, 
        inline: true,
        onchange: function () {
            data = [];
    
            for (let i = 0; i < spans.value; i++) {
                data.push([i + 1, width.value]);
            }

            table.data = data;
            table.Refresh();

            self.onchange(data);
        } 
    }));

    let data = [];
    
    for (let i = 0; i < spans.value; i++) {
        data.push([i + 1, width.value]);
    }

    let table = group.Add(new xplore.Table({
        columns: ["Span", "Width"],
        data: data,
        showfooter: false,
        onchange: function () {
            self.onchange(table.data);
        }
    }));

    container.Refresh();
};

wizard.prototype.TrussWizard = function (container) {
    container.Clear();
    container.Add(new xplore.Header({ text: "Details" }));
    container.Refresh();
};

wizard.prototype.FrameWizard = function (container) {
    container.Clear();
    container.Add(new xplore.Header({ text: "Details" }));
    container.Refresh();
};