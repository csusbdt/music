import start_select_comp from "../index.js";
import start_edit from "../edit/index.js";
import c_img      from "../img.js";
import c_button   from "../button.js";
import c_unit     from "../unit.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const yellow = new c_img("./compose/images/yellow.png", 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button            = new c_button(upper_left_green , upper_left_border );
const stop_page_audio_button = new c_button(upper_right_green, upper_right_border);

const units        = [];
const play_buttons = [];
const edit_buttons = [];

const play_button_action = function(unit) {
	if (unit.g === null) {
		unit.start();
		this.color = red;
	} else {
		unit.stop();
		this.color = green;
	}
};

const edit_button_action = function(unit) {
	start_edit.call(null, unit);
};

const add_unit = _ => {
	const i = units.length;
	const unit = new c_unit();	
	const play_button = new c_button(green, border, 200 + 100 * i, 200);
	play_button.action = play_button_action.bind(play_button, unit);
	const edit_button = new c_button(yellow, border, 200 + 100 * i, 300);
	edit_button.action = edit_button_action.bind(edit_button, unit);
	units.push(unit);
	play_buttons.push(play_button);
	edit_buttons.push(edit_button);	
};

add_unit();
add_unit();
add_unit();

const is_playing = _ => units.some(unit => unit.is_playing());

const stop_page_audio = _ => {
	units.forEach(o => o.stop());
	play_buttons.forEach(o => o.color = green);
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
	} else if (edit_buttons.some(o => o.click())) {
		// noop
	} else if (play_buttons.some(o => o.click())) {
		if (is_playing()) window.stop_page_audio = stop_page_audio;
		on_resize();
	}
};

const draw = o => { if (Array.isArray(o)) o.forEach(o => o.draw()); else o.draw(); };

const draw_page = _ => {
	draw(bg_blue);
	draw(play_buttons);
	draw(edit_buttons);
	draw(back_button);
	draw(stop_page_audio_button);
};

export default _ => {
	if (is_playing()) {
		window.stop_page_audio = stop_page_audio;
	} else if (window.stop_page_audio !== null) {
		window.stop_page_audio();
	}
//	set_item('page', "./comp/comp/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
