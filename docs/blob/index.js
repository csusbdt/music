import c_img   from "../../global/img.js"    ;
import c_tone  from "../../global/tone.js"   ;
import xbutton from "../../global/xbutton.js";

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");

const img = n => new c_img("./blob/images/" + n + ".png");

const a_blue   = img("a_blue");
const a_yellow = a_blue.clone_yellow();
const a_border = img("a_border");
const a_tone   = new c_tone(90, 3, 1);
let   a        = 0;
const draw_a   = _ => { 
	if (a === 0) draw(a_blue);
	else draw(a_yellow);
	draw(a_border);
};
const click_a  = _ => {
	if (a_blue.click()) {
		if (window.stop_audio === null) start_audio();
		if (++a === 2) { a = 0; a_tone.stop(); }
		else a_tone.start();
		return true;
	}
	return false;
};

const start_audio = _ => {
	assert(window.stop_audio === null);
	if (a === 1) a_tone.start();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	a_tone.stop();
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const draw_audio = _ => {
	if (window.stop_audio === null) audio_blue.draw();
	else audio_yellow.draw();
};

const click_audio  = _ => {
	if (click(audio_blue)) {
		if (window.stop_audio !== null) window.stop_audio();
		else start_audio();
		return true;
	} else return false;
};

let start_external_audio = null;

const click_page = _ => {
	if (click(back_button)) {
		if (window.stop_audio === null) {
			if (start_external_audio !== null) start_external_audio();
		}
		run("./home/index.js");
	}
	else if (
		click_audio() || click_a() 
	) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_audio();
	draw(back_button);
	draw_a();
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	} else {
		start_external_audio = null;
	}
	set_item('page', "./blob/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
