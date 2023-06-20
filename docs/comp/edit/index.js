import start_comp   from "../comp/index.js";
import c_img        from "../img.js";
import c_button     from "../button.js";
import c_unit       from "../unit.js";
import c_controller from "./controller.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_red    = new c_img("./global/images/upper_right_red.png"   , 900, 60, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button = new c_button(upper_left_green, upper_left_border );

let unit = null;

const stop_page_audio = _ => {
	if (unit.is_playing()) {
		unit.stop(); 
		stop_page_audio_button.color = upper_right_green;
	} else {
		stop_page_audio_button.color = upper_right_red;
	}
};

const stop_page_audio_button = new c_button(upper_right_red , upper_right_border, 0, 0, stop_page_audio);

let volume_controller = null;
let octave_controller = null;

const click_page = _ => {
	if (back_button.click()) {
		start_comp();
	} 
	else if (stop_page_audio_button.click()) on_resize();
	else if (volume_controller.click()) on_resize();
	else if (octave_controller.click()) on_resize();
};

const draw = o => { if (Array.isArray(o)) o.forEach(o => o.draw()); else o.draw(); };

const draw_page = _ => {
	draw(bg_blue);
	draw(back_button);
	draw(stop_page_audio_button);
	draw(volume_controller);
	draw(octave_controller);
};

export default u => {
	unit = u;
	volume_controller = new c_controller(
		0, 200, unit.volume, c_unit.prototype.max_volume, i => unit.set_volume(i)
	);
	octave_controller = new c_controller(
		0, 300, unit.octave, 5, i => unit.set_octave(i)
	);
	if (window.stop_page_audio !== null) window.stop_page_audio();
	window.stop_page_audio = stop_page_audio;
	unit.start();
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
