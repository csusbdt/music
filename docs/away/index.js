import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";
import c_img          from "../img.js";
import c_button       from "../button.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const home     = new c_button(green, border, 10, -20, _ => start_home());
const far_away = new c_button(green, border, 300, 300, _ => start_far_away());

const draw = _ => {
	bg_blue.draw();
	home.draw();
	far_away.draw();
};

const click = _ => {
	if (home.click() || far_away.click()) {
		// noop
	}
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    on_resize();
};

export default start;
