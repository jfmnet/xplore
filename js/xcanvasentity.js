xplore.canvasentity = function () {
    this.tolerance = 0.001;
};


//Point

xplore.canvasentity.Point2F = function (x, y) {
    xplore.canvasentity.call(this);

    this.x = x || 0;
    this.y = y || 0;
};

xplore.canvasentity.Point2F.prototype = Object.create(xplore.canvasentity.prototype);
xplore.canvasentity.Point2F.constructor = xplore.canvasentity.Point2F;

xplore.canvasentity.Point2F.prototype.Equal = function (x, y, tolerance) {
    if (x.x !== undefined) {
        let dx = this.x - x.x;
        let dy = this.y - x.y;

        if (tolerance)
            return Math.sqrt(dx * dx + dy * dy) <= tolerance;
        else
            return Math.sqrt(dx * dx + dy * dy) <= this.tolerance;

    } else {
        let dx = this.x - x;
        let dy = this.y - y;

        if (tolerance)
            return Math.sqrt(dx * dx + dy * dy) <= tolerance;
        else
            return Math.sqrt(dx * dx + dy * dy) <= this.tolerance;
    }
};


//Line

xplore.canvasentity.Line2F = function (x1, y1, x2, y2) {
    xplore.canvasentity.call(this);

    if (x1 !== undefined && x1.x1 !== undefined) {
        this.x1 = x1.x1 || 0;
        this.y1 = x1.y1 || 0;
        this.x2 = x1.x2 || 0;
        this.y2 = x1.y2 || 0;

    } else {
        this.x1 = x1 || 0;
        this.y1 = y1 || 0;
        this.x2 = x2 || 0;
        this.y2 = y2 || 0;
    }
};

xplore.canvasentity.Line2F.prototype = Object.create(xplore.canvasentity.prototype);
xplore.canvasentity.Line2F.constructor = xplore.canvasentity.Line2F;

Object.defineProperty(xplore.canvasentity.Line2F.prototype, 'length', {
    get: function () {
        let x = this.x1 - this.x2;
        let y = this.y1 - this.y2;

        return Math.sqrt(x * x + y * y);
    }
});

Object.defineProperty(xplore.canvasentity.Line2F.prototype, 'angle', {
    get: function () {
        if (this.x1 === this.x2) {
            if (this.y1 > this.y2)
                return 270;
            else
                return 90;
        } else {
            let x = this.x2 - this.x1;
            let y = this.y2 - this.y1;

            let angle = Math.atan(Math.abs(y) / Math.abs(x)) * (180 / Math.PI);

            if (x > 0) {
                if (y > 0)
                    return angle;
                else
                    return 360 - angle;
            } else {
                if (y > 0)
                    return 180 - angle;
                else
                    return 180 + angle;
            }
        }
    }
});

xplore.canvasentity.Line2F.prototype.Slope = function () {
    let x = this.x1 - this.x2;
    let y = this.y1 - this.y2;

    if (Math.abs(x) < 0.000001)
        x = 0;

    if (x === 0)
        return Number.POSITIVE_INFINITY;

    if (y === 0)
        return 0;

    return y / x;
};

xplore.canvasentity.Line2F.prototype.Intercept = function (slope) {
    return this.y1 - slope * this.x1;
};

xplore.canvasentity.Line2F.prototype.Split = function (count) {
    if (count < 2) {
        return [
            { x: this.x1, y: this.y1 },
            { x: this.x2, y: this.y2 }
        ]

    } else {
        let points = [];
        let intervalx = (this.x2 - this.x1) / (count - 1);
        let intervaly = (this.y2 - this.y1) / (count - 1);

        for (let count = 0; count < number; count++) {
            points[count] = new graphicsentity.Point2F(intervalx * count + this.x1, intervaly * count + this.y1);
        }

        return points;
    }
};

xplore.canvasentity.Line2F.prototype.StartOffset = function (offset) {
    let ratio = offset / this.length;
    let dx = (this.x2 - this.x1);
    let dy = (this.y2 - this.y1);

    return { x: ratio * dx + this.x1, y: ratio * dy + this.y1 };
};

xplore.canvasentity.Line2F.prototype.EndOffset = function (offset) {
    let ratio = offset / this.length;
    let dx = (this.x2 - this.x1);
    let dy = (this.y2 - this.y1);

    return { x: this.x2 - ratio * dx, y: this.y2 - ratio * dy };
};

xplore.canvasentity.Line2F.prototype.Intersection = function (point, includepoints) {
    let tolerance = 0.0001;
    let dx = this.x2 - this.x1;
    let dy = this.y2 - this.y1;

    if (point.x !== undefined) {
        //Point intersection
        let dxs = point.x - this.x1;
        let dys = point.y - this.y1;

        let dxe = point.x - this.x2;
        let dye = point.y - this.y2;

        if ((dy === 0 && dys === 0) || Math.abs(dx / dy - dxs / dys) < tolerance) {
            let offsets = Math.sqrt(dxs * dxs + dys * dys);
            let offsete = Math.sqrt(dxe * dxe + dye * dye);

            let length = this.length;

            if (offsets <= length && offsete <= length ) {
                if (includepoints)
                    return this.StartOffset(offsets);
                else {
                    if (offsets > 0 && offsets < length)
                        return this.StartOffset(offsets);
                }
            }
        }

    } else if (point.x1 !== undefined) {
        //Line intersection
        let slope1 = this.Slope();
        let b1 = 0;

        if (slope1)
            b1 = this.Intercept(slope1);

        let line = point;
        let slope2 = line.Slope();
        let b2 = 0;

        if (slope2)
            b2 = line.Intercept(slope2);

        let intersection;
        let x;
        let y;

        if (!slope1) {
            if (!slope2)
                return;

            y = slope2 * this.x1 + b2;
            intersection = { x: this.x1, y: y };

        } else if (!slope2) {
            y = slope1 * line.x2 + b1;
            intersection = { x: this.x2, y: y };

        } else {
            x = (b2 - b1) / (slope1 - slope2);
            y = slope1 * x + b1;

            intersection = { x: x, y: y };
        }

        if (this.Intersection(intersection))
            return intersection;

        return;
    }
};

this.GetPointIntersection = function (point, tolerance) {
    if (this.IsHorizontal()) {
        if (this.InBetweenX(point.x)) {
            if (WithinTolerance(this.point1.y, point.y, tolerance))
                return new graphicsentity.Point2F(point.x, this.point1.y);
        }
    } else if (this.IsVertical()) {
        if (this.InBetweenY(point.y)) {
            if (WithinTolerance(this.point1.x, point.x, tolerance))
                return new graphicsentity.Point2F(this.point1.x, point.y);
        }
    } else if (this.InBetweenX(point.x) && this.InBetweenY(point.y)) {
        var x = this.point1.x - this.point2.x;
        var y = this.point1.y - this.point2.y;
        var ratio = y / x;

        var value = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var tolerancex = Math.abs(value * tolerance / x);
        var tolerancey = Math.abs(value * tolerance / y);

        if (this.InBetweenXWithTolerance(point.x, tolerancex) && this.InBetweenYWithTolerance(point.y, tolerancey)) {

            if (Math.abs(x) > Math.abs(y)) {
                var compy = this.point1.y - (this.point1.x - point.x) * ratio;
                if (WithinTolerance(compy, point.y, tolerancex))
                    return new graphicsentity.Point2F(point.x, compy);
            } else {
                var compx = this.point1.x - (this.point1.y - point.y) / ratio;
                if (WithinTolerance(compx, point.x, tolerancey))
                    return new graphicsentity.Point2F(compx, point.y);
            }
        }
    }

    return;
};