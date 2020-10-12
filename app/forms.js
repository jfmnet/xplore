var supportform = function (structure, canvas) {
    this.Show = function () {
        let form = new xplore.Form({
            text: "Assign Support",
            width: 320,
            height: 320,
            onok: function () {
                structure.AssignSupport(model.x.value ? 1 : 0, model.y.value ? 1 : 0, model.rx.value ? 1 : 0, model.ry.value ? 1 : 0);
                canvas.Render();
            }
        });

        let model = new supportmodel();
        form.Add(model);

        form.Show();
    };
};

var nodalloadform = function (structure, canvas) {
    this.Show = function () {
        let form = new xplore.Form({
            text: "Assign Joint Load",
            width: 320,
            height: 320,
            onok: function () {
                structure.AssignNodalLoad(parseFloat(model.x.value), parseFloat(model.y.value));
                canvas.Render();
            }
        });

        let model = new jointloadmodel();
        form.Add(model);

        form.Show();
    };
};

var memberloadform = function (structure, canvas) {
    this.Show = function () {
        let form = new xplore.Form({
            text: "Assign Member Load",
            width: 320,
            height: 320,
            onok: function () {
                structure.AssignMemberLoad(parseFloat(model.w1.value), parseFloat(model.w2.value), parseFloat(model.l1.value), parseFloat(model.l2.value));
                canvas.Render();
            }
        });

        let model = new memberloadmodel();
        form.Add(model);

        form.Show();
    };
};

var materialform = function () {
    this.Show = function () {
        let form = new xplore.Form({
            text: "Materials"
        });
        form.Show();
    };
};

var newmaterialform = function () {
    this.Show = function () {
    };
};

var generalform = function (text, model, itemmodel) {
    let leftpanel;
    let rightpanel;
    let listcontainer;
    let self = this;
    let formmodel;

    this.Show = function () {
        let form = new xplore.Form({
            text: text,
            height: 400,
            width: 600,
            onok: function () {
                for (let i = 0; i < formmodel.length; i++) {
                    model[i] = {};

                    for (let name in formmodel[i]) {
                        model[i][name] = formmodel[i][name].value
                    }
                }
            }
        });

        let splitter = form.Add(new xplore.SplitContainer({
            size: [240],
        }));

        form.Show();

        leftpanel = new xplore.Form({
            text: "Sections",
            modal: false,
            showfooter: false,
            showclose: false,
            buttons: [
                new xplore.Button({ icon: "plus", onclick: function () { self.Add(); } })
            ]
        });

        listcontainer = new xplore.ListContainer();
        leftpanel.Add(listcontainer);

        splitter.Set(leftpanel, 0);

        rightpanel = new xplore.ScrollContainer();
        splitter.Set(rightpanel, 1);

        this.GenerateList();
        this.ShowList();
    };

    this.GenerateList = function () {
        let item;

        formmodel = [];

        for (let i = 0; i < model.length; i++) {
            item = new itemmodel(model[i]);
            formmodel.push(item);
        }
    };

    this.ShowList = function () {
        listcontainer.Clear();

        for (let i = 0; i < formmodel.length; i++) {
            listcontainer.Add(new xplore.List({
                text: formmodel[i].name.value,
                tag: formmodel[i],
                onclick: function (sender) {
                    sender.tag.name.bind = { object: sender, name: "text", refresh: true };

                    rightpanel.Clear();
                    rightpanel.Add(sender.tag);
                    rightpanel.Refresh();
                }
            }));
        }

        listcontainer.Refresh();

        if (formmodel.length) {
            formmodel[0].name.bind = { object: listcontainer.children[0], name: "text", refresh: true };

            rightpanel.Clear();
            rightpanel.Add(formmodel[0]);
            rightpanel.Refresh();
        }
    };

    this.Add = function () {
        let section = new itemmodel();

        let form = new xplore.Form({
            text: "New Sections",
            width: 400,
            height: 300,
            onok: function () {
                if (!section.name.value)
                    section.name.value = "Section " + (model.length + 1);

                formmodel.push(section);
                self.ShowList();
            }
        });

        form.Add(section);
        form.Show();
    };
};