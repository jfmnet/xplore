"use strict";

//Base
var xplore = function (param, element, classname) {
    param = param || {};

    this.element = element || param.element || "div";
    this.classname = [classname];

    if (param.class)
        this.classname.push(classname);

    this.text = param.text || "";
    this.object;
    this.parent;
    this.children = [];
    this.events = {};

    //Events
    this.onclick = param.onclick;
};

xplore.prototype.Show = function (parent) {
    if (parent && parent.append) {
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
                event(self);
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


//TextBox
xplore.TextBox = function (param) {
    xplore.call(this, param, undefined, "textbox");

    param = param || "";

    this.value = param.value || "";
    this.type = param.type || "text";

    this.onchange = param.onchange;
};

xplore.TextBox.prototype = Object.create(xplore.prototype);
xplore.TextBox.constructor = xplore.TextBox;

xplore.TextBox.prototype.Refresh = function () {
    this.object.innerHTML = "";

    let input = document.createElement("input");
    input.type = this.type;
    input.value = this.value;

    this.object.appendChild(input);
    this.Events();
};

xplore.TextBox.prototype.Events = function () {
    let input = this.object.querySelector("input");
    let self = this;

    input.addEventListener('input', function () {
        self.value = this.value;

        if (self.onchange)
            self.onchange(self);

        self.Trigger("onchange");
    });
};


//Enums
xplore.STATE = {
    ENABLED: 1,
    DISABLED: 2
};


//Application start
window.onload = function () {
    if (xplore.main)
        xplore.main();
};