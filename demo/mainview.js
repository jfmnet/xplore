var mainview = xplore.Inherit(xplore.View);
let view = mainview.prototype;

view.OnLoad = function () {
    let self = this;

    //Set tile
    this.text = "xplore Demo";

    //Add splitter
    this.splitter = this.Add(new xplore.SplitContainer({
        splittersize: 4,
        size: [240]
    }));

    //Add list container
    let list = this.splitter.Add(new xplore.ListContainer());

    //Add items to the list container
    list.Add(new xplore.List({
        text: "Table",
        onclick: function () {
            self.ShowTable();
        }
    }));
};

view.ShowTable = function () {
    let data = [];
    let row;

    for (let i = 0; i < 50; i++) {
        row = [];

        for (let j = 0; j < 11; j++) {
            row.push(Math.round(Math.random() * 1000));
        }

        data.push(row);
    }

    let table = new xplore.Table({
        columns:
            //[{ text: "A", rowspan: 2 }, { text: "B", rowspan: 2 }, { text: "Header A", colspan: 4 }, { text: "Header B", colspan: 5 }],
            ["A", "B", "C", "D", "E", "G", "H", "I", "J", "K", "L"],
        data: data,
        fixedcolumns: 0,
        columnwidth: [75, 75],
        multiheader: false,
        sort: true,
        showfilter: true,
        //showsearch: true,
    });

    this.splitter.Set(table, 1);
};