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

    form.Add(new xplore.Header({ text: "Structure" }));

    let container = form.Add(new xplore.ThumbnailContainer({ class: "wizard-thumbnail" }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "Beam",
        onclick: function () {
            self.BeamWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "2D Truss",
        onclick: function () {
            self.TrussWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "2D Frame",
        onclick: function () {
            self.FrameWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "Grid",
        onclick: function () {
            self.BeamWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "3D Truss",
        onclick: function () {
            self.TrussWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
        icon: "account",
        text: "3D Frame",
        onclick: function () {
            self.FrameWizard(container);
        }
    }));
    container.Add(new xplore.Thumbnail({
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
    container.Add(new xplore.Header({ text: "Details" }));

    let grid = container.Add(new xplore.Container());

    let spans = grid.Add(new xplore.NumericTextbox({ 
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

    let width = grid.Add(new xplore.NumericTextbox({ 
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

    let table = grid.Add(new xplore.Table({
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