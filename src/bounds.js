class Bounds {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    intersects(other) {
        return !(this.x + this.w <= other.x ||
            this.x >= other.x + other.w ||
            this.y + this.h <= other.y ||
            this.y >= other.y + other.h);
    }
}