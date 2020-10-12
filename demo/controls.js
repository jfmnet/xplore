xplore.Booth = function (param) {
    xplore.call(this, param, undefined, "booth");

    param = param || {};

    this.x = param.x;
    this.y = param.y;
    this.width = param.width;
    this.height = param.height;
};

let booth = xplore.Booth;
booth.prototype = Object.create(xplore.prototype);
booth.constructor = booth;

booth.prototype.Refresh = function () {
    this.object.innerHTML = "";
    this.object.style.left = this.x + "px";
    this.object.style.top = this.y + "px";
    this.object.style.width = this.width + "px";
    this.object.style.height = this.height + "px";

    let left = document.createElement("div");
    left.classList.add("booth-left");

    left.style.left = "0px";
    left.style.top = "0px";
    left.style.width = this.width * 0.1 + "px";
    left.style.height = this.height + "px";

    this.object.appendChild(left);

    let top = document.createElement("div");
    top.classList.add("booth-left");

    top.style.left = "0px";
    top.style.top = "0px";
    top.style.width = this.width + "px";
    top.style.height = this.height * 0.1 + "px";

    this.object.appendChild(top);

    let icon = document.createElement("div");
    icon.classList.add("icon");
    icon.style.left = this.width / 2 + "px";
    icon.style.top = this.height / 2 + "px";
    icon.innerHTML = "ICON";
    this.object.appendChild(icon);

    let button = document.createElement("div");
    button.classList.add("button");
    button.innerHTML = "ENTER";

    this.object.appendChild(button);
};