var mainview = xplore.Inherit(xplore.View);
let view = mainview.prototype;

view.OnLoad = function () {
    let self = this;

    //Set tile
    this.text = "xplore Demo";

    //Add splitter
    this.splitter = this.Add(new xplore.SplitContainer({
        splittersize: 4,
        size: [320]
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

        for (let j = 0; j < 15; j++) {
            row.push(j + i);
        }

        data.push(row);
    }

    let table = new xplore.Table({
        columns: [
            [{ text: "Five Spans" }, { text: "F", rowspan: 2 }, "G", "H", "I", "J", "K", "L", "M", "N", "O"],
            ["A", "", "B", "C", "D", "E", "G", "H", "I", "J", "K", "L", "M", "N", "O"],
        ],
        multiheader: true,
        data: data,
        fixedcolumns: 2,
        columnwidth: [150, 50, 150]
    });

    this.splitter.Set(table, 1);
};