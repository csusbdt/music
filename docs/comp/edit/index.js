import start_comp from "../comp/index.js";
import c_img      from "../img.js";
import c_button   from "../button.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_red    = new c_img("./global/images/upper_right_red.png"   , 900, 60, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button            = new c_button(upper_left_green, upper_left_border );
const stop_page_audio_button = new c_button(upper_right_red , upper_right_border);

stop_page_audio_button.action = _ => {
	if (unit.is_playing()) stop_page_audio_button.color = red;
	else stop_page_audio_button.color = green;
};

let unit = null;

const is_playing = _ => unit.is_playing;

const v_buttons = Array(6).fill(0).map((_, i) => new c_v_button(i));

Object.setPrototypeOf(c_v_button.prototype, c_button.prototype);

function c_v_button(i) {
	c_button.call(this, green, border, 200 + 100 * i, 300,
		_ => unit.volume((i + 1) / v_buttons.length)
	);
}

const stop_page_audio = _ => {
	if (unit.is_playing()) unit.stop(); else unit.start();
};

const click_page = _ => {
	if (back_button.click()) {
		start_comp();
	} else if (stop_page_audio_button.click()) {
		window.stop_page_audio();
		on_resize();
	}
};

const draw = o => { if (Array.isArray(o)) o.forEach(o => o.draw()); else o.draw(); };

const draw_page = _ => {
	draw(bg_blue);
	draw(back_button);
	draw(stop_page_audio_button);
	draw(v_buttons);
};

export default u => {
	unit = u;
	if (window.stop_page_audio !== null) window.stop_page_audio();
	window.stop_page_audio = stop_page_audio;
	unit.start();
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
