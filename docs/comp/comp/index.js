import start_select_comp from "../index.js";
import c_img      from "../img.js";
import c_button   from "../button.js";
import c_unit     from "../unit.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button            = new c_button(upper_left_green , upper_left_border );
const stop_page_audio_button = new c_button(upper_right_green, upper_right_border);

let comp_i = null;

const units = [
	new c_unit(260, 320),
	new c_unit(360, 320),
	new c_unit(460, 320)
];

const is_playing = _ => {
	return units.some(o => o.wave.g !== null);
};

const stop_page_audio = _ => {
	units.forEach(o => o.stop());
	window.stop_page_audio = null;
};

const click_page = _ => {
	if (back_button.click()) {
		start_select_comp();
	} else if (stop_page_audio_button.click()) {
		if (window.stop_page_audio !== null) {
			window.stop_page_audio();
			on_resize();
		}
		if (is_playing()) window.stop_page_audio = stop_page_audio;
	} else if (units.some(o => o.click())) {
		if (is_playing()) window.stop_page_audio = stop_page_audio;
		on_resize();
	}
};

const draw = o => { if (Array.isArray(o)) o.forEach(o => o.draw()); else o.draw(); };

const draw_page = _ => {
	draw(bg_blue);
	draw(units);
	draw(back_button);
	draw(stop_page_audio_button);
};

export default _ => {
	if (is_playing()) {
		window.stop_page_audio = stop_page_audio;
	} else if (window.stop_page_audio !== null) {
		window.stop_page_audio();
	}
	set_item('page', "./comp/comp/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};