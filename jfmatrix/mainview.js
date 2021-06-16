var mainview = function () {
    this.canvas2d;
    this.canvas3d;
    this.NewModel();
};

mainview.prototype.Show = function () {
    let container = new xplore.SplitContainer({
        orientation: xplore.ORIENTATION.VERTICAL,
        size: [72]
    });

    container.Show();

    //Show menu and toolbar
    this.ShowMenuToolbar(container);

    //Show content
    this.ShowContent(container); 
};

mainview.prototype.ShowMenuToolbar = function (container) {
    let menutool = new xplore.SplitContainer({
        orientation: xplore.ORIENTATION.VERTICAL,
        size: [32]
    });

    container.Set(menutool, 0);

    //Show menu
    this.ShowMenu(menutool);
    this.ShowToolbar(menutool);
};

mainview.prototype.ShowMenu = function (container) {
    let menu = new xplore.MenuContainer();
    this.ShowFileMenu(menu);
    menu.Add(new xplore.Menu({ text: "Edit" }));
    menu.Add(new xplore.Menu({ text: "View" }));
    menu.Add(new xplore.Menu({ text: "Draw" }));
    this.ShowAssignMenu(menu);
    menu.Add(new xplore.Menu({ text: "Analyze" }));
    menu.Add(new xplore.Menu({ text: "Results" }));
    menu.Add(new xplore.Menu({ text: "Tools" }));
    menu.Add(new xplore.Menu({ text: "Help" }));
    container.Set(menu, 0);
};

mainview.prototype.ShowFileMenu = function (container) {
    let menu = container.Add(new xplore.Menu({ text: "File" }));
    menu.Add(new xplore.Menu({ text: "New Project", icon: "file-outline", shortcut: "CTRL+N" }));
    menu.Add(new xplore.Menu({ text: "Open Project", icon: "folder-outline", shortcut: "CTRL+O" }));
    menu.Add(new xplore.Menu({ text: "Save Project", icon: "content-save-outline", shortcut: "CTRL+S" }));
    menu.Add(new xplore.Menu({ text: "Save Project As", icon: "file" }));
};

mainview.prototype.ShowAssignMenu = function (container) {
    let self = this;

    let menu = container.Add(new xplore.Menu({ text: "Assign" }));
    menu.Add(new xplore.Menu({ text: "Assign Load", icon: "file-outline", onclick: function () { self.AssignLoad(); } }));
};

mainview.prototype.ShowToolbar = function (container) {
    let self = this;
    let toolcontainer = new xplore.ToolbarContainer();

    let toolbar = toolcontainer.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ 
        icon: "file-outline",
        onclick: function () {
            self.FileNew();
        } 
    }));
    toolbar.Add(new xplore.Button({ icon: "folder-outline" }));
    toolbar.Add(new xplore.Button({ icon: "content-save-outline" }));

    toolbar = toolcontainer.Add(new xplore.Toolbar());
    toolbar.Add(new xplore.Button({ 
        icon: "play",
        onclick: function () {
            self.Analyze();
        } 
    }));

    container.Set(toolcontainer, 1);
};

mainview.prototype.ShowContent = function (container) {
    let content = new xplore.SplitContainer({
       size: [280]
    });

    container.Set(content, 1);

    //Show Tree & Property
    this.ShowTreePropertyGrid(content);

    //Show Canvas
    this.ShowCanvas(content);
};

mainview.prototype.ShowTreePropertyGrid = function (container) {
    let content = new xplore.SplitContainer({
        orientation: xplore.ORIENTATION.VERTICAL
     });
 
     container.Set(content, 0);
 
     //Show Tree
     this.ShowTree(content);

     //Show PropertyGrid
     this.ShowPropertyGrid(content);
};

mainview.prototype.ShowTree = function (container) {
    let tree = new xplore.Tree({ text: "Model" });
    container.Set(tree, 0);
};

mainview.prototype.ShowPropertyGrid = function (container) {
    let property = new xplore.PropertyGrid({ text: "Properties" });
    container.Set(property, 1);
};

mainview.prototype.ShowCanvas = function (container) {
    let tab = new xplore.Tab({
        tabs: [
            { icon: "file", text: "2D View" },
            { icon: "file", text: "3D View" }
        ]
    });

    container.Set(tab, 1);

    //Show Canvas 2D
    this.ShowCanvas2D(tab);

    //Show Canvas 3D
    this.ShowCanvas3D(tab);
};

mainview.prototype.ShowCanvas2D = function (container) {
    this.canvas2d = new xplore.Canvas2D({
        showtoolbar: true,
        buttons: [
            new xplore.Button({
                icon: "arrow-expand-all",
                onclick: function () {
                    
                }
            })
        ]
    });

    this.canvas2d.model = this.model;
    this.canvas2d.settings.rulerposition = 0;
    container.Set(this.canvas2d, 0);
};

mainview.prototype.ShowCanvas3D = function (container) {
    this.canvas3d = new xplore.Canvas3D({
        showtoolbar: true
    });

    container.Set(this.canvas3d, 1);
};

mainview.prototype.RefreshCanvas2D = function () {
    this.canvas2d.Render();
};

mainview.prototype.RefreshCanvas3D = function () {
    this.canvas3d.Render();
};


//File menu

mainview.prototype.FileNew = function () {
    let self = this;

    let form = new wizard({
        onchange: function (data) {
            self.model.BeamWizard(data);
            self.canvas2d.Render();
        }
    });
    form.Show();
};

//Assign menu

mainview.prototype.AssignLoad = function () {
    let self = this;

    let form = new assignload(function (load) {
        self.model.AssignLoad(load);
        self.RefreshCanvas2D();
    });

    form.Show();
};


//Analyze Menu

mainview.prototype.Analyze = function () {
    this.model.Analyze();
};

//Model

mainview.prototype.NewModel = function () {
    this.model = new structuremodel();
};

