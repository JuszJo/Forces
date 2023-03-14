export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    };

    addStatic(vector1, vector2) {
        var vector3 = new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
        return vector3;
    };

    sub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    };

    subStatic(vector1, vector2) {
        var vector3 = new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
        return vector3;
    };

    mult(n) {
        this.x *= n;
        this.y *= n;
    };

    div(n) {
        this.x /= n;
        this.y /= n;
    };

    divStatic(vector1, vector2) {
        var vector3 = new Vector(vector1.x / vector2.x, vector1.y / vector2.y);
        return vector3;
    };

    mag() {
        return Math.sqrt((Math.pow(this.x, 2) + (Math.pow(this.y, 2))));
    };

    normalize() {
        var m = this.mag();
        if(m != 0) {
            this.div(m);
        };
    };

    limit(n) {
        if(this.y >= n) {
            this.y = n;
        }
        if(this.x >= n) {
            this.x = n;
        }
        if(this.y < 0 && Math.abs(this.y) >= n) {
            this.y = -n;
        }
        if(this.x < 0 && Math.abs(this.x) >= n) {
            this.x = -n;
        }
    };

    makeCopy() {
        var copy = new Vector(this.x, this.y);
        return copy;
    };

    dot(vector) {
        var dot = (this.x * vector.x) + (this.y * vector.y);

        return dot;
    };

    getAngle(vector) {
        var angle = Math.acos(this.dot(vector));

        return angle;
    }
};