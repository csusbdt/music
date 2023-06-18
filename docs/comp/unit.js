import c_img      from "./img.js";
import c_button   from "./button.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_unit(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

c_unit.prototype.draw = function() {
    red.draw(this.x, this.y);
    border.draw(this.x, this.y);
};

c_unit.prototype.click = function() {
    return red.click(this.x, this.y);
};

export default c_unit;
