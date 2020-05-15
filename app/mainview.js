var mainview = function () {
    this.canvas;
    this.tree;
    this.menu;
    this.model;
};

mainview.prototype = Object.create(xplore.prototype);
mainview.constructor = mainview;


let view = mainview.prototype;

view.Show = function () {
    //View
    let mainsplitter = new xplore.SplitContainer({
        orientation: xplore.ORIENTATION.VERTICAL,
        size: [64]
    });

    let container = mainsplitter.Add(new xplore.SplitContainer({
        orientation: xplore.ORIENTATION.VERTICAL
    }));

    this.menu = container.Add(new xplore.MenuContainer());
    this.toolbar = container.Add(new xplore.ToolbarContainer());

    //Splitter
    let splitter = mainsplitter.Add(new xplore.SplitContainer({
        size: [32]
    }));

    //Left toolbar
    this.leftoolbar = splitter.Add(new xplore.ToolbarContainer());

    //Canvas
    this.canvas = new xplore.Canvas2D();
    this.model = new structuremodel();
    this.canvas.model = this.model;

    splitter.Add(this.canvas);
    mainsplitter.Show();

    this.InitializeMenu();
    this.InitializeToolbar();
    this.InitializeLeftToolbar();
};

view.InitializeMenu = function () {
    let self = this;

    let file = this.menu.Add(new xplore.Menu({ text: "File" }));
    file.Add(new xplore.Menu({ icon: "file-outline", text: "New", shortcut: "CTRL+N" }));
    file.Add(new xplore.Menu({ icon: "folder-open-outline", text: "Open", shortcut: "CTRL+O", separator: true }));
    file.Add(new xplore.Menu({ icon: "content-save", shortcut: "CTRL+S", text: "Save" }));
    file.Add(new xplore.Menu({ icon: "content-save-move-outline", shortcut: "CTRL+SHIFT+S", text: "Save As..." }));

    let edit = this.menu.Add(new xplore.Menu({ text: "Edit" }));
    edit.Add(new xplore.Menu({ icon: "file-outline", text: "Undo" }));
    edit.Add(new xplore.Menu({ icon: "folder-open-outline", text: "Redo", separator: true }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Delete", shortcut: "DELETE", onclick: function () { self.Delete(); } }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Delete Nodes", onclick: function () { self.DeleteNodes(); } }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Delete Members", onclick: function () { self.DeleteMembers(); } }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Delete Nodal Loads", onclick: function () { self.DeleteNodalLoads(); } }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Delete Member Loads", onclick: function () { self.DeleteMemberLoads(); } }));
    edit.Add(new xplore.Menu({ icon: "content-save", text: "Supports", onclick: function () { self.DeleteSupports(); } }));

    let draw = this.menu.Add(new xplore.Menu({ text: "Draw" }));
    draw.Add(new xplore.Menu({ icon: "file-outline", text: "Node", shortcut: "N", onclick: function () { self.DrawNode(); } }));
    draw.Add(new xplore.Menu({ icon: "file-outline", text: "Member", shortcut: "M", onclick: function () { self.DrawMember(); } }));

    let select = this.menu.Add(new xplore.Menu({ text: "Select" }));
    select.Add(new xplore.Menu({ icon: "file-outline", text: "Select", onclick: function () { self.Select(); } }));
    select.Add(new xplore.Menu({ icon: "file-outline", text: "Deselect All", shortcut: "ESCAPE", onclick: function () { self.ClearSelection(); } }));

    this.menu.Refresh();
};

view.InitializeToolbar = function () {
    let toolbar = this.toolbar.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "file-outline" }));
    toolbar.Add(new xplore.Button({ icon: "folder-open-outline" }));
    toolbar.Add(new xplore.Button({ icon: "content-save" }));

    toolbar = this.toolbar.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "undo" }));
    toolbar.Add(new xplore.Button({ icon: "redo" }));
    toolbar.Add(new xplore.Button({ icon: "content-copy" }));
    toolbar.Add(new xplore.Button({ icon: "content-paste" }));

    toolbar = this.toolbar.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "cursor-default-outline" }));

    toolbar = this.toolbar.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ icon: "magnify-plus-outline" }));
    toolbar.Add(new xplore.Button({ icon: "magnify-minus-outline" }));
    toolbar.Add(new xplore.Button({ icon: "magnify-remove-outline" }));
    this.toolbar.Refresh();
};

view.InitializeLeftToolbar = function () {
    let self = this;

    let toolbar = this.leftoolbar.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({
        icon: "cursor-default-outline", onclick: function () {
            self.Select();
        }
    }));
    toolbar.Add(new xplore.Button({
        icon: "select-off", onclick: function () {
            self.ClearSelection();
        }
    }));
    toolbar.Add(new xplore.Button({
        icon: "square-medium-outline", onclick: function () {
            self.DrawNode();
        }
    }));
    toolbar.Add(new xplore.Button({
        icon: "vector-line", onclick: function () {
            self.DrawMember();
        }
    }));
    toolbar.Add(new xplore.Button({
        icon: "triangle-outline",
        onclick: function () {
            self.AssignSupport();
        }
    }));
    toolbar.Add(new xplore.Button({ icon: "download-network-outline" }));
    toolbar.Add(new xplore.Button({ icon: "arrow-collapse-down" }));

    this.toolbar.Refresh();
};


//File menu

view.FileNew = function () {
};

view.FileOpen = function () {
};

view.FileSave = function () {
};


//Edit menu

view.Delete = function () {
    this.DeleteNodes(true);
    this.DeleteNodalLoads(true);
    this.DeleteMembers(true);
    this.DeleteMemberLoads(true);
    this.DeleteSupports(true);

    this.canvas.Render();
};

view.DeleteNodes = function (norender) {
    this.model.DeleteNodes();

    if (!norender)
        this.canvas.Render();
};

view.DeleteNodalLoads = function (norender) {
    this.model.DeleteNodalLoads();

    if (!norender)
        this.canvas.Render();
};

view.DeleteMembers = function (norender) {
    this.model.DeleteMembers();

    if (!norender)
        this.canvas.Render();
};

view.DeleteMemberLoads = function (norender) {
    this.model.DeleteMemberLoads();

    if (!norender)
        this.canvas.Render();
};

view.DeleteSupports = function (norender) {
    this.model.DeleteSupports();

    if (!norender)
        this.canvas.Render();
};


//Draw

view.DrawNode = function () {
    this.canvas.StoreBuffer();
    this.canvas.Draw(structuregraphics.Node);
};

view.DrawMember = function () {
    this.canvas.StoreBuffer();
    this.canvas.Draw(structuregraphics.Member);
};


//Assign

view.AssignSupport = function () {
    let self = this;

    let form = new xplore.Form({
        text: "Assign Support",
        height: 320,
        onok: function () {
            self.model.AssignSupport(model.x.value ? 1: 0, model.y.value ? 1: 0, model.rx.value ? 1: 0, model.ry.value ? 1: 0);
            self.canvas.Render();
        }
    });

    let model = new supportmodel();
    form.Add(model);

    form.Show();
};


//Select

view.Select = function () {
    this.model.Select();
    this.canvas.Render();
};

view.ClearSelection = function () {
    this.Select();
    this.model.ClearSelection();
    this.canvas.Render();
};
