import c_img    from "../img.js";
import c_button from "../button.js";
import c_wave   from "../wave.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_unit(x = 0, y = 0) {
    this.x    = x;
    this.y    = y;
    this.wave = new c_wave();
    this.play_button_off = new c_button(green, border, this.x, this.y   );
    this.play_button_on  = new c_button(red, border, this.x, this.y     );
    //this.edit_button = new c_button(yellow, border, this.x, this.y + 100);
}

c_unit.prototype.stop = function() {
    this.wave.stop();
};

c_unit.prototype.draw = function() {
    if (this.wave.g === null) {
        this.play_button_off.draw();
    } else {
        this.play_button_on.draw();
    }
//    this.edit_button.draw();
};

c_unit.prototype.click = function() {
    if (this.play_button_off.click(this.x, this.y)) {
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
