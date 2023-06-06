//import start_home     from "../home/index.js"   ;
//import start_far_away from "./far_away/index.js";

// function c_overlay(draw_func, click_func) {
// 	this.draw_func  = draw_func;
//     this.click_func = click_func;
// }

// c_overlay.prototype.draw = function() {
// 	this.draw_func();
// };

// c_overlay.prototype.click = function() {
// 	return this.click_func();
// };

const upper_left_yellow  = image("./global/images/upper_left_yellow.png" );
const lower_left_yellow  = image("./global/images/lower_left_yellow.png" );
const upper_right_yellow = image("./global/images/upper_right_yellow.png");
const lower_right_yellow = image("./global/images/lower_right_yellow.png");
const upper_left_border  = image("./global/images/upper_left_border.png" );
const lower_left_border  = image("./global/images/lower_left_border.png" );
const upper_right_border = image("./global/images/upper_right_border.png");
const lower_right_border = image("./global/images/lower_right_border.png");

const click = _ => {
    if (upper_left_yellow.click()) { // back
		return true;
	}
    if (lower_left_yellow .click() { // silence
		return true;
	}
    if (upper_right_yellow.click() { // menu
		return true;
	}
    if (lower_right_yellow.click() { // hide other buttons
		return true;
	}
};

const draw = _ => {
    upper_left_yellow .draw();
    lower_left_yellow .draw();
    upper_right_yellow.draw();
    lower_right_yellow.draw();
    upper_left_border .draw();
    lower_left_border .draw();
    upper_right_border.draw();
    lower_right_border.draw();
};

const o = overlay(draw, click);

export default o;
