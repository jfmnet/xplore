var mainview = function () {
    this.canvas;
    this.tree;
};

mainview.prototype = Object.create(xplore.prototype);
mainview.constructor = mainview;

mainview.prototype.Show = function () {
    //View
    let view = new xplore.View({
        text: "View"
    });

    //Splitter
    let splitter = view.Add(new xplore.SplitContainer({
        splittersize: 4,
        size: [320]
    }));

    //Tree
    this.tree = new xplore.Tree();
    splitter.Add(this.tree);

    //Canvas
    this.canvas = new xplore.Canvas2D();
    splitter.Add(this.canvas);

    view.Show();

    this.DrawMember();
};

mainview.prototype.DrawMember = function () {
    this.canvas.Draw(xplore.Canvas2dGraphics.Line);
};