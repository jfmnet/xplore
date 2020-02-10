"use strict";

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

    this.text = param.text || "";

    if (param.class)
        this.classname.push(param.class);

    this.object;
    this.parent;
    this.children = [];
    this.events = {};

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

    for (let i = 0; i < this.classname.length; i++) {
        if (this.classname[i])
            this.object.classList.add(this.classname[i]);
    }

    this.parent.appendChild(this.object);

    this.Refresh();
};

xplore.prototype.Dispose = function () {
    this.object.remove();
};

xplore.prototype.Refresh = function () {
    this.object.innerHTML = "";
    this.object.append(this.text);

    //Children
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].Show(this.object);
    }

    this.Events();
};

xplore.prototype.Events = function () {
    let self = this;

    if (this.onclick) {
        this.object.onclick = function () {
            self.onclick(self);
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
                if (child[child] && child[child].Show) {
                    this.children.push(child[child]);

                    if (this.object) {
                        child[name].Show(this.object);
                    }
                }
            }
        }

        return child;
    }
};

xplore.prototype.SetVisibility = function (visibility) {
    if (this.object) {
        if (visibility)
            this.object.classList.remove("hidden");
        else
            this.object.classList.add("hidden");
    } else {
        if (!visibility)
            this.classname.push("hidden");
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

xplore.prototype.Listen = function (name, event) {
    if (event) {
        //Initialize event name
        if (!this.events[name])
            this.events[name] = [];

        let add = true;

        //Check if event exists
        for (let e in this.events[name]) {
            if (this.events[name][e] === event) {
                add = false;
                break;
            }
        }

        //Add event
        if (add)
            this.events[name].push(event);
    }
};

xplore.prototype.Trigger = function (name) {
    if (this.events[name]) {
        let event;

        for (let e in this.events[name]) {
            event = this.events[name][e];

            if (event.Show) {
                event.text = this.value;
                event.Refresh();
            } else {
                event(this);
            }
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

    this.value = param.value || "";
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
        input.value = this.value;

        label.appendChild(input);

    } else {
        let input = document.createElement("input");
        input.type = this.type;
        input.value = this.value;

        this.object.appendChild(input);

    }

    this.Events();
};

xplore.Textbox.prototype.Events = function () {
    let input = this.object.querySelector("input");
    let self = this;

    input.addEventListener('input', function () {
        self.value = this.value;

        if (self.bind)
            self.bind.object[self.bind.name] = self.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    });
};



xplore.Checkbox = function (param) {
    xplore.call(this, param, undefined, ["input", "checkbox"]);

    param = param || {};

    this.value = param.value || "";
    this.type = param.type || "text";

    this.onchange = param.onchange;
    this.bind = param.bind;

    if (param.inline)
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
        let label = document.createElement("label");
        this.object.appendChild(label);

        let text = document.createElement("div");
        text.innerText = this.text;
        label.appendChild(text);

        select = document.createElement("select");
        label.appendChild(select);

    } else {
        select = document.createElement("select");
        this.object.appendChild(input);
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




//Split container

xplore.SplitContainer = function (param) {
    xplore.call(this, param, undefined, "split-container");

    param = param || {};

    this.orientation = param.orientation;
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
    this.Events();
};

xplore.SplitContainer.prototype.Resize = function () {
    let width = this.parent.clientWidth;
    let height = this.parent.clientHeight;
    let gap = this.splittersize / 2;

    if (this.size) {
        if (this.orientation) {
            //Vertical

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

        } else {
            //Horizontal
            this.panel1.style = "left: 0; width: calc(50% - " + gap + "px); top: 0; bottom: 0 ";
            this.panel2.style = "right: 0; width: calc(50% - " + gap + "px); top: 0; bottom: 0 ";
            this.gap.style = "left: calc(50% - " + gap + "px); width: " + this.splittersize + "px; top: 0; bottom: 0 ";
        }
    }
};

xplore.SplitContainer.prototype.Add = function () {
};

xplore.SplitContainer.prototype.Set = function (child, index) {
    if (child) {
        let panel = index === 0 || index === undefined ? this.panel1 : this.panel2;

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
                child.showfooter = false;
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
};



//Form

xplore.Form = function (param) {
    xplore.call(this, param, undefined, "form");

    param = param || {};

    this.text = param.text || "";
    this.width = param.width || 400;
    this.height = param.height || 600;
    this.ok = param.oktext || "OK";
    this.cancel = param.canceltext || "Cancel";
    this.modal = param.modal || true;

    this.showheader = param.showheader || true;
    this.showfooter = param.showfooter || true;

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

    let button = new xplore.Button({
        text: xplore.DisplayIcon("close"),
        onclick: function () {
            self.Close();
        }
    });

    button.Show(buttons);
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
                    self.object.style.left = self.object.offsetLeft + (e.clientX - self.currentx) + "px";
                    self.object.style.top = self.object.offsetTop + (e.clientY - self.currenty) + "px";

                    self.currentx = e.clientX;
                    self.currenty = e.clientY;
                }
            };
        };

        this.header.onmouseup = function (e) {
            self.resizing = false;
            document.body.onmousemove = undefined;
        };
    }
};



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

xplore.DisplayIcon = function (icon) {
    let element = document.createElement("i");
    element.classList.add("mdi");
    element.classList.add("mdi-" + icon);

    return element;
};

xplore.ZINDEX = 100;


//Application start
window.onload = function () {
    if (xplore.main)
        xplore.main();
};