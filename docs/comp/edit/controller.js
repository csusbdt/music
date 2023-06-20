import c_img      from "../img.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_controller(x, y, n, max_n, action) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.max_n = max_n;
    this.spacing = 100;
    this.action = action;
}

c_controller.prototype.draw = function() {
    for (let i = 0; i < this.max_n; ++i) {
        if (i === this.n) {
            red.draw(this.x + this.spacing * i, this.y);
        } else {
            green.draw(this.x + this.spacing * i, this.y);
        }
        border.draw(this.x + this.spacing * i, this.y);
    }
};

c_controller.prototype.click = function() {
    for (let i = 0; i < this.max_n; ++i) {
        if (red.click(this.x + this.spacing * i, this.y)) {
            this.n = i;
            if (this.action !== null) this.action(i);
            return true;
        }
    }
    return false;
};

export default c_controller;
