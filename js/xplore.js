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

xplore.Initialize = function (object) {
    object.prototype = Object.create(xplore.prototype);
    object.constructor = object;

    return object.prototype;
};

xplore.Inherit = function (parent) {
    let child = function () {
        parent.call(this);
    };

    child.prototype = Object.create(parent.prototype);
    child.constructor = child;

    return child;
};

xplore.constructor = xplore;
let prototype = xplore.prototype;

prototype.Show = function (parent) {
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

    if (this.Initialize)
        this.Initialize();

    let fragment = document.createDocumentFragment();
    fragment.appendChild(this.object);

    this.Refresh();
    this.ApplyProperties();

    this.parent.appendChild(fragment);

    if (this.Load)
        this.Load();
};

prototype.Dispose = function () {
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Dispose();
    }

    this.object.remove();
};

prototype.Refresh = function () {
    this.object.innerHTML = "";

    //Show icon
    if (this.icon)
        this.object.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    if (this.text)
        this.object.append(this.text);

    //Children
    this.RefreshChildren();

    this.Events();
};

prototype.RefreshChildren = function () {
    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.object);
    }
};

prototype.Events = function () {
    let self = this;

    if (this.onclick || this.events["onclick"]) {
        this.object.onclick = function () {
            if (self.onclick)
                self.onclick(self);

            self.Trigger("onclick");
        };
    }
};

prototype.Add = function (child) {
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

prototype.Clear = function () {
    this.object.innerHTML = "";
    this.children = [];
    this.Refresh();
};

prototype.ApplyProperties = function () {
    this.SetVisibility(this.visible);
};

prototype.SetVisibility = function (visibility) {
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

prototype.Highlight = function (highlight) {
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

prototype.SetState = function (state) {
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

prototype.Listen = function (name, param, event) {
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

prototype.Trigger = function (name) {
    if (this.events[name]) {
        let event;

        for (let e in this.events[name]) {
            event = this.events[name][e];
            event.event(this, event.param);
        }
    }
};

prototype.Bind = function (object) {
    for (let name in object) {
        this.Add(object[name]);
    }
};


//Header

xplore.Header = function (param) {
    xplore.call(this, param, undefined, ["input", "propertyheader"]);

    param = param || {};

    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;

    if (param.inline)
        this.classname.push("inline");

};

let propertyheader = xplore.Initialize(xplore.Header);

propertyheader.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

    } 

    this.ApplyProperties();
};

//Button

xplore.Button = function (param) {
    xplore.call(this, param, undefined, "button");
};

let button = xplore.Initialize(xplore.Button);

button.Refresh = function () {
    this.object.innerHTML = "";

    //Show icon
    if (this.icon)
        this.object.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    if (this.text) {
        let span = document.createElement("div");
        span.append(this.text);
        this.object.append(span);
    }

    //Bind events
    this.Events();
};


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
    this.readonly = param.readonly | false;
    
    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let textbox = xplore.Initialize(xplore.Textbox);

textbox.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        if (this.readonly) {
            let input = document.createElement("div");
    
            if (this.value !== undefined)
                input.innerHTML = this.value;
    
            label.appendChild(input);
    
        } else {
            let input = document.createElement("input");
            input.type = this.type;
    
            if (this.value !== undefined)
                input.value = this.value;
    
            label.appendChild(input);
        }

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

textbox.Events = function () {
    if (!this.readonly) {
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
    }
};


//Numeric Textbox

xplore.NumericTextbox = function (param) {
    xplore.call(this, param, undefined, ["input", "textbox numeric"]);

    param = param || {};

    if (param.value === undefined)
        this.value = "";
    else
        this.value = param.value;

    this.onchange = param.onchange;
    this.bind = param.bind;
    this.readonly = param.readonly | false;
    
    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let numtextbox = xplore.Initialize(xplore.NumericTextbox);

numtextbox.Refresh = function () {
    this.object.innerHTML = "";

    if (this.text) {
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        if (this.readonly) {
            let input = document.createElement("div");
    
            if (this.value !== undefined)
                input.innerHTML = this.value;
    
            label.appendChild(input);
    
        } else {
            let input = document.createElement("input");
            input.type = "number";
    
            if (this.value !== undefined)
                input.value = this.value;
    
            label.appendChild(input);
        }

    } else {
        let input = document.createElement("input");
        input.type = "number";

        if (this.value !== undefined)
            input.value = this.value;

        this.object.appendChild(input);

    }

    this.ApplyProperties();
    this.Events();
};

numtextbox.Events = function () {
    let input = this.object.querySelector("input");
    let self = this;

    input.addEventListener('input', function () {
        let value = parseFloat(this.value);

        self.value = value;

        if (self.bind) {
            self.bind.object[self.bind.name] = value;

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
    
    this.readonly = param.readonly | false;

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let textarea = xplore.Initialize(xplore.TextArea);

textarea.Refresh = function () {
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

textarea.Events = function () {
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
    this.readonly = param.readonly | false;

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let checkbox = xplore.Initialize(xplore.Checkbox);

checkbox.Refresh = function () {
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

checkbox.Events = function () {
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
    this.onchange = param.onchange;
    this.bind = param.bind;
    this.options = param.options;

    if (param.inline)
        this.classname.push("inline");
	
    this.readonly = param.readonly | false;

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let combobox = xplore.Initialize(xplore.Combobox);

combobox.Refresh = function () {
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

combobox.Events = function () {
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


//Dropdown

xplore.Dropdown = function (param) {
    xplore.call(this, param, undefined, "dropdown");

    param = param || {};

    this.value = param.value || "";
    this.onchange = param.onchange;
    this.bind = param.bind;
    this.options = param.options;

    if (param.inline)
        this.classname.push("inline");

    if (this.bind)
        this.value = this.bind.object[this.bind.name];
};

let dropdown = xplore.Initialize(xplore.Dropdown);

dropdown.Refresh = function () {
    let self = this;

    this.object.innerHTML = "";

    let value = document.createElement("div");
    this.value.Show(value);
    this.object.appendChild(value);

    if (this.options.length) {
        //Children
        let submenu = document.createElement("div");
        this.object.appendChild(submenu);

        for (let i = 0; i < this.options.length; i++) {
            this.options[i].parentmenu = this;
            this.options[i].onclick = function (option) {
                self.value = option;
                self.Refresh();
            };
            this.options[i].Show(submenu);
        }
    }

    this.Events();
};

dropdown.Events = function () {
    let self = this;

    if (this.options.length !== 0) {
        this.object.tabIndex = -1;
    }

    this.object.onclick = function (e) {
        e.stopPropagation();

        if (xplore.activemenu === self) {
            self.object.classList.remove("display");
            delete xplore.activemenu;

        } else {
            self.object.classList.add("display");
            xplore.activemenu = self;
        }
    };

    this.object.onmouseenter = function () {
        self.onmenu = true;

        if (xplore.activemenu && self.options.length) {
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

dropdown.Collapse = function () {
    this.onmenu = false;
    this.object.classList.remove("display");
    delete xplore.activemenu;
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

let monthyear = xplore.Initialize(xplore.MonthYear);

monthyear.Refresh = function () {
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

monthyear.Events = function () {
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

xplore.Initialize(xplore.MenuContainer);


xplore.Menu = function (param) {
    xplore.call(this, param, undefined, "menu");

    param = param || {};
    this.shortcut = param.shortcut;
    this.separator = param.separator;

    if (this.shortcut)
        xplore.KeyDown(this.shortcut, this.onclick);
};

let menu = xplore.Initialize(xplore.Menu);

menu.Refresh = function () {
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

menu.Events = function () {
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

        if (xplore.activemenu && self.parentmenu !== xplore.activemenu && self.children.length) {
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

menu.Collapse = function () {
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

let list = xplore.Initialize(xplore.List);

list.Refresh = function () {
    this.object.innerHTML = "";

    //Show icon
    if (this.icon)
        this.object.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    if (this.text) {
        let text = document.createElement("div");
        text.classList.add("text");
        text.innerText = this.text;
        this.object.append(text);
    }


    //Children
    this.RefreshChildren();

    this.Events();
};

//List container

xplore.ListContainer = function (param) {
    xplore.call(this, param, undefined, "list-container");

    this.activelist = 0;
};

let listcontainer = xplore.Initialize(xplore.ListContainer);

listcontainer.RefreshChildren = function () {
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

xplore.Initialize(xplore.ScrollContainer);


//Split container

xplore.SplitContainer = function (param) {
    xplore.call(this, param, undefined, "split-container");

    param = param || {};

    this.orientation = param.orientation || xplore.ORIENTATION.HORIZONTAL;
    this.splittersize = param.splittersize || 0;
    this.size = param.size;
    this.resizing;
};

let splitcontainer = xplore.Initialize(xplore.SplitContainer);

splitcontainer.Refresh = function () {
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

splitcontainer.Resize = function () {
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
                this.panel1.style = "top: 0; bottom: " + this.size[1] + "px; left: 0; right: 0 ";
                this.panel2.style = "bottom: 0; height: " + (this.size[1] + this.splittersize) + "px; left: 0; right: 0 ";

                if (this.splittersize)
                    this.gap.style = "bottom: " + this.size[1] + "px; height: " + this.splittersize + "px; left: 0; right: 0 ";
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

splitcontainer.Set = function (child, index) {
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
            panel.innerHTML = "";
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

splitcontainer.Events = function (child, index) {
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

xplore.Initialize(xplore.Container);


//Dock panel

xplore.DockPanel = function (param) {
    xplore.call(this, param, undefined, "dock-panel");

    param = param || {};

    this.splittersize = param.splittersize || 0;
    this.size = param.size;
    this.resizing;
};

let dockpanel = xplore.Initialize(xplore.DockPanel);

dockpanel.Refresh = function () {
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

dockpanel.Resize = function () {
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

dockpanel.Add = function () {
};

dockpanel.Dock = function (child, index) {
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

dockpanel.Set = function (child, index) {
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

dockpanel.Events = function (child, index) {
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

    switch (param.position) {
        case xplore.POSITION.TOP:
            this.classname.push("top");
            break;

        case xplore.POSITION.BOTTOM:
            this.classname.push("bottom");
            break;

        case xplore.POSITION.LEFT:
            this.classname.push("left");
            break;

        case xplore.POSITION.RIGHT:
            this.classname.push("right");
            break;

        default:
            break;
    }
};

let tab = xplore.Initialize(xplore.Tab);

tab.Refresh = function () {
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

tab.SelectedIndex = function (index) {
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

tab.Set = function (object, index) {
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

    if (param.transparent !== undefined)
        this.transparent = param.transparent;

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

let xform = xplore.Initialize(xplore.Form);

xform.Refresh = function () {
    let self = this;

    if (this.modal) {
        this.background = new xplore.Background({
            transparent: this.transparent,
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

xform.RefreshHeader = function () {
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

xform.RefreshBody = function () {
    this.body.innerHTML = "";

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.body);
    }
};

xform.RefreshFooter = function () {
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

xform.Resize = function () {
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

xform.Position = function (left, top) {
    if (left + this.width > window.innerWidth) {
        left = window.innerWidth - this.width;
    }

    this.object.style.left = left + "px";
    this.object.style.top = top + "px";
};

xform.Dispose = function () {
    xplore.ZINDEX -= 2;
    this.object.remove();

    if (this.modal)
        this.background.Dispose();
};

xform.Close = function () {
    this.Dispose();
};

xform.Events = function () {
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

xform.TerminateDrag = function () {
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

let xploreview = xplore.Initialize(xplore.View);

xploreview.Refresh = function () {
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

xploreview.RefreshMenu = function () {
};

xploreview.RefreshHeader = function () {
    let self = this;

    this.header.innerHTML = "";

    let button = new xplore.Button({
        icon: "menu",
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

    let container = document.createElement("div");
    buttons.appendChild(container);

    if (Array.isArray(this.tools))
        for (let tool of this.tools) {
            tool.Show(container);
        }
};

xploreview.RefreshBody = function () {
    this.body.innerHTML = "";

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.body);
    }
};

xploreview.ShowMenu = function () {
    if (!this.menuvisible) {
        this.menuvisible = true;
        this.object.classList.add("menu-show");
    } else {
        delete this.menuvisible;
        this.object.classList.remove("menu-show");
    }
};

xploreview.SetMenu = function (object) {
    this.menuobject = object;
};

//PropertyGrid

xplore.PropertyGrid = function (param) {
    xplore.call(this, param, undefined, "propertygrid");
};

let xpropertygrid = xplore.Initialize(xplore.PropertyGrid);

xpropertygrid.Refresh = function () {
    this.object.innerHTML = "";

    let header = document.createElement("div");
    header.classList.add("propertygrid-header");
    this.object.appendChild(header);

    //Show icon
    if (this.icon)
        header.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    if (this.text)
        header.append(this.text);

    //Children
    this.RefreshChildren();

    this.Events();
};
//Tree

xplore.Tree = function (param) {
    xplore.call(this, param, undefined, "tree");
};

let xtree = xplore.Initialize(xplore.Tree);

xtree.Refresh = function () {
    this.object.innerHTML = "";

    let header = document.createElement("div");
    header.classList.add("tree-header");
    this.object.appendChild(header);

    //Show icon
    if (this.icon)
        header.appendChild(xplore.DisplayIcon(this.icon));

    //Show text
    if (this.text)
        header.append(this.text);

    //Children
    this.RefreshChildren();

    this.Events();
};

//Treenode

xplore.TreeNode = function (param) {
    xplore.call(this, param, undefined, "treenode");

    this.data = param.data;

    if (!this.icon) {
        this.icon = "chevron-right";
    }
};

let xtreenode = xplore.Initialize(xplore.TreeNode);

xtreenode.Events = function () {
    let self = this;

    this.object.onclick = function (e) {
        e.stopPropagation();

        if (this.children.length === 1) {
            self.onclick(self);

        } else {
            if (this.classList.contains("expand")) {
                this.classList.remove("expand");
                this.children[0].classList.remove("mdi-chevron-down");
                this.children[0].classList.add("mdi-chevron-right");
            }
            else {
                this.classList.add("expand");
                this.children[0].classList.remove("mdi-chevron-right");
                this.children[0].classList.add("mdi-chevron-down");
            }
        }
    };
};

//Table

xplore.Table = function (param) {
    xplore.call(this, param, undefined, "table");

    this.columns = param.columns;
    this.data = param.data;
    this.columnwidth = param.columnwidth || 100;
    this.pagesize = param.pagesize || 1000;
    this.page = 1;
    this.fixedcolumns = param.fixedcolumns || 0;
    this.multiheader = param.multiheader || false;
    this.sort = param.sort || false;
    this.showfilter = param.showfilter || false;
    this.showsearch = param.showsearch || false;
    this.filters = param.showsearch || {};
};

let table = xplore.Initialize(xplore.Table);

table.id = 0;

table.Refresh = function () {
    // Table
    this.table = document.createElement("table");
    this.object.appendChild(this.table);

    //Header
    this.header = document.createElement("thead");
    this.header.classList.add("table-header");
    this.table.appendChild(this.header);
    this.RefreshHeader();

    //Body
    this.body = document.createElement("tbody");
    this.body.classList.add("table-body");
    this.table.appendChild(this.body);
    this.RefreshBody();

    //Footer
    this.footer = document.createElement("tfoot");
    this.footer.classList.add("table-footer");
    this.table.appendChild(this.footer);
    this.RefreshFooter();

    //Table style
    this.style = document.createElement("style");
    document.body.appendChild(this.style);

    //Resize columns
    this.Resize();

    //Bind Events
    this.Events();
};

table.RefreshHeader = function () {
    let columns;

    if (this.multiheader)
        columns = this.columns;
    else
        columns = [this.columns];

    let td;
    let tr;
    let rowcounter = 0;
    let tool;
    let element;
    let counter = 0;
    let cellcounter = 0;

    this.header.innerHTML = "";

    for (let row of columns) {
        tr = document.createElement("tr");
        tr.classList.add("row-" + rowcounter);

        this.header.appendChild(tr);

        // Empty
        if (rowcounter === 0) {
            td = document.createElement("th");
            td.rowSpan = columns.length;
            tr.appendChild(td);
        }

        counter = 0;
        cellcounter = 0;

        if (this.sort) {
            for (let i = 0; i < row.length; i++) {
                if (row[i].text === undefined) {
                    row[i] = {
                        text: row[i]
                    }
                }
            }
        }

        for (let header of row) {
            if (header === "" || header.text === "") {
                counter++;
                continue;
            }

            // Text
            td = document.createElement("th");

            //Add class to the first non-empty header cell. Do it only once.
            if (cellcounter === 0) {
                td.classList.add("cell-first");
                cellcounter++;
            }

            if (header.colspan)
                td.colSpan = header.colspan;

            if (header.rowspan)
                td.rowSpan = header.rowspan;

            if (counter < this.fixedcolumns)
                td.classList.add("table-fixed-column");

            td.classList.add("table-column-" + counter);

            if (this.sort)
                td.classList.add("table-sort");

            if (header.text)
                td.innerText = header.text;
            else
                td.innerText = header;

            if (this.showfilter || this.sort) {
                tool = document.createElement("th");
                tool.classList.add("header-tool");

                if (header.sort !== undefined) {
                    tool.classList.add("show-sort");
                }

                if (this.filters) {
                    for (let index in this.filters) {
                        if (counter === index) {
                            tool.classList.add("show-filter");
                            break;
                        }
                    }
                }

                if (this.sort) {
                    element = xplore.DisplayIcon("sort-alphabetical-ascending");
                    element.classList.add("header-sort");
                    element.header = header;
                    tool.appendChild(element);
                }

                if (this.showfilter) {
                    element = xplore.DisplayIcon("filter-outline");
                    element.classList.add("header-filter");
                    element.header = { name: header, index: counter };
                    tool.appendChild(element);
                }

                td.appendChild(tool);
            }

            //sort-alphabetical-descending

            tr.appendChild(td);
            counter++;
        }

        rowcounter++;
    }

    if (this.showsearch) {
        let row = columns[columns.length - 1];

        tr = document.createElement("tr");
        tr.classList.add("row-" + rowcounter);

        this.header.appendChild(tr);

        td = document.createElement("th");
        td.rowSpan = columns.length;
        tr.appendChild(td);

        let counter = 0;
        let input;

        for (let header of row) {
            td = document.createElement("th");
            td.classList.add("th-search-cell");

            if (counter < this.fixedcolumns)
                td.classList.add("table-fixed-column");

            td.classList.add("table-column-" + counter);

            if (this.sort)
                td.classList.add("table-sort");

            input = document.createElement("input");
            td.appendChild(input);
            tr.appendChild(td);

            counter++;
        }
    }
};

table.RefreshBody = function () {
    let td;
    let counter = 0;
    let row;
    let start = (this.page - 1) * this.pagesize;
    let end = this.page * this.pagesize;

    if (end > this.data.length)
        end = this.data.length;

    this.body.innerHTML = "";

    //Sort
    if (this.sort) {
        let columns;

        if (this.multiheader)
            columns = this.columns;
        else
            columns = [this.columns];

        let row = columns[columns.length - 1];
        let text;
        let dir;

        counter = 0;

        for (let header of row) {
            if (header.sort !== undefined) {
                text = header.text;
                dir = header.sort ? 1 : -1;

                this.data.sort(function (a, b) {
                    if (a[counter] > b[counter])
                        return 1 * dir;
                    else if (a[counter] < b[counter])
                        return -1 * dir;
                    else
                        return 0;
                });

                break;
            }

            counter++;
        }
    }

    let data = this.data;

    // Filter

    if (this.filters) {
        let filtered = [];
        let handle = true;
        let add;

        for (let row of data) {
            add = true;

            for (let index in this.filters) {
                handle = false;

                for (let filter of this.filters[index]) {
                    if (row[index] === filter) {
                        handle = true;
                        break;
                    }
                }

                if (!handle) {
                    add = false;
                    break;
                }
            }

            if (add)
                filtered.push(row);
        }

        if (filtered.length) {
            data = filtered;

            start = (this.page - 1) * this.pagesize;
            end = this.page * this.pagesize;

            if (end > data.length)
                end = data.length;
        }
    }


    for (let i = start; i < end; i++) {
        // Row
        row = document.createElement("tr");
        this.body.appendChild(row);

        counter = 0;

        // Row header
        td = document.createElement("td");
        td.innerText = i + 1;
        row.appendChild(td);

        for (let cell of data[i]) {
            // Text
            td = document.createElement("td");

            if (counter < this.fixedcolumns)
                td.classList.add("table-fixed-column");

            td.classList.add("table-column-" + counter++);
            td.innerText = cell;
            row.appendChild(td);
        }
    }
};

table.RefreshFooter = function () {
};

table.Resize = function () {
    let columns;

    if (this.multiheader)
        columns = this.columns;
    else
        columns = [this.columns];


    // Get the number of columns
    let length = 0;

    for (let i = 0; i < columns.length; i++) {
        if (length < columns[i].length)
            length = columns[i].length;
    }

    if (Array.isArray(this.columnwidth)) {
        if (length > this.columnwidth.length) {
            for (let i = this.columnwidth.length - 1; i < length; i++) {
                this.columnwidth.push(100);
            }
        }
    } else {
        let width = this.columnwidth;
        this.columnwidth = [];

        for (let i = 0; i < length; i++) {
            this.columnwidth.push(100);
        }
    }

    let style = "";

    for (let i = 0; i < this.columnwidth.length; i++) {
        style += ".table-column-" + i + " { min-width: " + this.columnwidth[i] + "px; max-width: " + this.columnwidth[i] + "px } ";
    }

    let left = 48;

    for (let i = 0; i < this.fixedcolumns; i++) {
        style += ".table-column-" + i + " { position: sticky; left: " + left + "px; }";
        left += this.columnwidth[i] + 1;
    }

    this.style.innerHTML = style;
};

table.Events = function () {
    let self = this;
    let input;
    let cell;
    let cells = [];
    let movecell;
    let timeout;
    let counter = 0;
    let cellindexdown;
    let rowindexdown;
    let cellindexmove;
    let rowindexmove;
    let down;
    let selectedclass = "table-cell-selected";
    let selectedrowclass = "table-row-selected";

    let headerrow = this.multiheader ? this.columns.length : 1;

    if (this.showsearch)
        headerrow++;

    this.object.onmousedown = function (e) {
        e.stopPropagation();

        //Get the column and row index of the clicked cell
        cellindexdown = e.path[0].cellIndex;
        rowindexdown = e.path[1].rowIndex - (headerrow - 1);

        //Check if cell is clicked
        if (cellindexdown !== undefined) {
            //Clear selected cells
            ClearSelected();

            //Remove input after losing focus
            if (input) {
                cell.innerHTML = input.value;
                input = undefined;
            }

            if (cell)
                cell.classList.remove(selectedclass);

            cell = e.path[0];

            if (cellindexdown === 0) {
                cell.classList.add(selectedrowclass);
                let endcolindex = self.data[0].length;

                let children = e.path[2].children[rowindexdown - 1];
                let movecell;

                for (let j = 0; j <= endcolindex; j++) {
                    movecell = children.children[j];
                    cells.push(movecell);
                    movecell.classList.add(selectedrowclass);
                }
            }
            else {
                cell.classList.add(selectedclass);

                counter++;

                //Check for double click
                if (counter == 2) {
                    //Clear timer
                    clearTimeout(timeout);

                    //Reset counter for the next double-click
                    counter = 0;

                    let text = cell.innerText;

                    //Replace text with input
                    input = document.createElement("input");
                    input.type = "text";
                    input.value = text;

                    //Check when ENTER key is pressed
                    input.onkeydown = function (key) {
                        if (key.key === "Enter") {
                            //Remove input and put back the value
                            cell.innerHTML = input.value;
                        }
                    };

                    cell.innerHTML = "";
                    cell.append(input);

                    if (input.createTextRange) {
                        let range = input.createTextRange();
                        range.move('character', text.length);
                        range.select();
                    }
                    else {
                        if (input.selectionStart) {
                            input.focus();
                            input.setSelectionRange(text.length, text.length);
                        }
                        else
                            input.focus();
                    }

                } else {
                    //Clear timer if already defined
                    if (timeout)
                        clearTimeout(timeout);

                    //Set a timer for the double-click
                    timeout = setTimeout(function () {
                        //It is not double-click.
                        //Reset counter and timer
                        counter--;
                        timeout = undefined;
                    }, 250);
                }
            }

            cells.push(cell);
        }
    };

    this.object.onmousemove = function (e) {
        if (e.buttons !== 0) {
            if (cellindexmove !== e.path[0].cellIndex || rowindexmove !== e.path[1].rowIndex) {
                cellindexmove = e.path[0].cellIndex;
                rowindexmove = e.path[1].rowIndex - (headerrow - 1);

                //Check if cell is clicked
                if (cellindexmove !== undefined) {
                    ClearSelected();

                    let startcolindex = Math.min(cellindexdown, cellindexmove);
                    let endcolindex = Math.max(cellindexdown, cellindexmove);
                    let rowselected = false

                    if (startcolindex === 0) {
                        endcolindex = self.data[0].length;
                        rowselected = true;
                    }

                    let startrowindex = Math.min(rowindexdown, rowindexmove);
                    let endrowindex = Math.max(rowindexdown, rowindexmove);

                    let children;

                    for (let i = startrowindex - 1; i < endrowindex; i++) {
                        children = e.path[2].children[i];

                        if (children) {
                            for (let j = startcolindex; j <= endcolindex; j++) {
                                movecell = children.children[j];
                                cells.push(movecell);

                                if (rowselected)
                                    movecell.classList.add(selectedrowclass);
                                else
                                    movecell.classList.add(selectedclass);
                            }
                        }
                    }
                }
            }
        }
    };

    function ClearSelected() {
        for (let selectedcell of cells) {
            if (selectedcell.classList.contains(selectedclass))
                selectedcell.classList.remove(selectedclass);

            if (selectedcell.classList.contains(selectedrowclass))
                selectedcell.classList.remove(selectedrowclass);
        }

        cells = [];
    };

    //Sort

    let headersorts = this.object.querySelectorAll(".header-sort");

    for (let sort of headersorts) {
        sort.onclick = function (object) {
            let header = object.currentTarget.header;
            let sort = header.sort;

            //Clear current sort
            for (let current of headersorts) {
                delete current.header.sort;
            }

            header.sort = !sort;
            self.RefreshBody();
        };
    }

    //Filter

    let headerfilter = this.object.querySelectorAll(".header-filter");

    for (let filter of headerfilter) {
        filter.onclick = function (object) {
            let header = object.currentTarget.header;
            let filter = header.filter;
            let rect = object.currentTarget.parentElement.parentElement.getBoundingClientRect();

            let form = new xplore.Form({
                text: "Filter",
                transparent: true,
                onok: function () {
                    let filter = [];

                    for (let item of scroll.children) {
                        if (item.value) {
                            filter.push(item.text);
                        }
                    }

                    self.filters[header.index] = filter;
                    self.page = 1;
                    self.RefreshBody();
                }
            });

            let unique = {};
            let values = [];

            for (let row of self.data) {
                if (unique[row[header.index]] === undefined) {
                    unique[row[header.index]] = row[header.index];
                    values.push(row[header.index]);
                }
            }

            values.sort(function (a, b) {
                if (a > b)
                    return 1;
                else if (a < b)
                    return -1;
                else
                    return 0;
            });

            let scroll = form.Add(new xplore.ScrollContainer());

            for (let value of values) {
                scroll.Add(new xplore.Checkbox({
                    text: value
                }));
            }

            form.Show();
            form.Position(rect.left, rect.height + rect.top);

            // //Clear current sort
            // for (let current of headersorts) {
            //     delete current.header.filter;
            // }

        };
    }
};

table.Dispose = function () {
    this.style.remove();
    this.object.remove();
};


//Modal Background

xplore.Background = function (param) {
    xplore.call(this, param, undefined, "background");

    param = param || {}
    this.onclick = param.onclick;

    if (param.transparent)
        this.classname.push("transparent");
};

let background = xplore.Initialize(xplore.Background);

background.Refresh = function () {
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
};

xplore.FILEFORMAT = {
    NONE: 1,
    TEXT: 2
};

xplore.COLUMNTYPE = {
    TEXT: 1,
    CHECKBOX: 2,
    COMBOBOX: 3,
    CUSTOM: 4
};


//Functions

xplore.DisplayIcon = function (icon) {
    let element;

    if (icon.includes(".jpg") || icon.includes(".png")) {
        element = document.createElement("img");
        element.classList.add("icon");
        element.src = icon;

    } else {
        element = document.createElement("i");
        element.classList.add("icon");
        element.classList.add("mdi");
        element.classList.add("mdi-" + icon);
    }

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
};

xplore.ReadFile = function (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var contents = e.target.result;
        displayContents(contents);
    };

    reader.readAsText(file);
};

xplore.SaveFile = function (data, filename, type, res) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);

    else { // Others
        var a = document.createElement("a");
        var url = URL.createObjectURL(file);

        if (type === "image/jpg" || type === "image/jpeg" || type === "image/png")
            a.href = data;
        else
            a.href = url;

        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            if (res)
                res();
        }, 0);
    }
};

xplore.Round = function (num, precision) {
    num = parseFloat(num);
    if (!precision) return num;

    return Math.round(num / precision) * precision;
};

xplore.IsEqual = function (num1, num2) {
    return Math.abs(num1 - num2) < Number.EPSILON;
};

xplore.Draggable = function (object, param) {
    let alongx = param.alongx;
    let alongy = param.alongy;
    let position;
    let height;
    let zindex;
    let left;
    let top;
    let oleft;
    let otop;

    object.onmousedown = function (e) {
        left = object.offsetLeft;
        top = object.offsetTop;

        oleft = left;
        otop = top;

        // Store this styles so that we can restore after dragging
        position = object.style.position;
        height = object.style.height;
        zindex = object.style["z-index"];

        object.resizing = true;
        object.currentx = e.clientX;
        object.currenty = e.clientY;
        object.style.height = object.parentElement.offsetHeight + "px";
        object.style.position = "absolute";
        object.style["z-index"] = "1000";

        object.style.left = left + "px";
        object.style.top = top + "px";

        document.body.onmousemove = function (e) {
            if (object.resizing) {
                left += e.clientX - object.currentx;
                top += e.clientY - object.currenty;

                if (alongx)
                    object.style.left = left + "px";
                else if (alongy)
                    object.style.top = top + "px";
                else {
                    object.style.left = left + "px";
                    object.style.top = top + "px";
                }

                object.currentx = e.clientX;
                object.currenty = e.clientY;

                if (param.ondrag) {
                    object.changex = left - oleft;
                    object.changey = top - otop;

                    oleft = left;
                    otop = top;

                    param.ondrag(object);
                }
            }
        }

        document.body.onmouseup = function (e) {
            let active = object.resizing;

            Dispose();

            if (active && param.dragend)
                param.dragend(object);
        };
    };

    object.onmouseup = function (e) {
        let active = object.resizing;

        Dispose();

        if (active && param.dragend)
            param.dragend(object);
    };

    function Dispose() {
        object.left = left;
        object.top = top;
        object.changex = left - oleft;
        object.changey = top - otop;

        delete object.resizing;
        delete document.body.onmousemove;

        delete object.currentx;
        delete object.currenty;
        object.style.height = height;
        object.style.position = position;
        object.style["z-index"] = zindex;
    }
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