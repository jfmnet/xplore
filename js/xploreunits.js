var UNITLENGTH = {
    MM: { name: "mm", value: 0.001 },
    CM: { name: "cm", value: 0.1 },
    M: { name: "m", value: 1 },
};

var units = function () {
    this.Initialize = function () {
        this.length = UNITLENGTH.M;
    };
};

var UNITS = new units().Initialize();