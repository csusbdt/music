import c_img      from "../img.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_controller(x, y, n, max_n, action) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.max_n = max_n;
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

// const volume_controller = {
// 	x: 0,
// 	y: 200,
// 	spacing: 100,
// 	n: 3,
// 	max_n: 8,
// 	draw_x: function(i) { return this.x + this.spacing * i; },
// 	draw_y: function(i) { return this.y; },
// 	draw: function() {
// 		for (let i = 0; i < this.max_n; ++i) {
// 			if (i === this.n) {
// 				red.draw(this.draw_x(i), this.draw_y(i));
// 			} else {
// 				green.draw(this.draw_x(i), this.draw_y(i));
// 			}
// 			border.draw(this.draw_x(i), this.draw_y(i));
// 		}
// 	},
// 	click: function() {
// 		for (let i = 0; i < this.max_n; ++i) {
// 			if (red.click(this.draw_x(i), this.draw_y(i))) {
// 				this.n = i;
// 				unit.set_volume(this.n / this.max_n)
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// };

// ///////////////////////////////////////////////////////////////////////////////

// const octave_controller = {
// 	x: 0,
// 	y: 300,
// 	spacing: 100,
// 	max_octaves: 5,
// 	draw_x: function(i) { return this.x + this.spacing * i; },
// 	draw_y: function(i) { return this.y; },
// 	draw: function() {
// 		for (let i = 0; i < this.max_octaves; ++i) {
// 			if (i === unit.octave) {
// 				red.draw(this.draw_x(i), this.draw_y(i));
// 			} else {
// 				green.draw(this.draw_x(i), this.draw_y(i));
// 			}
// 			border.draw(this.draw_x(i), this.draw_y(i));
// 		}
// 	},
// 	click: function() {
// 		for (let i = 0; i < this.max_octaves; ++i) {
// 			if (red.click(this.draw_x(i), this.draw_y(i))) {
// 				unit.set_octave(i);
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// };

export default c_controller;
