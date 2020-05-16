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

let line2f = xplore.canvasentity.Line2F.prototype;

Object.defineProperty(line2f, 'length', {
    get: function () {
        let x = this.x1 - this.x2;
        let y = this.y1 - this.y2;

        return Math.sqrt(x * x + y * y);
    }
});

Object.defineProperty(line2f, 'angle', {
    get: function () {
        if (this.x1 === this.x2) {
            if (this.y1 > this.y2)
                return 270;
            else
                return 90;

        } else if (this.y1 === this.y2) {
            if (this.x1 < this.x2)
                return 0;
            else
                return 180;

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

Object.defineProperty(line2f, 'anglerad', {
    get: function () {
        if (this.x1 === this.x2) {
            if (this.y1 > this.y2)
                return Math.PI * 1.5;
            else
                return Math.PI * 0.5;

        } else if (this.y1 === this.y2) {
            if (this.x1 < this.x2)
                return 0;
            else
                return Math.PI;

        } else {
            let x = this.x2 - this.x1;
            let y = this.y2 - this.y1;

            let angle = Math.atan(Math.abs(y) / Math.abs(x));

            if (x > 0) {
                if (y > 0)
                    return angle;
                else
                    return Math.PI * 2 - angle;
            } else {
                if (y > 0)
                    return Math.PI - angle;
                else
                    return Math.PI + angle;
            }
        }
    }
});


line2f.Slope = function () {
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

line2f.Intercept = function (slope) {
    return this.y1 - slope * this.x1;
};

line2f.Split = function (count) {
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

line2f.SplitBySpacing = function (spacing) {
    if (spacing <= 0)
        return this.Split(2);

    let length = this.length;

    if (length !== 0) {
        let number = Math.ceil(length / spacing) + 1;
        let points = [];
        let intervalx = (this.x2 - this.x1) / (number - 1);
        let intervaly = (this.y2 - this.y1) / (number - 1);

        for (let count = 0; count < number; count++) {
            points.push({ x: intervalx * count + this.x1, y: intervaly * count + this.y1 });
        }

        return points;
    }
};

line2f.StartOffset = function (offset) {
    let ratio = offset / this.length;
    let dx = (this.x2 - this.x1);
    let dy = (this.y2 - this.y1);

    return { x: ratio * dx + this.x1, y: ratio * dy + this.y1 };
};

line2f.EndOffset = function (offset) {
    let ratio = offset / this.length;
    let dx = (this.x2 - this.x1);
    let dy = (this.y2 - this.y1);

    return { x: this.x2 - ratio * dx, y: this.y2 - ratio * dy };
};

line2f.Intersection = function (point, includepoints, tol) {
    let tolerance = tol || 0.0001;
    let dx = this.x2 - this.x1;
    let dy = this.y2 - this.y1;

    if (!isNaN(point.x)) {
        //Point intersection
        let dxs = point.x - this.x1;
        let dys = point.y - this.y1;
        let length = Math.sqrt(dxs * dxs + dys * dys);
        let spoint = this.StartOffset(length);

        dxs = point.x - spoint.x;
        dys = point.y - spoint.y;
        length = Math.sqrt(dxs * dxs + dys * dys);

        return length < tolerance;

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

line2f.Offset = function (offset) {
    let dx = this.x1 - this.x2;
    let dy = this.y1 - this.y2;

    if (dx === 0 && dy === 0) {
        return new xplore.canvasentity.Line2F(
            this.x1,
            this.y1,
            this.x2,
            this.y2
        );

    } else if (dx === 0) {
        return new xplore.canvasentity.Line2F(
            this.x1 + offset,
            this.y1,
            this.x2 + offset,
            this.y2
        );

    } else if (dy === 0) {
        return new xplore.canvasentity.Line2F(
            this.x1,
            this.y1 + offset,
            this.x2,
            this.y2 + offset
        );

    } else {
        let r = dx / dy;
        let sign = Math.sign(offset);
        let x = Math.sqrt(offset * offset / (1 + r * r));
        let y = Math.sqrt(offset * offset - x * x);

        if (dx > 0 && dy > 0) {
            return new xplore.canvasentity.Line2F(
                this.x1 + sign * x,
                this.y1 - sign * y,
                this.x2 + sign * x,
                this.y2 - sign * y
            );

        } else if (dx > 0 && dy < 0) {
            return new xplore.canvasentity.Line2F(
                this.x1 + sign * x,
                this.y1 + sign * y,
                this.x2 + sign * x,
                this.y2 + sign * y
            );

        } else if (dx < 0 && dy < 0) {
            return new xplore.canvasentity.Line2F(
                this.x1 - sign * x,
                this.y1 + sign * y,
                this.x2 - sign * x,
                this.y2 + sign * y
            );

        } else {
            return new xplore.canvasentity.Line2F(
                this.x1 - sign * x,
                this.y1 - sign * y,
                this.x2 - sign * x,
                this.y2 - sign * y
            );
        }
    }
};