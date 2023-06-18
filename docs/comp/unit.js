import c_img    from "./img.js";
import c_button from "./button.js";
import c_wave   from "./wave.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_unit(x = 0, y = 0) {
    this.x    = x;
    this.y    = y;
    this.wave = new c_wave();
}
c_unit.prototype.stop = function() {
    this.wave.stop();
};

c_unit.prototype.draw = function() {
    if (this.wave.g === null) {
        green.draw(this.x, this.y);
    } else {
        red.draw(this.x, this.y);
    }
    border.draw(this.x, this.y);
};

c_unit.prototype.click = function() {
    if (red.click(this.x, this.y)) {
        if (this.wave.g === null) {
            this.wave.start();
        } else {
            this.wave.stop();
        }
        return true;
    } else {
        return false;
    }
};

export default c_unit;
