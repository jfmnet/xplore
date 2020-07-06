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

var memberloadform = function (structure, canvas) {
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

var framesectionform = function (sections) {
    let leftpanel;
    let rightpanel;
    let listcontainer;
    let self = this;
    let model;

    this.Show = function () {
        let form = new xplore.Form({
            text: "Frame Sections",
            height: 400,
            width: 600,
            onok: function () {
                for (let i = 0; i < model.length; i++) {
                    sections[i] = {
                        name: model[i].name.value,
                        area: model[i].area.value,
                        iy: model[i].iy.value
                    };
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

        model = [];

        for (let i = 0; i < sections.length; i++) {
            item = new sectionmodel(sections[i]);
            model.push(item);
        }
    };

    this.ShowList = function () {
        listcontainer.Clear();

        for (let i = 0; i < model.length; i++) {
            listcontainer.Add(new xplore.List({ 
                text: model[i].name.value,
                tag: model[i],
                onclick: function (sender) {
                    rightpanel.Clear();
                    rightpanel.Add(sender.tag);
                    rightpanel.Refresh();
                } 
            }));
        }

        listcontainer.Refresh();
    };

    this.Add = function () {
        let section = new sectionmodel();

        let form = new xplore.Form({
            text: "New Sections",
            width: 400,
            height: 300,
            onok: function () {
                if (!section.name.value)
                    section.name.value = "Section " + (sections.length + 1);

                model.push(section);
                self.ShowList();
            }
        });

        form.Add(section);
        form.Show();
    };
};