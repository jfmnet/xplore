"use strict";

//Key events
document.onkeydown = function (event) {
    let key = "";

    if (event.ctrlKey)
        key += "ctrl+";

    if (event.shiftKey)
        key += "shift+";

    if (event.altKey)
        key += "alt+";

    key += event.key;

    key = key.toLowerCase();

    for (let i = 0; i < xplore.keydowns.length; i++)
        if (xplore.keydowns[i].keycode.toLowerCase() === key)
            if (xplore.keydowns[i].action)
                xplore.keydowns[i].action();
};


//Base
var xplore = function (param, element, classname) {
    param = param || {};

    this.element = element || param.element || "div";

    if (Array.isArray(classname))
        this.classname = classname;
    else
        this.classname = [classname];

    if (param.class)
        this.classname.push(classname);

    this.id = param.id;
    this.text = param.text || "";
    this.icon = param.icon || "";
    this.tag = param.tag;
    this.visible = param.visible === undefined ? true : param.visible;

    if (param.class) {
        if (param.class.includes(" ")) {
            let split = param.class.split(" ");

            for (let item of split) {
                this.classname.push(item);
            }
        } else {
            this.classname.push(param.class);
        }
    }

    this.object;
    this.parent;
    this.children = [];
    this.events = [];

    //Events
    this.onclick = param.onclick;
};

xplore.prototype.Show = function (parent) {
    if (parent && parent.appendChild) {
        this.parent = parent;
    } else {
        this.parent = document.body;
    }

    this.object = document.createElement(this.element);

    if (this.id)
        this.object.id = this.id;

    for (let i = 0; i < this.classname.length; i++) {
        if (this.classname[i])
            this.object.classList.add(this.classname[i]);
    }

    this.parent.appendChild(this.object);

    this.Refresh();
    this.ApplyProperties();
};

xplore.prototype.Dispose = function () {
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Dispose();
    }

    this.object.remove();
};

xplore.prototype.Refresh = function () {
    this.object.innerHTML = "";

    //Show icon
    if (this.icon)
        this.object.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    this.object.append(this.text);

    //Children
    this.RefreshChildren();

    this.Events();
};

xplore.prototype.RefreshChildren = function () {
    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.object);
    }
};

xplore.prototype.Events = function () {
    let self = this;

    if (this.onclick || this.events["onclick"]) {
        this.object.onclick = function () {
            if (self.onclick)
                self.onclick(self);

            self.Trigger("onclick");
        };
    }
};

xplore.prototype.Add = function (child) {
    if (child) {
        //Add array of components
        if (Array.isArray(child)) {
            for (let i = 0; i < child.length; i++) {
                if (child[i] && child[i].Show) {
                    this.children.push(child[i]);

                    if (this.object) {
                        child[i].Show(this.object);
                    }
                }
            }
        } else if (child.Show) {
            this.children.push(child);

            if (this.object) {
                child.Show(this.object);
            }

        } else {
            for (let name in child) {
                if (child[name] && child[name].Show) {
                    this.children.push(child[name]);

                    if (this.object) {
                        child[name].Show(this.object);
                    }
                }
            }
        }

        return child;
    }
};

xplore.prototype.Clear = function () {
    this.object.innerHTML = "";
    this.children = [];
};

xplore.prototype.ApplyProperties = function () {
    this.SetVisibility(this.visible);
};

xplore.prototype.SetVisibility = function (visibility) {
    this.visible = visibility;

    if (this.object) {
        if (visibility) {
            this.object.classList.remove("hidden");
        }
        else
            this.object.classList.add("hidden");
    } else {
        if (!visibility)
            this.classname.push("hidden");
    }
};

xplore.prototype.Highlight = function (highlight) {
    if (highlight === undefined)
        highlight = true;

    if (this.object) {
        if (highlight) {
            this.object.classList.add("highlight");
        }
        else
            this.object.classList.remove("highlight");
    } else {
        if (highlight)
            this.classname.push("highlight");
    }
};

xplore.prototype.SetState = function (state) {
    if (this.object) {
        if (state === xplore.STATE.ENABLED) {
            this.object.classList.remove("disabled");
        } else {
            this.object.classList.add("disabled");
        }
    } else {
        if (state === xplore.STATE.DISABLED) {
            this.classname.push("disabled");
        }
    }
};

xplore.prototype.Listen = function (name, param, event) {
    if (event) {
        //Initialize event name
        if (!this.events[name])
            this.events[name] = [];

        let add = true;

        //Check if event exists
        for (let e in this.events[name]) {
            if (this.events[name][e].event === event) {
                add = false;
                break;
            }
        }

        //Add event
        if (add)
            this.events[name].push({
                param: param,
                event: event
            });
    }
};

xplore.prototype.Trigger = function (name) {
    if (this.events[name]) {
        let event;

        for (let e in this.events[name]) {
            event = this.events[name][e];
            event.event(this, event.param);
        }
    }
};


//Button

xplore.Button = function (param) {
    xplore.call(this, param, undefined, "button");
};

xplore.Button.prototype = Object.create(xplore.prototype);
xplore.Button.constructor = xplore.Button;



//Textbox

xplore.Textbox = function (param) {
    xplore.call(this, param, undefined, ["input", "textbox"]);

    param = param || {};

    if (param.value === undefined)
        this.value = "";
    else
        this.value = param.value;

    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;

    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

xplore.Textbox.prototype = Object.create(xplore.prototype);
xplore.Textbox.constructor = xplore.Textbox;

xplore.Textbox.prototype.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        let input = document.createElement("input");
        input.type = this.type;

        if (this.value !== undefined)
            input.value = this.value;

        label.appendChild(input);

    } else {
        let input = document.createElement("input");
        input.type = this.type;

        if (this.value !== undefined)
            input.value = this.value;

        this.object.appendChild(input);

    }

    this.ApplyProperties();
    this.Events();
};

xplore.Textbox.prototype.Events = function () {
    let input = this.object.querySelector("input");
    let self = this;

    input.addEventListener('input', function () {
        self.value = this.value;

        if (self.bind) {
            self.bind.object[self.bind.name] = self.value;

            if (self.bind.refresh)
                self.bind.object.Refresh();
        }

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    });
};


//Textarea

xplore.TextArea = function (param) {
    xplore.call(this, param, undefined, ["input", "textarea"]);

    param = param || {};

    if (param.value === undefined)
        this.value = "";
    else
        this.value = param.value;

    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;

    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

xplore.TextArea.prototype = Object.create(xplore.prototype);
xplore.TextArea.constructor = xplore.TextArea;

xplore.TextArea.prototype.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        let input = document.createElement("textarea");
        input.value = this.value || "";

        label.appendChild(input);

    } else {
        let input = document.createElement("textarea");
        input.value = this.value || "";

        this.object.appendChild(input);

    }

    this.ApplyProperties();
    this.Events();
};

xplore.TextArea.prototype.Events = function () {
    let input = this.object.querySelector("textarea");
    let self = this;

    input.addEventListener('input', function () {
        self.value = this.value;

        if (self.bind) {
            self.bind.object[self.bind.name] = self.value;

            if (self.bind.refresh)
                self.bind.object.Refresh();
        }

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    });
};


//Checkbox

xplore.Checkbox = function (param) {
    xplore.call(this, param, undefined, ["input", "checkbox"]);

    param = param || {};

    this.value = param.value || "";
    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;
    this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

xplore.Checkbox.prototype = Object.create(xplore.prototype);
xplore.Checkbox.constructor = xplore.Checkbox;

xplore.Checkbox.prototype.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.value;

        label.appendChild(input);

    } else {
        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = this.value;

        this.object.appendChild(input);

    }

    this.Events();
};

xplore.Checkbox.prototype.Events = function () {
    let input = this.object.querySelector("input");
    let self = this;

    input.onclick = function () {
        self.value = this.checked;

        if (self.bind)
            self.bind.object[self.bind.name] = self.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    };
};


//Combobox

xplore.Combobox = function (param) {
    xplore.call(this, param, undefined, ["input", "combobox"]);

    param = param || {};

    this.value = param.value || "";
    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;
    this.options = param.options;

    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

xplore.Combobox.prototype = Object.create(xplore.prototype);
xplore.Combobox.constructor = xplore.Combobox;

xplore.Combobox.prototype.Refresh = function () {
    this.object.innerHTML = "";

    let select;

    if (this.text) {
        let text = document.createElement("div");
        text.innerText = this.text;
        this.object.appendChild(text);

        let label = document.createElement("label");
        this.object.appendChild(label);

        select = document.createElement("select");
        label.appendChild(select);

    } else {
        select = document.createElement("select");
        this.object.appendChild(select);
    }

    let option;

    for (let i = 0; i < this.options.length; i++) {
        option = document.createElement("option");
        option.value = this.options[i];
        option.innerHTML = this.options[i];
        select.appendChild(option);
    }

    select.selectedIndex = this.options.indexOf(this.value);
    this.Events();
};

xplore.Combobox.prototype.Events = function () {
    let select = this.object.querySelector("select");
    let self = this;

    select.onchange = function () {
        self.value = this.value;

        if (self.bind)
            self.bind.object[self.bind.name] = self.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    };
};


//Month-Year
xplore.MonthYear = function (param) {
    xplore.call(this, param, undefined, ["input", "month-year"]);

    param = param || {};

    this.value = param.value || "";
    this.onchange = param.onchange;
    this.bind = param.bind;

    this.maxyear = new Date().getFullYear();
    this.minyear = this.maxyear - 80;

    if (param.inline)
        this.classname.push("inline");

    if (this.bind && this.bind.object[this.bind.name])
        this.value = {
            month: this.bind.object[this.bind.name].month,
            year: this.bind.object[this.bind.name].year
        };
};

xplore.MonthYear.prototype = Object.create(xplore.prototype);
xplore.MonthYear.constructor = xplore.MonthYear;

xplore.MonthYear.prototype.Refresh = function () {
    this.object.innerHTML = "";

    let month, year;

    if (this.text) {
        let text = document.createElement("div");
        text.innerText = this.text;
        this.object.appendChild(text);

        let label = document.createElement("label");
        this.object.appendChild(label);

        month = document.createElement("select");
        label.appendChild(month);

        year = document.createElement("select");
        label.appendChild(year);

    } else {
        month = document.createElement("select");
        this.object.appendChild(month);

        year = document.createElement("select");
        this.object.appendChild(year);
    }

    let option;
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (let i = 0; i < months.length; i++) {
        option = document.createElement("option");
        option.value = months[i];
        option.innerHTML = months[i];
        month.appendChild(option);
    }

    for (let i = this.maxyear; i >= this.minyear; i--) {
        option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        year.appendChild(option);
    }

    month.selectedIndex = months.indexOf(this.value.month);
    year.value = this.value.year;
    this.Events();
};

xplore.MonthYear.prototype.Events = function () {
    let self = this;
    let select = this.object.querySelectorAll("select");
    let month = select[0];
    let year = select[1];

    month.onchange = function () {
        //self.value = this.value;

        if (self.bind)
            self.bind.object[self.bind.name].month = this.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    };

    year.onchange = function () {
        //self.value = this.value;

        if (self.bind)
            self.bind.object[self.bind.name].year = this.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    };
};

//Menu

xplore.MenuContainer = function (param) {
    xplore.call(this, param, undefined, "menu-container");

    param = param || {};
    this.shortcut = param.shortcut;
};

xplore.MenuContainer.prototype = Object.create(xplore.prototype);
xplore.MenuContainer.constructor = xplore.MenuContainer;


xplore.Menu = function (param) {
    xplore.call(this, param, undefined, "menu");

    param = param || {};
    this.shortcut = param.shortcut;
    this.separator = param.separator;

    if (this.shortcut)
        xplore.KeyDown(this.shortcut, this.onclick);
};

xplore.Menu.prototype = Object.create(xplore.prototype);
xplore.Menu.constructor = xplore.Menu;

xplore.Menu.prototype.Refresh = function () {
    this.object.innerHTML = "";
    this.object.tabIndex = '1';

    if (this.separator)
        this.object.classList.add("separator");

    let text = document.createElement("div");

    if (this.icon)
        text.appendChild(xplore.DisplayIcon(this.icon));
    else
        text.appendChild(document.createElement("div"));

    text.append(this.text);

    if (this.shortcut) {
        let shortcut = document.createElement("div");
        shortcut.innerText = this.shortcut;
        text.appendChild(shortcut);
    }

    this.object.appendChild(text);

    if (this.children.length) {
        //Children
        let submenu = document.createElement("div");
        this.object.appendChild(submenu);

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].parentmenu = this;
            this.children[i].Show(submenu);
        }
    }

    this.Events();
};

xplore.Menu.prototype.Events = function () {
    let self = this;

    if (this.children.length !== 0) {
        this.object.tabIndex = -1;
    }

    this.object.onclick = function (e) {
        e.stopPropagation();

        if (self.onclick) {
            self.parentmenu.Collapse();
            self.onclick(self);
        }
        else if (self.children.length) {
            self.object.classList.add("display");
            xplore.activemenu = self;

        } else {
            self.parentmenu.Collapse();
        }
    };

    this.object.onmouseenter = function () {
        self.onmenu = true;

        if (xplore.activemenu && self.children.length) {
            xplore.activemenu.Collapse();

            self.object.focus();
            self.object.classList.add("display");
            xplore.activemenu = self;
        }
    };

    this.object.onmouseleave = function () {
        self.onmenu = false;
    };

    this.object.addEventListener('focusout', function (event) {
        if (!self.onmenu) {
            self.onmenu = false;
            self.object.classList.remove("display");
            delete xplore.activemenu;
        }
    });
};

xplore.Menu.prototype.Collapse = function () {
    this.onmenu = false;
    this.object.classList.remove("display");
    delete xplore.activemenu;
};


//Toolbar

xplore.ToolbarContainer = function (param) {
    xplore.call(this, param, undefined, "toolbar-container");

    param = param || {};
    this.shortcut = param.shortcut;
};

xplore.ToolbarContainer.prototype = Object.create(xplore.prototype);
xplore.ToolbarContainer.constructor = xplore.ToolbarContainer;


xplore.Toolbar = function (param) {
    xplore.call(this, param, undefined, "toolbar");

    param = param || {};
    this.shortcut = param.shortcut;
};

xplore.Toolbar.prototype = Object.create(xplore.prototype);
xplore.Toolbar.constructor = xplore.Toolbar;


//Header

xplore.Header = function (param) {
    xplore.call(this, param, undefined, "header");
};

xplore.Header.prototype = Object.create(xplore.prototype);
xplore.Header.constructor = xplore.Header;


//List

xplore.List = function (param) {
    xplore.call(this, param, undefined, "list");
};

xplore.List.prototype = Object.create(xplore.prototype);
xplore.List.constructor = xplore.List;


//List container

xplore.ListContainer = function (param) {
    xplore.call(this, param, undefined, "list-container");

    this.activelist = 0;
};

xplore.ListContainer.prototype = Object.create(xplore.prototype);
xplore.ListContainer.constructor = xplore.ListContainer;

xplore.ListContainer.prototype.RefreshChildren = function () {
    let self = this;

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Listen("onclick", this.children[i], function (sender, param) {
            for (let i = 0; i < self.children.length; i++)
                self.children[i].Highlight(false);

            sender.Highlight();
        });

        this.children[i].Show(this.object);
    }

    if (this.children[this.activelist])
        this.children[this.activelist].Highlight();
};


//Scroll container

xplore.ScrollContainer = function (param) {
    xplore.call(this, param, undefined, "scroll-container");

    param = param || {};

    this.orientation = param.orientation || xplore.ORIENTATION.HORIZONTAL;
    this.splittersize = param.splittersize || 0;
    this.size = param.size;
    this.resizing;
};

xplore.ScrollContainer.prototype = Object.create(xplore.prototype);
xplore.ScrollContainer.constructor = xplore.ScrollContainer;


//Split container

xplore.SplitContainer = function (param) {
    xplore.call(this, param, undefined, "split-container");

    param = param || {};

    this.orientation = param.orientation || xplore.ORIENTATION.HORIZONTAL;
    this.splittersize = param.splittersize || 0;
    this.size = param.size;
    this.resizing;
};

xplore.SplitContainer.prototype = Object.create(xplore.prototype);
xplore.SplitContainer.constructor = xplore.SplitContainer;

xplore.SplitContainer.prototype.Refresh = function () {
    this.object.innerHTML = "";

    this.panel1 = document.createElement("div");
    this.gap = document.createElement("div");
    this.panel2 = document.createElement("div");

    this.object.appendChild(this.panel1);
    this.object.appendChild(this.gap);
    this.object.appendChild(this.panel2);
    this.Resize();

    //Children
    for (let i = 0; i < this.children.length && i < 2; i++) {
        this.Set(this.children[i], i);
    }

    this.Events();
};

xplore.SplitContainer.prototype.Resize = function () {
    let width = this.parent.clientWidth;
    let height = this.parent.clientHeight;
    let gap = this.splittersize / 2;

    if (this.size) {
        if (this.orientation) {
            //Vertical
            if (this.size[0] !== undefined) {
                this.panel1.style = "top: 0; height: " + this.size[0] + "px; left: 0; right: 0 ";
                this.panel2.style = "bottom: 0; top: " + (this.size[0] + this.splittersize) + "px; left: 0; right: 0 ";

                if (this.splittersize)
                    this.gap.style = "top: " + this.size[0] + "px; height: " + this.splittersize + "px; left: 0; right: 0 ";

            } else if (this.size[1]) {
                this.panel1.style = "left: 0; right: " + (this.size[1] + this.splittersize) + "px; top: 0; bottom: 0 ";
                this.panel2.style = "right: 0; width: " + this.size[1] + "px; top: 0; bottom: 0 ";

                if (this.splittersize)
                    this.gap.style = "right: " + this.size[1] + "px; width: " + this.splittersize + "px; top: 0; bottom: 0 ";
            }

        } else {
            //Horizontal

            if (this.size[0] !== undefined) {
                this.panel1.style = "left: 0; width: " + this.size[0] + "px; top: 0; bottom: 0 ";
                this.panel2.style = "right: 0; left: " + (this.size[0] + this.splittersize) + "px; top: 0; bottom: 0 ";
                this.gap.style = "left: " + this.size[0] + "px; width: " + this.splittersize + "px; top: 0; bottom: 0 ";

            } else if (this.size[1]) {
                this.panel1.style = "left: 0; right: " + (this.size[1] + this.splittersize) + "px; top: 0; bottom: 0 ";
                this.panel2.style = "right: 0; width: " + this.size[1] + "px; top: 0; bottom: 0 ";
                this.gap.style = "right: " + this.size[1] + "px; width: " + this.splittersize + "px; top: 0; bottom: 0 ";
            }
        }
    } else {
        if (this.orientation) {
            //Vertical
            this.panel1.style = "top: 0; height: calc(50% - " + gap + "px); left: 0; right: 0 ";
            this.panel2.style = "bottom: 0; height: calc(50% - " + gap + "px); left: 0; right: 0 ";

            if (this.splittersize)
                this.gap.style = "top: calc(50% - " + gap + "px); height: " + this.splittersize + "px; left: 0; right: 0 ";

        } else {
            //Horizontal
            this.panel1.style = "left: 0; width: calc(50% - " + gap + "px); top: 0; bottom: 0 ";
            this.panel2.style = "right: 0; width: calc(50% - " + gap + "px); top: 0; bottom: 0 ";

            if (this.splittersize)
                this.gap.style = "left: calc(50% - " + gap + "px); width: " + this.splittersize + "px; top: 0; bottom: 0 ";
        }
    }
};

xplore.SplitContainer.prototype.Set = function (child, index) {
    if (child) {
        let panel = index === 0 || index === undefined ? this.panel1 : this.panel2;

        //Add array of components
        if (Array.isArray(child)) {
            for (let i = 0; i < child.length; i++) {
                if (child[i] && child[i].Show) {
                    this.components
                    child[i].Show(panel);
                }
            }
        } else if (child.Show) {
            child.Show(panel);

        } else {
            for (let name in child) {
                if (child[child] && child[child].Show) {
                    child[child].Show(panel);
                }
            }
        }

        return child;
    }
};

xplore.SplitContainer.prototype.Events = function (child, index) {
    let self = this;

    this.gap.onmousedown = function (e) {
        self.resizing = true;
        self.currentx = e.clientX;
        self.currenty = e.clientY;
        self.gap.style.zIndex = 1;
        self.gap.style.right = "initial";

        document.body.onmousemove = function (e) {
            if (self.resizing) {
                self.gap.style.left = (e.clientX) + "px";

                self.currentx = e.clientX;
                self.currenty = e.clientY;
            }
        };
    };

    this.gap.onmouseup = function (e) {
        self.resizing = false;
        self.size = [e.clientX - self.splittersize / 2];
        self.gap.style.zIndex = "";

        document.body.onmousemove = undefined;
        self.Resize();
    };
};


//Container
xplore.Container = function (param) {
    xplore.call(this, param, undefined, "container");
};

xplore.Container.prototype = Object.create(xplore.prototype);
xplore.Container.constructor = xplore.Container;


//Dock panel

xplore.DockPanel = function (param) {
    xplore.call(this, param, undefined, "dock-panel");

    param = param || {};

    this.splittersize = param.splittersize || 0;
    this.size = param.size;
    this.resizing;
};

xplore.DockPanel.prototype = Object.create(xplore.prototype);
xplore.DockPanel.constructor = xplore.DockPanel;

xplore.DockPanel.prototype.Refresh = function () {
    this.object.innerHTML = "";

    this.left = document.createElement("div");
    this.gapleft = document.createElement("div");
    this.center = document.createElement("div");
    this.gapright = document.createElement("div");
    this.right = document.createElement("div");

    this.object.appendChild(this.left);
    this.object.appendChild(this.gapleft);
    this.object.appendChild(this.center);
    this.object.appendChild(this.gapright);
    this.object.appendChild(this.right);

    this.Resize();
    this.Events();
};

xplore.DockPanel.prototype.Resize = function () {
    let width = this.parent.clientWidth;
    let height = this.parent.clientHeight;
    let gap = this.splittersize;

    if (this.size) {
        if (this.orientation) {
            //Vertical

        } else {
            //Horizontal
            let center;

            if (this.size[0] !== undefined) {
                this.left.style = "left: 0; width: " + this.size[0] + "px; top: 0; bottom: 0 ";
                this.gapleft.style = "left: " + this.size[0] + "px; width: " + gap + "px; top: 0; bottom: 0 ";
                center = "left: " + (this.size[0] + gap) + "px;";

            } else {
                this.left.style = "left: 0; width: 25%; top: 0; bottom: 0 ";
                this.gapleft.style = "left: 25%; width: " + gap + "px; top: 0; bottom: 0 ";
                center = "left: calc(25% + " + gap + "px);";
            }

            if (this.size[1] !== undefined) {
                this.gapright.style = "right: " + this.size[1] + "px; width: " + gap + "px; top: 0; bottom: 0 ";
                this.right.style = "right: 0; width: " + this.size[1] + "px; top: 0; bottom: 0 ";
                center += "right: " + (this.size[1] + gap) + "px;";

            } else {
                this.gapright.style = "right: 25%; width: " + gap + "px; top: 0; bottom: 0 ";
                this.right.style = "right: 0; width: 25%; top: 0; bottom: 0 ";
                center += "right: calc(25% + " + gap + "px);";
            }

            this.center.style = center + "top: 0; bottom: 0 ";
        }
    } else {
        if (this.orientation) {
            //Vertical

        } else {
            //Horizontal
            this.left.style = "left: 0; width: 25%; top: 0; bottom: 0 ";
            this.gapleft.style = "left: 25%; width: " + gap + "px; top: 0; bottom: 0 ";
            this.center.style = "left: calc(25% + " + gap + "px); right: calc(25% + " + gap + "px); top: 0; bottom: 0 ";
            this.gapright.style = "right: 25%; width: " + gap + "px; top: 0; bottom: 0 ";
            this.right.style = "right: 0; width: 25%; top: 0; bottom: 0 ";
        }
    }
};

xplore.DockPanel.prototype.Add = function () {
};

xplore.DockPanel.prototype.Dock = function (child, index) {
    if (child) {
        let panel;

        if (index === 0)
            panel = this.left;

        else if (index === 2)
            panel = this.right;

        else
            panel = this.center;

        if (child.Show) {
            if (!child.classname.includes("dock"))
                child.classname.push("dock");

            if (child instanceof xplore.Form) {
                child.modal = false;
            }

            child.Show(panel);
        }

        return child;
    }
};

xplore.DockPanel.prototype.Set = function (child, index) {
    if (child) {
        let panel;

        if (index === 0)
            panel = this.left;

        else if (index === 2)
            panel = this.right;

        else
            panel = this.center;

        //Add array of components
        if (Array.isArray(child)) {
            for (let i = 0; i < child.length; i++) {
                if (child[i] && child[i].Show) {
                    child[i].Show(panel);
                }
            }
        } else if (child.Show) {
            child.Show(panel);

        } else {
            for (let name in child) {
                if (child[child] && child[child].Show) {
                    child[child].Show(panel);
                }
            }
        }

        return child;
    }
};

xplore.DockPanel.prototype.Events = function (child, index) {
    let self = this;

    this.gapleft.onmousedown = function (e) {
        self.resizing = true;
        self.currentx = e.clientX;
        self.currenty = e.clientY;
        self.gapleft.style.zIndex = 1;

        document.body.onmousemove = function (e) {
            if (self.resizing) {
                let left = (e.clientX - self.splittersize / 2);

                if (left < 0)
                    left = 0;

                self.gapleft.style.left = left + "px";

                self.currentx = e.clientX;
                self.currenty = e.clientY;
            }
        };
    };

    this.gapleft.onmouseup = function (e) {
        self.resizing = false;

        let left = (e.clientX - self.splittersize / 2);

        if (left < 0)
            left = 0;

        self.size = [left, self.size ? self.size[1] : undefined];
        self.gapleft.style.zIndex = "";

        document.body.onmousemove = undefined;
        self.Resize();
    };

    this.gapright.onmousedown = function (e) {
        self.resizing = true;
        self.currentx = e.clientX;
        self.currenty = e.clientY;
        self.gapright.style.zIndex = 1;

        document.body.onmousemove = function (e) {
            if (self.resizing) {
                let right = self.object.clientWidth - (e.clientX + self.splittersize / 2);

                if (right < 0)
                    right = 0;

                self.gapright.style.right = right + "px";

                self.currentx = e.clientX;
                self.currenty = e.clientY;
            }
        };
    };

    this.gapright.onmouseup = function (e) {
        self.resizing = false;
        let right = self.object.clientWidth - (e.clientX + self.splittersize / 2);

        if (right < 0)
            right = 0;

        self.size = [self.size ? self.size[0] : undefined, right];

        self.gapright.style.zIndex = "";

        document.body.onmousemove = undefined;
        self.Resize();
    };

    this.Listen("onmousemove", function (e) {
        if (!ShowDragPanel(e, self.left, 0))
            if (!ShowDragPanel(e, self.center, 1))
                if (!ShowDragPanel(e, self.right, 2)) {
                    if (self.dragover !== -1) {
                        self.dragpanel.remove();
                        delete self.dragpanel;
                    }

                    self.dragover = -1;
                }
    });

    this.Listen("onmouseup", function (e) {
        if (self.dragover !== -1) {
            self.dragcenter.remove();
            self.dragpanel.remove();
            delete self.dragpanel;
            delete self.dragcenter;
            delete self.dragobject;
        }

        self.dragover = -1;
    });

    function ShowDragPanel(e, panel, index) {
        if (e.currentx > panel.offsetLeft && e.currentx < (panel.offsetLeft + panel.offsetWidth)) {
            if (self.dragover !== index && self.dragpanel) {
                self.dragpanel.remove();
                delete self.dragpanel;
            }

            if (!self.dragpanel) {
                self.dragpanel = document.createElement("div");
                self.dragpanel.classList.add("drag-panel");
                panel.appendChild(self.dragpanel);

                self.dragcenter = document.createElement("i");
                self.dragcenter.classList.add("mdi");
                self.dragcenter.classList.add("mdi-arrow-expand-all");
                self.dragpanel.appendChild(self.dragcenter);

                self.dragobject = e;

                self.dragcenter.onmouseup = function () {
                    Dock();
                };

                self.dragpanel.onmouseup = function () {
                    self.dragobject.TerminateDrag();
                };
            }

            self.dragover = index;
            return true;
        }
    }

    function Dock() {
        let object = self.dragobject.object;
        object.offsetX = 0;
        object.offsetY = 0;

        object.style.left = self.dragpanel.parentElement.offsetLeft + "px";
        object.style.top = self.dragpanel.parentElement.offsetTop + "px";

        switch (self.dragover) {
            case 0:
                object.classList.add("dock");
                self.left.appendChild(object);

                break;

            case 1:
                object.classList.add("dock");
                self.center.appendChild(object);
                break;

            case 2:
                object.classList.add("dock");
                self.right.appendChild(object);
                break;
        }

        self.dragobject.TerminateDrag();
    }

};


//Tab

xplore.Tab = function (param) {
    xplore.call(this, param, undefined, "tab");

    param = param || {};
    this.style = param.style || xplore.TABSTYLE.NORMAL;
    this.tabs = param.tabs || [];
};

xplore.Tab.prototype = Object.create(xplore.prototype);
xplore.Tab.constructor = xplore.Tab;

xplore.Tab.prototype.Refresh = function () {
    let self = this;
    this.object.innerHTML = "";

    let header = document.createElement("div");
    header.classList.add("tab-header");

    if (this.style === xplore.TABSTYLE.FULL)
        header.classList.add("full");

    this.object.appendChild(header);

    let body = document.createElement("div");
    body.classList.add("tab-body");
    this.object.appendChild(body);

    let item;

    this.header = [];
    this.contents = [];

    for (let i = 0; i < this.tabs.length; i++) {
        item = new xplore.Button({
            icon: this.tabs[i].icon,
            text: this.tabs[i].text,
            tag: i,
            onclick: function (object) {
                self.SelectedIndex(object.tag);
            }
        });

        item.Show(header);
        this.header.push(item);

        item = document.createElement("div");
        body.appendChild(item);

        this.contents.push(item);
    }

    this.SelectedIndex(0);
};

xplore.Tab.prototype.SelectedIndex = function (index) {
    if (this.contents[index]) {
        this.header[index].object.classList.add("selected");
        this.contents[index].style.zIndex = 100;

        for (let i = 0; i < this.tabs.length; i++)
            if (index !== i) {
                this.header[i].object.classList.remove("selected");
                this.contents[i].style.zIndex = 0;
            }
    }
};

xplore.Tab.prototype.Set = function (object, index) {
    if (this.contents[index]) {
        if (object.object)
            this.contents[index].appendChild(object.object);
        else
            object.Show(this.contents[index]);
    }
};


//Form

xplore.Form = function (param) {
    xplore.call(this, param, undefined, "form");

    param = param || {};

    this.width = param.width || 400;
    this.height = param.height || 600;
    this.ok = param.oktext || "OK";
    this.cancel = param.canceltext || "Cancel";
    this.modal = true;

    this.buttons = param.buttons || [];

    this.showok = true;
    this.showcancel = true;
    this.showclose = true;

    this.showfooter = true;
    this.showheader = true;

    if (param.modal !== undefined)
        this.modal = param.modal;

    if (param.showok !== undefined)
        this.showok = param.showok;

    if (param.showcancel !== undefined)
        this.showcancel = param.showcancel;

    if (param.showclose !== undefined)
        this.showclose = param.showclose;

    if (param.showheader !== undefined)
        this.showheader = param.showheader;

    if (param.showfooter !== undefined)
        this.showfooter = param.showfooter;

    if (!this.showheader)
        this.classname.push("no-header");

    if (!this.showfooter)
        this.classname.push("no-footer");

    this.onok = param.onok;
    this.oncancel = param.oncancel;

    this.resizing;
};

xplore.Form.prototype = Object.create(xplore.prototype);
xplore.Form.constructor = xplore.Form;

xplore.Form.prototype.Refresh = function () {
    let self = this;

    if (this.modal) {
        this.background = new xplore.Background({
            onclick: function () {
                self.Dispose();
            }
        });

        this.background.Show();
    }

    this.object.innerHTML = "";

    if (this.showheader) {
        //Header
        this.header = document.createElement("div");
        this.header.classList.add("form-header");
        this.object.appendChild(this.header);
        this.RefreshHeader();
    }

    //Body
    this.body = document.createElement("div");
    this.body.classList.add("form-body");
    this.object.appendChild(this.body);
    this.RefreshBody();

    if (this.showfooter) {
        //Footer
        this.footer = document.createElement("div");
        this.footer.classList.add("form-footer");
        this.object.appendChild(this.footer);
        this.RefreshFooter();

    } else {
        this.object.classList.add("no-footer");
    }

    this.Resize();
    this.Events();
};

xplore.Form.prototype.RefreshHeader = function () {
    let self = this;

    this.header.innerHTML = "";

    let text = document.createElement("div");
    text.innerHTML = this.text;
    text.classList.add("text");
    this.header.appendChild(text);

    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    this.header.appendChild(buttons);

    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].Show(buttons);
    }

    if (this.showclose) {
        let button = new xplore.Button({
            text: xplore.DisplayIcon("close"),
            onclick: function () {
                self.Close();
            }
        });

        button.Show(buttons);
    }
};

xplore.Form.prototype.RefreshBody = function () {
    this.body.innerHTML = "";

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.body);
    }
};

xplore.Form.prototype.RefreshFooter = function () {
    let self = this;

    this.footer.innerHTML = "";

    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    this.footer.appendChild(buttons);

    let button = new xplore.Button({
        text: "OK",
        onclick: function () {
            if (self.onok)
                self.onok();

            self.Close();
        }
    });

    button.Show(buttons);

    button = new xplore.Button({
        text: "Cancel",
        class: "button-cancel",
        onclick: function () {
            if (self.oncancel)
                self.oncancel();

            self.Close();
        }
    });

    button.Show(buttons);
};

xplore.Form.prototype.Resize = function () {
    let w = window.innerWidth;
    let h = window.innerHeight;

    if (this.width > w)
        this.width = w - 32;

    if (this.height > h)
        this.height = h;

    let left = (w - this.width) / 2;
    let top = (h - this.height) / 2;

    this.object.style.width = this.width + "px";
    this.object.style.height = this.height + "px";
    this.object.style.left = left + "px";
    this.object.style.top = top + "px";

    this.object.style.zIndex = ++xplore.ZINDEX;
};

xplore.Form.prototype.Dispose = function () {
    xplore.ZINDEX -= 2;
    this.object.remove();

    if (this.modal)
        this.background.Dispose();
};

xplore.Form.prototype.Close = function () {
    this.Dispose();
};

xplore.Form.prototype.Events = function () {
    let self = this;

    if (this.showheader) {
        this.header.onmousedown = function (e) {
            self.resizing = true;
            self.currentx = e.clientX;
            self.currenty = e.clientY;

            document.body.onmousemove = function (e) {
                if (self.resizing) {
                    if (self.object.classList.value.indexOf(" dock") !== -1) {
                        if (Math.abs(e.clientX - self.currentx) > 10 || Math.abs(e.clientY - self.currenty) > 10) {
                            let width = self.object.offsetWidth;

                            self.object.classList.remove("dock");
                            document.body.appendChild(self.object);

                            if (e.clientX > width) {
                                self.object.style.left = (e.clientX - (width - e.offsetX)) + "px";
                                self.object.style.top = (e.clientY - e.offsetY) + "px";

                            } else {
                                self.object.style.left = (e.clientX - e.offsetX) + "px";
                                self.object.style.top = (e.clientY - e.offsetY) + "px";
                            }
                        }
                    } else {
                        self.object.style.left = self.object.offsetLeft + (e.clientX - self.currentx) + "px";
                        self.object.style.top = self.object.offsetTop + (e.clientY - self.currenty) + "px";

                        self.currentx = e.clientX;
                        self.currenty = e.clientY;
                    }

                    e.object = self;
                    self.Trigger("onmousemove", e);
                }
            };
        };

        this.header.onmouseup = function (e) {
            self.resizing = false;
            document.body.onmousemove = undefined;
            e.object = self.object;

            self.Trigger("onmouseup");
        };
    }
};

xplore.Form.prototype.TerminateDrag = function () {
    self.resizing = false;
    document.body.onmousemove = undefined;
    self.Trigger("onmouseup");
};


//View

xplore.View = function (param) {
    xplore.call(this, param, undefined, "view");

    param = param || {};
    this.tools = param.tools;
};

xplore.View.prototype = Object.create(xplore.prototype);
xplore.View.constructor = xplore.View;

let view = xplore.View.prototype;

view.Refresh = function () {
    let self = this;

    this.object.innerHTML = "";

    //Menu
    this.menu = document.createElement("div");
    this.menu.classList.add("view-menu");
    this.object.appendChild(this.menu);
    this.RefreshMenu();

    //Header
    this.header = document.createElement("div");
    this.header.classList.add("view-header");
    this.object.appendChild(this.header);
    this.RefreshHeader();

    //Body
    this.body = document.createElement("div");
    this.body.classList.add("view-body");
    this.object.appendChild(this.body);
    this.RefreshBody();

    this.Events();
};

view.RefreshMenu = function () {
    this.menuobject.Show(this.menu);
};

view.RefreshHeader = function () {
    let self = this;

    this.header.innerHTML = "";

    let button = new xplore.Button({
        text: xplore.DisplayIcon("menu"),
        onclick: function () {
            self.ShowMenu();
        }
    });

    button.Show(this.header);

    let text = document.createElement("div");
    text.innerHTML = this.text;
    text.classList.add("text");
    this.header.appendChild(text);

    let buttons = document.createElement("div");
    buttons.classList.add("buttons");
    this.header.appendChild(buttons);

    if (Array.isArray(this.tools))
        for (let tool of this.tools) {
            tool.Show(buttons);
        }
};

view.RefreshBody = function () {
    this.body.innerHTML = "";

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.body);
    }
};

view.ShowMenu = function () {
    if (!this.menuvisible) {
        this.menuvisible = true;
        this.object.classList.add("menu-show");
    } else {
        delete this.menuvisible;
        this.object.classList.remove("menu-show");
    }
};

view.SetMenu = function (object) {
    this.menuobject = object;
};


//Tree

xplore.Tree = function (param) {
    xplore.call(this, param, undefined, "tree");
};

xplore.Tree.prototype = Object.create(xplore.prototype);
xplore.Tree.constructor = xplore.Tree;


//Modal Background

xplore.Background = function (param) {
    xplore.call(this, param, undefined, "background");

    param = param || {}
    this.onclick = param.onclick;
};

xplore.Background.prototype = Object.create(xplore.prototype);
xplore.Background.constructor = xplore.Background;

xplore.Background.prototype.Refresh = function () {
    this.object.style.zIndex = ++xplore.ZINDEX;
    this.Events();
};



//Enums

xplore.STATE = {
    ENABLED: 1,
    DISABLED: 2
};

xplore.TABSTYLE = {
    NORMAL: 1,
    FULL: 2
};

xplore.POSITION = {
    TOP: 1,
    BOTTOM: 2,
    LEFT: 3,
    RIGHT: 4
};

xplore.ORIENTATION = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

xplore.FILEFORMAT = {
    NONE: 1,
    TEXT: 2
}


//Functions

xplore.DisplayIcon = function (icon) {
    let element = document.createElement("i");
    element.classList.add("mdi");
    element.classList.add("mdi-" + icon);

    return element;
};

xplore.OpenFile = function (format, extension, res) {
    let content = document.createElement("input");
    content.classList.add("hidden");
    content.setAttribute("type", "file");
    content.setAttribute("name", "options");

    if (extension)
        content.setAttribute("accept", extension);

    document.body.appendChild(content);
    content.click();

    content.addEventListener('change', function (e, data) {
        let files = [];

        for (let i = 0; i < this.files.length; i++) {
            if (format === xplore.FILEFORMAT.TEXT) {
                var reader = new FileReader();
                reader.readAsText(this.files[i]);

                reader.onload = function (readEvent) {
                    res(readEvent.target.result);
                }

            } else {
                res(this.files[i]);
            }
        }

        content.remove();
    });
}

xplore.ReadFile = function (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var contents = e.target.result;
        displayContents(contents);
    };

    reader.readAsText(file);
}

xplore.Round = function (num, precision) {
    num = parseFloat(num);
    if (!precision) return num;

    return Math.round(num / precision) * precision;
};

xplore.KeyDown = function (keycode, action) {
    xplore.keydowns.push({
        keycode: keycode,
        action: action
    });
};

xplore.GetJSON = function (url, resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (resolve)
                resolve(JSON.parse(this.responseText));
        } else {
            if (reject)
                resolve(this.responseText);
        }
    };
    xhttp.send();
};

xplore.Get = function (url, resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (resolve)
                resolve(this.responseText);
        } else {
            if (reject)
                resolve(this.responseText);
        }
    };
    xhttp.send();
};

xplore.PostJSON = function (url, data, resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (resolve)
                resolve(this.responseText);
        } else {
            if (reject)
                resolve(this.responseText);
        }
    };
    xhttp.send(JSON.stringify(data));
};

xplore.Post = function (url, data, resolve, reject) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (resolve)
                resolve(this.responseText);
        } else {
            if (reject)
                resolve(this.responseText);
        }
    };
    xhttp.send(data);
};

Number.prototype.CountDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

xplore.events = {};
xplore.keydowns = [];
xplore.ZINDEX = 100;


//Application start
window.onload = function () {
    if (xplore.main)
        xplore.main();
};
